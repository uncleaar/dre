import React, { FC, useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { createBuilding, getBuildingById, updateBuilding } from "shared/api/buildings";
import { updateListingPublicationBuilding } from "shared/api/listing-publications-buildings";
import { ROUTES } from "shared/constants";
import { SUCCESS_MESSAGES } from "shared/constants/success-messages";
import { transformBuildingToFormValues } from "shared/lib/transformBuildingToFormValues";
import { transformErrorMessages } from "shared/lib/transformErrorMessages";
import { transformFormValuesToBuilding } from "shared/lib/transformFormValueToBuilding";
import { createBuildingSchema } from "shared/validation/createBuilding";
import { updateBuildingSchema } from "shared/validation/updateBuilding";
import { Building, FormValues } from "types/building";

import { yupResolver } from "@hookform/resolvers/yup";
import { Box, Button, Container, Divider, Modal, Title } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import { useMutation, useQuery } from "@tanstack/react-query";

import { CreateAmenityOrUpdate } from "../../../SettingsPage/ui/AmenitiesPage/ui/CreateOrUpdate/CreateAmenityOrUpdate";
import { CreateContactOrUpdate } from "../../../SettingsPage/ui/ContactsPage/ui/CreateOrUpdate/CreateContactOrUpdate";
import { CreateUtilityOrUpdate } from "../../../SettingsPage/ui/UtilitiesPage/ui/CreateOrUpdate/CreateOrUpdateUtility";

import { BuildingAddress } from "./Address/BuildingAddress";
import { BuildingAmenities } from "./Amenities/BuildingAmenities";
import { BuildingContacts } from "./Contacts/BuildingContacts";
import { BuildingDimensions } from "./Dimension/BuildingDimensions";
import { BuildingDistricts } from "./Districts/BuildingDistricts";
import { BuildingInfo } from "./Info/BuildingInfo";
import { BuildingOverview } from "./Overview/BuildingOverview";
import { BuildingPetPolicy } from "./PetPolicy/BuildingPetPolicy";
import { BuildingUtilities } from "./Utilities/BuildingUtilities";

import styles from "./BuildingCreateOrUpdate.module.scss";

interface CreateOrUpdateProps {
	isEdit: boolean;
}

export const BuildingCreateOrUpdate: FC<CreateOrUpdateProps> = ({ isEdit }) => {
	const { id } = useParams<{ id: string | undefined }>();
	const { listingId } = useParams<{ listingId: string | undefined }>();
	const [openedContact, { open: openContact, close: closeContact }] = useDisclosure(false);
	const [openedAmenity, { open: openAmenity, close: closeAmenity }] = useDisclosure(false);
	const [openedUtility, { open: openUtility, close: closeUtility }] = useDisclosure(false);
	const [error, setError] = useState<string>("");
	const navigate = useNavigate();

	const { data } = useQuery({
		queryKey: ["buildings", id],
		queryFn: () =>
			getBuildingById(id as string, { contacts: true, amenities: true, utilities: true }),
		keepPreviousData: true,
		enabled: !!id
	});
	const formMethods = useForm<FormValues>({
		resolver: isEdit ? yupResolver(updateBuildingSchema) : yupResolver(createBuildingSchema)
	});

	useEffect(() => {
		if (data) {
			const init = transformBuildingToFormValues(data);
			formMethods.reset(init);
		}
	}, [data, formMethods]);

	const { mutate: create } = useMutation({
		mutationKey: ["buildings"],
		mutationFn: async (data: Building) => await createBuilding(data),
		onSuccess: async () => {
			notifications.show({ title: "Success", message: SUCCESS_MESSAGES.building_create });
			navigate(ROUTES.BUILDINGS);
		},
		onError: (error) => {
			setError(transformErrorMessages(error));
		}
	});

	const { mutate: update } = useMutation({
		mutationKey: ["buildings"],
		mutationFn: async (data: Building) => await updateBuilding(data, id as string),
		onSuccess: async () => {
			notifications.show({ title: "Success", message: SUCCESS_MESSAGES.building_update });
			navigate(ROUTES.BUILDINGS);
		},
		onError: () => {
			notifications.show({
				title: "Error",
				message: "An error occurred while updating the building."
			});
		}
	});

	const { mutate: updateListingBuilding } = useMutation({
		mutationKey: ["listing-publication-buildings"],
		mutationFn: async (data: Building) =>
			await updateListingPublicationBuilding(listingId as string, id as string, data),
		onSuccess: async () => {
			notifications.show({ title: "Success", message: SUCCESS_MESSAGES.building_update });
		},
		onError: () => {
			notifications.show({
				title: "Error",
				message: "An error occurred while updating the building."
			});
		}
	});

	const onSubmit = (data: FormValues) => {
		const transformed = transformFormValuesToBuilding(data);
		if (isEdit) {
			!listingId ? update(transformed as any) : updateListingBuilding(transformed as any);
		} else {
			create(transformed);
		}
	};

	return (
		<Box>
			<FormProvider {...formMethods}>
				<Container component="form" onSubmit={formMethods.handleSubmit(onSubmit as any)}>
					<Title className={styles.title} order={3}>
						{isEdit ? "Update Building" : "Create Building"}
					</Title>
					<BuildingInfo edit={data} />
					<Divider my="sm" />
					<BuildingContacts open={openContact} />
					<Divider my="sm" />
					<BuildingOverview />
					<Divider my="sm" />
					<BuildingDimensions />
					<Divider my="sm" />
					<BuildingDistricts />
					<Divider my="sm" />
					<BuildingAmenities open={openAmenity} />
					<Divider my="sm" />
					<BuildingUtilities open={openUtility} />
					<Divider my="sm" />
					<BuildingAddress />
					<Divider my="sm" />
					<BuildingPetPolicy edit={data} />
					<Divider my="sm" />
					{error}
					<Button onClick={() => navigate(-1)}>Back</Button>
					<Button color="teal" type="submit" classNames={{ root: styles.btn_right }}>
						SAVE
					</Button>
				</Container>
			</FormProvider>
			<Modal opened={openedContact} onClose={closeContact} title="Create Contact" centered>
				<CreateContactOrUpdate onClose={closeContact} />
			</Modal>
			<Modal opened={openedAmenity} onClose={closeAmenity} title="Create Amenity" centered>
				<CreateAmenityOrUpdate onClose={closeAmenity} />
			</Modal>
			<Modal opened={openedUtility} onClose={closeUtility} title="Create Utility" centered>
				<CreateUtilityOrUpdate onClose={closeUtility} />
			</Modal>
		</Box>
	);
};
