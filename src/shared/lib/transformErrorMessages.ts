import _ from "lodash";

export const transformErrorMessages = (error: any): string => {
	if (typeof error.response?.data?.message === "string") {
		return error?.message;
	} else if (_.isArray(error.response?.data?.message)) {
		return error.response?.data?.message.join(". ");
	} else {
		return "An error occurred";
	}
};
