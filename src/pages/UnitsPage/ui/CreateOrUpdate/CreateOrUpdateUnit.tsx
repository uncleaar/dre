import React, { FC, useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { getBuildingById } from "shared/api/buildings";
import {
	getListingPublicationsUnit,
	updateListingPublicationUnit
} from "shared/api/listing-publications-units";
import { createUnitById, getUnit, updateUnit } from "shared/api/units";
import { ROUTES } from "shared/constants";
import { SUCCESS_MESSAGES } from "shared/constants/success-messages";
import { transformFormValuesToUnit } from "shared/lib/transformFormValueToUnit.ts";
import { transformUnitToFormValues } from "shared/lib/transformUnitToFormValues";
import { createUnitSchema } from "shared/validation/createUnit";

import { yupResolver } from "@hookform/resolvers/yup";
import { Button, Container, Divider, Flex, Modal, Text, Title } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { Unit } from "../../../../types/unit";
import { BuildingAmenities } from "../../../BuildingsPage/ui/CreateOrUpdate/Amenities/BuildingAmenities.tsx";
import { BuildingContacts } from "../../../BuildingsPage/ui/CreateOrUpdate/Contacts/BuildingContacts.tsx";
import { CreateAmenityOrUpdate } from "../../../SettingsPage/ui/AmenitiesPage/ui/CreateOrUpdate/CreateAmenityOrUpdate";
import { CreateContactOrUpdate } from "../../../SettingsPage/ui/ContactsPage/ui/CreateOrUpdate/CreateContactOrUpdate";
import { FormCreateOrUpdateUnit } from "../Form/FormCreateOrUpdateUnit.tsx";

import styles from "./CreateUnit.module.scss";

export interface FormValues {
	amenities: string[];
	unitName: string;
	contacts: [];
	address?: string;
	buildingId: string;
	unitRent: number;
	// status?: any;
	unitNumber?: string;
	floor?: number;
	haveKey?: boolean;
	forSale?: boolean;
	forRent?: boolean;
	useActualSqrFt?: boolean;
	hasLockbox?: boolean;
	availability?: Date;
	shiftingFeePrice?: string;
	lockboxType?: string;
	lockboxCode?: string;
	altUnitNumber?: string;
	keyArchiveNumber?: string;
	specialPrice?: number;
	specialPriceNote?: string;
	feeType?: "fee" | "noFee" | "shiftingFee";
	feePercentage?: number;
	notes?: string;
	SqrFt: number;
}

interface CreateUnitProps {
	edit?: any;
}

export const CreateOrUpdateUnit: FC<CreateUnitProps> = ({ edit }) => {
	const navigate = useNavigate();

	const { id } = useParams<{ id: string | undefined }>();
	const { listingId } = useParams<{ listingId: string | undefined }>();

	const [openedContact, { open: openContact, close: closeContact }] = useDisclosure(false);
	const [openedAmenity, { open: openAmenity, close: closeAmenity }] = useDisclosure(false);

	const queryClient = useQueryClient();
	const [error, setError] = useState();

	const { data, isLoading: isLoadingUnit } = useQuery({
		queryKey: ["unit", id],
		queryFn: !listingId
			? () => getUnit(id as string, { contacts: true, amenities: true })
			: () =>
					getListingPublicationsUnit(listingId as string, id as string, {
						contacts: true,
						amenities: true
					}),
		keepPreviousData: true,
		enabled: !!id
	});

	const { data: buildingData, isLoading: isBuildingLoading } = useQuery({
		queryKey: [id],
		queryFn: async () => getBuildingById(data?.buildingId as string, {}),
		keepPreviousData: true,
		enabled: !!id && !!data?.buildingId
	});

	const formMethods = useForm<FormValues>({ resolver: yupResolver(createUnitSchema) });

	useEffect(() => {
		if (data && buildingData) {
			const init = transformUnitToFormValues(data, buildingData);
			formMethods.reset(init);
		}
	}, [data, buildingData]);

	const { mutate: update, isLoading: isLoadingUserUpdate } = useMutation({
		mutationFn: !listingId
			? async (data: Unit) => await updateUnit(data, id as string)
			: async (data: Unit) =>
					await updateListingPublicationUnit(listingId as string, id as string, data),
		onSuccess: async () => {
			await queryClient.invalidateQueries([!listingId ? "units" : "listing-publications-units"]);
			notifications.show({ title: "Success", message: SUCCESS_MESSAGES.unit_update });
			!listingId ? navigate(ROUTES.UNITS) : navigate(ROUTES.LISTINGS);
		},
		onError: (error: any) => {
			notifications.show({
				title: "Error",
				message: "An error occurred while creating the building."
			});
		}
	});

	const { mutate: create, isLoading } = useMutation({
		mutationKey: ["units"],
		mutationFn: async (data: Unit) => await createUnitById(data.buildingId, data),
		onSuccess: async () => {
			await queryClient.invalidateQueries({ queryKey: ["units"] });
			notifications.show({ title: "Success", message: SUCCESS_MESSAGES.unit_create });
			navigate(ROUTES.UNITS);
		},
		onError: (error: any) => {
			setError(error.response.data.message);
		}
	});

	const onSubmit = (data: Unit) => {
		const transformed = transformFormValuesToUnit(data);
		if (!edit) {
			create(transformed as any);
		} else {
			update(transformed);
		}
	};

	return (
		<Container>
			<FormProvider {...formMethods}>
				<Flex onSubmit={formMethods.handleSubmit(onSubmit)} component="form" className={styles.box}>
					<Title className={styles.title} order={3}>
						{edit ? "Update unit" : "ListingCreate unit"}
					</Title>

					<FormCreateOrUpdateUnit edit={edit} listingId={listingId} />

					<Divider my="sm" />

					<BuildingContacts open={openContact} />

					<Divider />
					{/*TODO: create room*/}
					{/*<Button my={10} w={150}>*/}
					{/*	ListingCreate room*/}
					{/*</Button>*/}

					<Divider />

					<BuildingAmenities open={openAmenity} />

					<Text color="red">{error}</Text>
					<Flex gap={20}>
						<Button onClick={() => navigate(-1)} w={100}>
							Back
						</Button>

						<Button variant="default" type="submit" loading={isLoading} w={100}>
							Save
						</Button>
					</Flex>
				</Flex>
			</FormProvider>
			<Modal opened={openedAmenity} onClose={closeAmenity} title="Create Amenity" centered my={10}>
				<CreateAmenityOrUpdate onClose={closeAmenity} />
			</Modal>

			<Divider />

			<Modal opened={openedContact} onClose={closeContact} title="Create Contact" centered>
				<CreateContactOrUpdate onClose={closeContact} />
			</Modal>
		</Container>
	);
};
