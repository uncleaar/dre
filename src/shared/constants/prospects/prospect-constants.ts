export const PetsTypes = {
	dog: "dog",
	cat: "cat",
	bird: "bird",
	other: "other"
} as const;

export const ProspectProfileTypes = {
	unknown: "unknown",
	rentalResidential: "rentalResidential",
	rentalCommercial: "rentalCommercial",
	saleResidential: "saleResidential",
	saleCommercial: "saleCommercial"
} as const;

export const ProspectInquiryManagerPriority = {
	critical: "critical",
	urgent: "urgent",
	review: "review",
	newInquiry: "newInquiry",
	high: "high",
	medium: "medium",
	low: "low",
	whatever: "whatever",
	void: "void"
};
