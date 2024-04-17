import { api } from "shared/api/api";
import { addVideo } from "shared/api/videos.ts";

export class Uploader {
	chunkSize: any;
	threadsQuantity: number;
	file: any;
	fileName: any;
	mimetype: string;
	aborted: boolean;
	uploadedSize: number;
	progressCache: any;
	activeConnections: any;
	parts: any[];
	uploadedParts: any[];
	fileId: null;
	fileKey: null;
	entityId: string;
	onProgressFn: (err: any) => void;
	onErrorFn: (err: any) => void;
	onSuccessFn: (err: any) => void;
	constructor(options: any) {
		// this must be bigger than or equal to 5MB,
		// otherwise AWS will respond with:
		// "Your proposed upload is smaller than the minimum allowed size"
		this.chunkSize = options.chunkSize || 1024 * 1024 * 5;
		// number of parallel uploads
		this.threadsQuantity = 1;
		this.file = options.file;
		this.mimetype = options.mimetype;
		this.fileName = options.fileName;
		this.aborted = false;
		this.uploadedSize = 0;
		this.progressCache = {};
		this.activeConnections = {};
		this.parts = [];
		this.uploadedParts = [];
		this.fileId = null;
		this.fileKey = null;
		this.entityId = options.entityId;
		this.onProgressFn = () => {};
		this.onErrorFn = () => {};
		this.onSuccessFn = () => {};
	}

	// starting the multipart upload request
	start() {
		this.initialize();
	}

	async initialize() {
		try {
			// adding the file extension (if present) to fileName
			const parts = this.file.name.split(".");
			let fileName = parts[0];
			if (parts[1]) {
				fileName += `.${parts[1]}`;
			}

			// initializing the multipart request
			const UploadInput = {
				name: fileName
			};

			const initializeResponse = await api.request({
				url: "/file-upload/create-multipart",
				method: "POST",
				data: UploadInput
			});

			const AWSFileDataOutput = initializeResponse.data;

			this.fileId = AWSFileDataOutput.UploadId;
			this.fileKey = AWSFileDataOutput.Key;

			// retrieving the pre-signed URLs
			const numberOfParts = Math.ceil(this.file.size / this.chunkSize);

			const newParts: any[] = [];
			for (let i = 0; i < numberOfParts; i++) {
				const AWSMultipartFileDataInput = {
					UploadId: this.fileId,
					Key: this.fileKey,
					PartNumber: i + 1
				};

				const urlsResponse = await api.request({
					url: "/file-upload/get-presigned-url",
					method: "POST",
					data: AWSMultipartFileDataInput
				});

				newParts.push({
					signedUrl: urlsResponse.data,
					PartNumber: i + 1
				});
			}

			this.parts.push(...newParts);

			this.sendNext();
		} catch (error) {
			await this.complete(error);
		}
	}

	sendNext() {
		const activeConnections = Object.keys(this.activeConnections).length;

		if (activeConnections >= this.threadsQuantity) {
			return;
		}

		if (!this.parts.length) {
			if (!activeConnections) {
				this.complete();
			}

			return;
		}

		const part: any = this.parts.pop();

		if (this.file && part) {
			const sentSize = (part.PartNumber - 1) * this.chunkSize;
			const chunk = this.file.slice(sentSize, sentSize + this.chunkSize);

			const sendChunkStarted = () => {
				this.sendNext();
			};

			this.sendChunk(chunk, part, sendChunkStarted)
				.then(() => {
					this.sendNext();
				})
				.catch((error) => {
					this.parts.push(part);

					this.complete(error);
				});
		}
	}

	// terminating the multipart upload request on success or failure
	async complete(error?: any) {
		if (error && !this.aborted) {
			this.onErrorFn(error);
			return;
		}

		if (error) {
			this.onErrorFn(error);
			return;
		}

		try {
			await this.sendCompleteRequest();
		} catch (error) {
			this.onErrorFn(error);
		}
	}

