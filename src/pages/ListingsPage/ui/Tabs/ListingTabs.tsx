import React, { FC, useState } from "react";
import usePublicationStore from "shared/stores/publications/usePublicationStore.ts";

import { Tabs } from "@mantine/core";

import { Deals } from "../Deals/Deals";
import { ListingPage } from "../Listing";
import { ListingPublications } from "../ListingPublications/ListingPublications";
import { ProspectsList } from "../Prospects";

interface ListingTabProps {}

export const ListingTabs: FC<ListingTabProps> = () => {
	const { setPublicationStoreData } = usePublicationStore();
	const [defaultTab, setDefaultTab] = useState<string | null>("general-info");
	const onChange = (value: string | null) => {
		setDefaultTab(value);
		setPublicationStoreData({ videos: [], photos: [], selectedPubTab: undefined });
	};
	return (
		<Tabs value={defaultTab} onChange={onChange} my="sm">
			<Tabs.List>
				<Tabs.Tab value="general-info">General Info</Tabs.Tab>
				<Tabs.Tab value="publications">Publications</Tabs.Tab>
				<Tabs.Tab value="prospects">Prospects</Tabs.Tab>
				{/*<Tabs.Tab value="deals">Pending deals</Tabs.Tab>*/}
			</Tabs.List>

			<Tabs.Panel value="general-info">
				<ListingPage setDefaultTab={setDefaultTab} />
			</Tabs.Panel>

			<Tabs.Panel value="publications">
				<ListingPublications />
			</Tabs.Panel>

			<Tabs.Panel value="prospects">
				<ProspectsList />
			</Tabs.Panel>

			{/*<Tabs.Panel value="deals">*/}
			{/*	<Deals />*/}
			{/*</Tabs.Panel>*/}
		</Tabs>
	);
};
