import { Contact, ContactsRole } from "./contacts.ts";
import { Meta } from "./meta";

export interface ListingPublicationsList {
	list: ListingPublication[];
	meta: Meta;
}

export interface ListingPublication {
	id: string;
	listingId: string;
	highlightCategories: HighlightCategory[];
	contactsData: Contact[];
	status: string;
	landlordUpgrades: string[];
	tenantUpgrades: string[];
	createdAt: string;
	updatedAt: string;
	alertFeature?: string;
	communicationMethod?: string;
	freeRentTime?: number;
	incentives?: string;
	isBidPrising?: boolean;
	landlordsPriceCents?: number;
	legalRent?: string;
	llPaysForCommunication?: boolean;
	longestLeaseDuration?: number;
	longestLeasePriceDiff?: number;
	noFeeListing?: boolean;
	officialAvailabilityDate?: string;
	partyPayingAmountCents?: number;
	payingParty?: string;
	publicationAddress?: string;
	publicationPriceCents?: number;
	rentStabilized?: boolean;
	requireRentTime?: number;
	reversePriceCents?: number;
	shortestLeaseDuration?: number;
	shortestLeasePriceDiff?: number;
	startBidCents?: number;
	tenantLeaseExpirationDate?: string;
	tenantVacateNotice?: string;
	turnoverHandler?: string;
	turnoverOrder?: string;
	turnoverTime?: string;
	publicationType?: string;
	contacts: ContactsRole[];
}

export interface HighlightCategory {
	categoryName: string;
	highlights: string[];
}