	// finalizing the multipart upload request on success by calling
	// the finalization API
	async sendCompleteRequest() {
		if (this.fileId && this.fileKey) {
			const videoFinalizationMultiPartInput = {
				UploadId: this.fileId,
				Key: this.fileKey,
				parts: this.uploadedParts
			};

			const completeResult = await api.request<{ fileId: string }>({
				url: "/file-upload/complete-multipart",
				method: "POST",
				data: videoFinalizationMultiPartInput
			});

			if (completeResult?.data?.fileId) {
				this.addVideoToEntity(completeResult.data.fileId);
			}
		}
	}

	async addVideoToEntity(fileId: string) {
		const addResult = await addVideo(this.entityId, { fileId, mimetype: this.mimetype });
		this.onSuccessFn(addResult);
	}

	sendChunk(chunk: any, part: any, sendChunkStarted: any) {
		return new Promise((resolve, reject) => {
			this.upload(chunk, part, sendChunkStarted)
				.then((status) => {
					if (status !== 200) {
						reject(new Error("Failed chunk upload"));
						return;
					}

					resolve(1);
				})
				.catch((error) => {
					reject(error);
				});
		});
	}

	// calculating the current progress of the multipart upload request
	handleProgress(part: any, event: any) {
		if (this.file) {
			if (event.type === "progress" || event.type === "error" || event.type === "abort") {
				this.progressCache[part] = event.loaded;
			}

			if (event.type === "uploaded") {
				this.uploadedSize += this.progressCache[part] || 0;
				delete this.progressCache[part];
			}

			const inProgress = Object.keys(this.progressCache)
				.map(Number)
				.reduce((memo, id) => (memo += this.progressCache[id]), 0);

			const sent = Math.min(this.uploadedSize + inProgress, this.file.size);

			const total = this.file.size;

			const percentage = Math.round((sent / total) * 100);

			this.onProgressFn({
				sent: sent,
				total: total,
				percentage: percentage
			});
		}
	}

	// uploading a part through its pre-signed URL
	upload(file: any, part: any, sendChunkStarted: any) {
		// uploading each part with its pre-signed URL
		return new Promise((resolve, reject) => {
			if (this.fileId && this.fileKey) {
				// - 1 because PartNumber is an index starting from 1 and not 0
				const xhr = (this.activeConnections[part.PartNumber - 1] = new XMLHttpRequest());

				sendChunkStarted();

				const progressListener = this.handleProgress.bind(this, part.PartNumber - 1);

				xhr.upload.addEventListener("progress", progressListener);

				xhr.addEventListener("error", progressListener);
				xhr.addEventListener("abort", progressListener);
				xhr.addEventListener("loadend", progressListener);

				xhr.open("PUT", part.signedUrl);

				xhr.onreadystatechange = () => {
					if (xhr.readyState === 4 && xhr.status === 200) {
						// retrieving the ETag parameter from the HTTP headers
						const ETag = xhr.getResponseHeader("ETag");

						if (ETag) {
							const uploadedPart = {
								PartNumber: part.PartNumber,
								// removing the " enclosing characters from
								// the raw ETag

								ETag: ETag.replaceAll("", "")
							};

							this.uploadedParts.push(uploadedPart);

							resolve(xhr.status);
							delete this.activeConnections[part.PartNumber - 1];
						}
					}
				};

				xhr.onerror = (error) => {
					reject(error);
					delete this.activeConnections[part.PartNumber - 1];
				};

				xhr.onabort = () => {
					reject(new Error("Upload canceled by user"));
					delete this.activeConnections[part.PartNumber - 1];
				};

				xhr.send(file);
			}
		});
	}

	onProgress(onProgress: any) {
		this.onProgressFn = onProgress;
		return this;
	}

	onError(onError: any) {
		this.onErrorFn = onError;
		return this;
	}

	onSuccess(onSuccess: any) {
		this.onSuccessFn = onSuccess;
		return this;
	}

	abort() {
		Object.keys(this.activeConnections)
			.map(Number)
			.forEach((id) => {
				this.activeConnections[id].abort();
			});

		this.aborted = true;

		const videoFinalizationMultiPartInput = {
			UploadId: this.fileId,
			Key: this.fileKey
		};

		api.request({
			url: "/abort-multipart",
			method: "POST",
			headers: {
				"Content-Type": "multipart/form-data"
			},
			data: videoFinalizationMultiPartInput
		});
	}
}
