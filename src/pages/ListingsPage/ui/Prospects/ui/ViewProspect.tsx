import dayjs from "dayjs";
import React, { useEffect, useMemo, useState } from "react";
import { IMaskInput } from "react-imask";
import Select from "react-select";
import { getProspectById, updateProspect } from "shared/api/prospects.ts";
import { FeeTypesOptions } from "shared/constants";
import {
	PetTypesOptions,
	ProspectInquiryManagerPrioritiesOptions,
	ProspectProfileTypesOptions
} from "shared/constants/prospects/prospect-constants-options.ts";
import {
	availabilitySchema,
	occupantSchema,
	petTypeSchema,
	recurringPaymentSchema
} from "shared/validation/updateProspectSchema.ts";

import {
	Accordion,
	AccordionItem,
	AccordionPanel,
	Button,
	Checkbox,
	Container,
	Divider,
	Flex,
	Grid,
	Input,
	Loader,
	Table,
	Title
} from "@mantine/core";
import { DateInput, DateValue } from "@mantine/dates";
import { notifications } from "@mantine/notifications";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
	AvailabilityRecord,
	Occupant,
	PetType,
	Prospect,
	RecurringPayment
} from "../../../../../types/prospects.ts";

export const ViewProspect = ({
	prospectId,
	edit,
	setEdit
}: {
	prospectId: string;
	edit: boolean;
	setEdit: (value: boolean) => void;
}) => {
	const [currentProspect, setCurrentProspect] = useState<Partial<Omit<Prospect, "id">>>({});
	const [occupant, setOccupant] = useState<Occupant | null>(null);
	const [petType, setPetType] = useState<PetType | null>(null);
	const [availability, setAvailability] = useState<AvailabilityRecord | null>(null);
	const [payment, setPayment] = useState<RecurringPayment | null>(null);

	const queryClient = useQueryClient();

	const { data: prospect, isLoading } = useQuery<Prospect>({
		queryKey: ["prospects", prospectId],
		queryFn: async () => await getProspectById(prospectId),
		enabled: !!prospectId
	});
	useEffect(() => {
		if (prospect) {
			setCurrentProspect({
				contactId: prospect.contactId,
				profileType: prospect.profileType,
				leadSource: prospect.leadSource,
				marketingEmails: prospect.marketingEmails,
				notificationEmails: prospect.notificationEmails,
				markAsEmailed: prospect.markAsEmailed,
				inquiryManagerPriority: prospect.inquiryManagerPriority,
				inquiryAutoResponse: prospect.inquiryAutoResponse,
				SMSConfirmations: prospect.SMSConfirmations,
				bedrooms: prospect.bedrooms,
				bathrooms: prospect.bathrooms,
				feeType: prospect.feeType,
				maxWalkup: prospect.maxWalkup,
				minPrice: prospect.minPrice,
				maxPrice: prospect.maxPrice,
				neighborhoods: prospect.neighborhoods,
				moveInEarly: prospect.moveInEarly ? new Date(prospect.moveInEarly) : undefined,
				moveInLate: prospect.moveInLate ? new Date(prospect.moveInLate) : undefined,
				minSqft: prospect.minSqft,
				maxSqft: prospect.maxSqft,
				income: prospect.income,
				credit: prospect.credit,
				notes: prospect.notes,
				currentAddress: prospect.currentAddress,
				leaseEndDate: prospect.leaseEndDate ? new Date(prospect.leaseEndDate) : undefined,
				currentRent: prospect.currentRent,
				createdAt: prospect.createdAt,
				updatedAt: prospect.updatedAt
			});
			if (prospect?.occupants?.length)
				setOccupant({
					name: prospect.occupants[0].name,
					phone: prospect.occupants[0].phone,
					email: prospect.occupants[0].email,
					relationship: prospect.occupants[0].relationship,
					marketingEmails: prospect.occupants[0].marketingEmails,
					notificationEmails: prospect.occupants[0].notificationEmails
				});
			if (prospect?.pets?.length) {
				setPetType({
					type: prospect.pets[0].type,
					breed: prospect.pets[0].breed,
					weight: prospect.pets[0].weight
				});
			}
			if (prospect?.recurringPayments?.length) {
				setPayment({
					name: prospect.recurringPayments[0].name,
					email: prospect.recurringPayments[0].email,
					phone: prospect.recurringPayments[0].phone,
					amount: prospect.recurringPayments[0].amount,
					start: new Date(prospect.recurringPayments[0].start),
					end: new Date(prospect.recurringPayments[0].end),
					interval: prospect.recurringPayments[0].interval,
					type: prospect.recurringPayments[0].type,
					payee: prospect.recurringPayments[0].payee,
					ourNotes: prospect.recurringPayments[0].ourNotes
				});
			}
			if (prospect?.availability?.length) {
				setAvailability({
					startTime: new Date(prospect.availability[0].startTime),
					endTime: new Date(prospect.availability[0].endTime)
				});
			}
		}
	}, [prospect]);

	const { mutate, isLoading: isLoadingUpdate } = useMutation({
		mutationKey: ["prospects"],
		mutationFn: async (data: Partial<Omit<Prospect, "id">>) => await updateProspect(prospectId, data),
		onSuccess: async () => {
			await queryClient.invalidateQueries({ queryKey: ["prospects"] });
			setEdit(false);
			notifications.show({ title: "Success", message: "OK" });
		},
		onError: () => {
			notifications.show({
				title: "Error",
				message: "An error occurred while deleting a prospect."
			});
		}
	});
	const onChangeOccupant = (field: keyof Occupant, value: string | boolean) => {
		setOccupant((prevState: any) => {
			if (value === "" || (typeof value === "boolean" && !value)) {
				const { [field]: _, ...newState } = prevState as Occupant;
				if (!Object.keys(newState).length) return null;
				return newState;
			} else {
				if (!prevState) {
					return { [field]: value };
				} else {
					return {
						...prevState,
						[field]: value
					};
				}
			}
		});
	};

	const onChangePetType = (field: keyof PetType, value: string | number | null) => {
		setPetType((prevState: any) => {
			if (!value || (typeof value === "number" && !value)) {
				const { [field]: _, ...newState } = prevState as PetType;
				if (!Object.keys(newState).length) return null;
				return newState;
			} else {
				if (!prevState) {
					return { [field]: value };
				} else {
					return {
						...prevState,
						[field]: value
					};
				}
			}
		});
	};
	const onChangeAvailability = (field: keyof AvailabilityRecord, value: DateValue) => {
		setAvailability((prevState: any) => {
			if (!value) {
				const { [field]: _, ...newState } = prevState as AvailabilityRecord;
				if (!Object.keys(newState).length) return null;
				return newState;
			} else {
				if (!prevState) {
					return { [field]: value };
				} else {
					return {
						...prevState,
						[field]: value
					};
				}
			}
		});
	};
	const onChangePayment = (field: keyof RecurringPayment, value: DateValue | string | number) => {
		setPayment((prevState: any) => {
			if (!value) {
				const { [field]: _, ...newState } = prevState as RecurringPayment;
				if (!Object.keys(newState).length) return null;
				return newState;
			} else {
				if (!prevState) {
					return { [field]: value };
				} else {
					return {
						...prevState,
						[field]: value
					};
				}
			}
		});
	};
	const handleInputChange = (field: string, value: any) => {
		setCurrentProspect((prevData) => ({
			...prevData,
			[field]: value
		}));
	};

	const isSubmitDisabled = useMemo(() => {
		const isOccupantValid = occupant ? occupantSchema.isValidSync(occupant) : false;
		const isPetTypeValid = petType ? petTypeSchema.isValidSync(petType) : false;
		const isAvailabilityValid = availability ? availabilitySchema.isValidSync(availability) : false;
		const isPaymentValid = payment ? recurringPaymentSchema.isValidSync(payment) : false;
		return !isOccupantValid || !isPetTypeValid || !isAvailabilityValid || !isPaymentValid;
	}, [occupant, petType, availability, payment]);

	const onSubmit = () => {
		mutate({
			...currentProspect,
			...(occupant ? { occupants: [occupant] } : {}),
			...(petType ? { pets: [petType] } : {}),
			...(availability ? { availability: [availability] } : {}),
			...(payment ? { recurringPayments: [payment] } : {})
		});
	};

	if (isLoading) return <Loader color="blue" />;
	return (
		<Container fluid>
			<Divider my={50} />
			<Flex justify="flex-end" mb={16}>
				{edit ? (
					<Button color="green" variant="outline" disabled={isSubmitDisabled} onClick={onSubmit}>
						Save
					</Button>
				) : null}
			</Flex>
			<Grid>
				<Grid.Col span={6}>
					<Accordion variant="contained" defaultValue="data" mb={24}>
						<AccordionItem value="data">
							<Accordion.Control>
								<Title order={5}>Contact</Title>
							</Accordion.Control>
							<AccordionPanel>
								<Table withColumnBorders withTableBorder withRowBorders>
									<Table.Tbody>
										<Table.Tr>
											<Table.Td w="50%">- Contact ID</Table.Td>
											<Table.Td>{prospect?.contact[0].id}</Table.Td>
										</Table.Tr>
										<Table.Tr>
											<Table.Td>- Contact Name</Table.Td>
											<Table.Td>
												{prospect?.contact[0].firstName} {prospect?.contact[0].lastName}
											</Table.Td>
										</Table.Tr>
										<Table.Tr>
											<Table.Td>- Contact Phone</Table.Td>
											<Table.Td>{prospect?.contact[0].phoneNumber}</Table.Td>
										</Table.Tr>
										<Table.Tr>
											<Table.Td>- Contact Email</Table.Td>
											<Table.Td>{prospect?.contact[0].email}</Table.Td>
										</Table.Tr>
										<Table.Tr>
											<Table.Td>- Contact Address for Notices</Table.Td>
											<Table.Td>{prospect?.contact[0].addressForNotices}</Table.Td>
										</Table.Tr>
									</Table.Tbody>
								</Table>
							</AccordionPanel>
						</AccordionItem>
					</Accordion>
					<Accordion variant="contained" defaultValue="data" mb={24}>
						<AccordionItem value="data">
							<Accordion.Control>
								<Title order={5}>Preferences</Title>
							</Accordion.Control>
							<AccordionPanel>
								<Table withColumnBorders withTableBorder withRowBorders>
									<Table.Tbody>
										<Table.Tr>
											<Table.Td w="50%">- Lead Source</Table.Td>
											<Table.Td>
												{!edit ? (
													prospect?.leadSource
												) : (
													<Input
														placeholder="Lead Source"
														onChange={(e) => handleInputChange("leadSource", e.target.value)}
														defaultValue={currentProspect?.leadSource}
													/>
												)}
											</Table.Td>
										</Table.Tr>
										<Table.Tr>
											<Table.Td>- Marketing Emails</Table.Td>
											<Table.Td>
												{!edit ? (
													<Checkbox checked={prospect?.marketingEmails} disabled />
												) : (
													<Checkbox
														onChange={(e) => handleInputChange("marketingEmails", e.target.checked)}
														placeholder="Marketing Emails"
														defaultChecked={currentProspect?.marketingEmails}
													/>
												)}
											</Table.Td>
										</Table.Tr>
										<Table.Tr>
											<Table.Td>- Mark As Emailed</Table.Td>
											<Table.Td>
												{!edit ? (
													<Checkbox checked={prospect?.markAsEmailed} disabled />
												) : (
													<Checkbox
														onChange={(e) => handleInputChange("markAsEmailed", e.target.checked)}
														placeholder="Mark As Emailed"
														defaultChecked={currentProspect?.markAsEmailed}
													/>
												)}
											</Table.Td>
										</Table.Tr>
										<Table.Tr>
											<Table.Td>- Notification Emails</Table.Td>
											<Table.Td>
												{!edit ? (
													<Checkbox checked={prospect?.notificationEmails} disabled />
												) : (
													<Checkbox
														defaultChecked={currentProspect?.notificationEmails}
														placeholder="Notification Emails"
														onChange={(e) => handleInputChange("notificationEmails", e.target.checked)}
													/>
												)}
											</Table.Td>
										</Table.Tr>
										<Table.Tr>
											<Table.Td>- Inquiry Manager Priority</Table.Td>
											<Table.Td>
												{!edit ? (
													prospect?.inquiryManagerPriority
												) : (
													<Select
														isClearable
														onChange={(option) =>
															option
																? handleInputChange("inquiryManagerPriority", option.value)
																: handleInputChange("inquiryManagerPriority", null)
														}
														value={
															currentProspect.inquiryManagerPriority
																? ProspectInquiryManagerPrioritiesOptions.find(
																		(item) => item.value === currentProspect.inquiryManagerPriority
																	)
																: null
														}
														placeholder={"Inquiry Manager Priority"}
														options={ProspectInquiryManagerPrioritiesOptions}
													/>
												)}
											</Table.Td>
										</Table.Tr>
										<Table.Tr>
											<Table.Td>- Inquiry Auto Response</Table.Td>
											<Table.Td>
												{!edit ? (
													<Checkbox checked={prospect?.inquiryAutoResponse} disabled />
												) : (
													<Checkbox
														defaultChecked={currentProspect?.inquiryAutoResponse}
														placeholder="Inquiry Auto Response"
														onChange={(e) => handleInputChange("inquiryAutoResponse", e.target.checked)}
													/>
												)}
											</Table.Td>
										</Table.Tr>
										<Table.Tr>
											<Table.Td>- SMS Confirmations</Table.Td>
											<Table.Td>
												{!edit ? (
													<Checkbox checked={prospect?.SMSConfirmations} disabled />
												) : (
													<Checkbox
														placeholder="SMS Confirmations"
														defaultChecked={currentProspect?.SMSConfirmations}
														onChange={(e) => handleInputChange("SMSConfirmations", e.target.checked)}
													/>
												)}
											</Table.Td>
										</Table.Tr>
									</Table.Tbody>
								</Table>
							</AccordionPanel>
						</AccordionItem>
					</Accordion>
					<Accordion variant="contained" defaultValue="data" mb={24}>
						<AccordionItem value="data">
							<Accordion.Control>
								<Title order={5}>Occupant</Title>
							</Accordion.Control>
							<AccordionPanel>
								<Table withColumnBorders withTableBorder withRowBorders>
									<Table.Tbody>
										<Table.Tr>
											<Table.Td w="50%">- Name</Table.Td>
											<Table.Td>
												{!edit ? (
													prospect?.occupants?.[0]?.name
												) : (
													<Input
														placeholder="Name"
														error={occupant && !occupant.name}
														defaultValue={occupant?.name}
														onChange={(e) => onChangeOccupant("name", e.target.value)}
													/>
												)}
											</Table.Td>
										</Table.Tr>
										<Table.Tr>
											<Table.Td>- Email</Table.Td>
											<Table.Td>
												{!edit ? (
													prospect?.occupants?.[0]?.email
												) : (
													<Input
														placeholder="Email"
														error={occupant && !occupant.email}
														defaultValue={occupant?.email}
														onChange={(e) => onChangeOccupant("email", e.target.value)}
													/>
												)}
											</Table.Td>
										</Table.Tr>
										<Table.Tr>
											<Table.Td>- Phone</Table.Td>
											<Table.Td>
												{!edit ? (
													prospect?.occupants?.[0]?.phone
												) : (
													<Input
														component={IMaskInput}
														mask="+1 (000) 000-00-00"
														placeholder="Phone"
														error={occupant && !occupant.phone}
														defaultValue={occupant?.phone}
														onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
															onChangeOccupant("phone", e.target.value)
														}
													/>
												)}
											</Table.Td>
										</Table.Tr>
										<Table.Tr>
											<Table.Td>- Relationship</Table.Td>
											<Table.Td>
												{!edit ? (
													prospect?.occupants?.[0]?.relationship
												) : (
													<Input
														placeholder="Relationship"
														error={occupant && !occupant.relationship}
														defaultValue={occupant?.relationship}
														onChange={(e) => onChangeOccupant("relationship", e.target.value)}
													/>
												)}
											</Table.Td>
										</Table.Tr>
										<Table.Tr>
											<Table.Td>- Marketing Emails</Table.Td>
											<Table.Td>
												{!edit ? (
													<Checkbox checked={prospect?.occupants?.[0]?.marketingEmails} disabled />
												) : (
													<Checkbox
														placeholder="Marketing Emails"
														checked={occupant?.marketingEmails}
														onChange={(e) => onChangeOccupant("marketingEmails", e.target.checked)}
													/>
												)}
											</Table.Td>
										</Table.Tr>
										<Table.Tr>
											<Table.Td>- Notification Emails</Table.Td>
											<Table.Td>
												{!edit ? (
													<Checkbox checked={prospect?.occupants?.[0]?.notificationEmails} disabled />
												) : (
													<Checkbox
														placeholder="Notification Emails"
														checked={occupant?.notificationEmails}
														onChange={(e) => onChangeOccupant("notificationEmails", e.target.checked)}
													/>
												)}
											</Table.Td>
										</Table.Tr>
									</Table.Tbody>
								</Table>
							</AccordionPanel>
						</AccordionItem>
					</Accordion>
					<Accordion variant="contained" defaultValue="data" mb={24}>
						<AccordionItem value="data">
							<Accordion.Control>
								<Title order={5}>Neighborhoods</Title>
							</Accordion.Control>
							<AccordionPanel>
								<Table withColumnBorders withTableBorder withRowBorders>
									<Table.Tbody>
										<Table.Tr>
											<Table.Td w="50%">- Neighborhoods</Table.Td>
											<Table.Td>
												{!edit ? (
													prospect?.neighborhoods?.[0] || "-"
												) : (
													<Input
														placeholder="Neighborhoods"
														onChange={(e) => handleInputChange("neighborhoods", [e.target.value])}
														defaultValue={currentProspect?.neighborhoods}
													/>
												)}
											</Table.Td>
										</Table.Tr>
									</Table.Tbody>
								</Table>
							</AccordionPanel>
						</AccordionItem>
					</Accordion>
					<Accordion variant="contained" defaultValue="data" mb={24}>
						<AccordionItem value="data">
							<Accordion.Control>
								<Title order={5}>Other Information</Title>
							</Accordion.Control>
							<AccordionPanel>
								<Table withColumnBorders withTableBorder withRowBorders>
									<Table.Tbody>
										<Table.Tr>
											<Table.Td w="50%">- Current Address</Table.Td>
											<Table.Td>
												{!edit ? (
													prospect?.currentAddress
												) : (
													<Input
														placeholder="Current Address"
														onChange={(e) => handleInputChange("currentAddress", e.target.value)}
														defaultValue={currentProspect?.currentAddress}
													/>
												)}
											</Table.Td>
										</Table.Tr>
										<Table.Tr>
											<Table.Td>- Lease End Date</Table.Td>
											<Table.Td>
												{!edit ? (
													prospect?.leaseEndDate ? (
														dayjs(prospect?.leaseEndDate).format("YYYY-MM-DD")
													) : (
														"-"
													)
												) : (
													<DateInput
														clearable
														placeholder="Lease End Date"
														value={currentProspect.leaseEndDate || null}
														onChange={(value) => handleInputChange("leaseEndDate", value)}
													/>
												)}
											</Table.Td>
										</Table.Tr>
										<Table.Tr>
											<Table.Td>- Current Rent</Table.Td>
											<Table.Td>
												{!edit ? (
													prospect?.currentRent
												) : (
													<Input
														placeholder="Current Rent"
														onChange={(e) => handleInputChange("currentRent", e.target.value)}
														defaultValue={currentProspect?.currentRent}
													/>
												)}
											</Table.Td>
										</Table.Tr>
									</Table.Tbody>
								</Table>
							</AccordionPanel>
						</AccordionItem>
					</Accordion>
					<Accordion variant="contained" defaultValue="data" mb={24}>
						<AccordionItem value="data">
							<Accordion.Control>
								<Title order={5}>Pet Type</Title>
							</Accordion.Control>
							<AccordionPanel>
								<Table withColumnBorders withTableBorder withRowBorders>
									<Table.Tbody>
										<Table.Tr>
											<Table.Td w="50%">- Pet Type</Table.Td>
											<Table.Td>
												{!edit ? (
													prospect?.pets?.[0]?.type
												) : (
													<Select
														placeholder="Type"
														isClearable
														value={PetTypesOptions.find((item) => item.value === petType?.type)}
														options={PetTypesOptions}
														onChange={(option) =>
															option ? onChangePetType("type", option.value) : onChangePetType("type", null)
														}
														styles={{
															control: (base) => ({
																...base,
																...(petType && !petType.type ? { borderColor: "red" } : {})
															})
														}}
													/>
												)}
											</Table.Td>
										</Table.Tr>
										<Table.Tr>
											<Table.Td>- Breed</Table.Td>
											<Table.Td>
												{!edit ? (
													prospect?.pets?.[0]?.breed
												) : (
													<Input
														placeholder="Breed"
														error={petType && !petType.breed}
														defaultValue={petType?.breed}
														onChange={(e) => onChangePetType("breed", e.target.value)}
													/>
												)}
											</Table.Td>
										</Table.Tr>
										<Table.Tr>
											<Table.Td>- Weight</Table.Td>
											<Table.Td>
												{!edit ? (
													prospect?.pets?.[0]?.weight
												) : (
													<Input
														type="number"
														min={0}
														placeholder="Weight"
														error={petType && !petType.weight}
														defaultValue={petType?.weight}
														onChange={(e) => onChangePetType("weight", Number(e.target.value))}
													/>
												)}
											</Table.Td>
										</Table.Tr>
									</Table.Tbody>
								</Table>
							</AccordionPanel>
						</AccordionItem>
					</Accordion>
					<Accordion variant="contained" defaultValue="data" mb={24}>
						<AccordionItem value="data">
							<Accordion.Control>
								<Title order={5}>Availability</Title>
							</Accordion.Control>
							<AccordionPanel>
								<Table withColumnBorders withTableBorder withRowBorders>
									<Table.Tbody>
										<Table.Tr>
											<Table.Td w="50%">- Start Time</Table.Td>
											<Table.Td>
												{!edit ? (
													prospect?.availability?.[0]?.startTime ? (
														dayjs(prospect?.availability?.[0]?.startTime).format("YYYY-MM-DD")
													) : (
														"-"
													)
												) : (
													<DateInput
														clearable
														placeholder="Start Time"
														error={availability && !availability.startTime}
														value={availability?.startTime || null}
														onChange={(value) => onChangeAvailability("startTime", value)}
													/>
												)}
											</Table.Td>
										</Table.Tr>
										<Table.Tr>
											<Table.Td>- End Time</Table.Td>
											<Table.Td>
												{!edit ? (
													prospect?.availability?.[0]?.endTime ? (
														dayjs(prospect?.availability?.[0]?.endTime).format("YYYY-MM-DD")
													) : (
														"-"
													)
												) : (
													<DateInput
														clearable
														placeholder="End Time"
														error={availability && !availability.endTime}
														value={availability?.endTime || null}
														onChange={(value) => onChangeAvailability("endTime", value)}
													/>
												)}
											</Table.Td>
										</Table.Tr>
									</Table.Tbody>
								</Table>
							</AccordionPanel>
						</AccordionItem>
					</Accordion>
				</Grid.Col>
				<Grid.Col span={6}>
					<Accordion variant="contained" defaultValue="data" mb={24}>
						<AccordionItem value="data">
							<Accordion.Control>
								<Title order={5}>Prospect Info</Title>
							</Accordion.Control>
							<AccordionPanel>
								<Table withColumnBorders withTableBorder withRowBorders>
									<Table.Tbody>
										<Table.Tr>
											<Table.Td w="50%">- UUID</Table.Td>
											<Table.Td>{prospect?.id}</Table.Td>
										</Table.Tr>
										<Table.Tr>
											<Table.Td>- Created</Table.Td>
											<Table.Td>{dayjs(prospect?.createdAt).format("YYYY-MM-DD")}</Table.Td>
										</Table.Tr>
										<Table.Tr>
											<Table.Td>- Modified</Table.Td>
											<Table.Td>{dayjs(prospect?.updatedAt).format("YYYY-MM-DD")}</Table.Td>
										</Table.Tr>
										<Table.Tr>
											<Table.Td>- Profile Type</Table.Td>
											<Table.Td>
												{!edit ? (
													prospect?.profileType
												) : (
													<Select
														onChange={(option) =>
															option ? handleInputChange("profileType", option.value) : null
														}
														value={
															ProspectProfileTypesOptions.find(
																(item) => item.value === currentProspect.profileType
															) || null
														}
														placeholder={"Profile Type"}
														options={ProspectProfileTypesOptions}
													/>
												)}
											</Table.Td>
										</Table.Tr>
									</Table.Tbody>
								</Table>
							</AccordionPanel>
						</AccordionItem>
					</Accordion>

					<Accordion variant="contained" defaultValue="data" mb={24}>
						<AccordionItem value="data">
							<Accordion.Control>
								<Title order={5}>Property Preferences</Title>
							</Accordion.Control>
							<AccordionPanel>
								<Table withColumnBorders withTableBorder withRowBorders>
									<Table.Tbody>
										<Table.Tr>
											<Table.Td w="50%">- Bedrooms</Table.Td>
											<Table.Td>
												{!edit ? (
													prospect?.bedrooms
												) : (
													<Input
														type="number"
														min={0}
														onChange={(e) => handleInputChange("bedrooms", Number(e.target.value))}
														placeholder="Bedrooms"
														defaultValue={currentProspect?.bedrooms}
													/>
												)}
											</Table.Td>
										</Table.Tr>
										<Table.Tr>
											<Table.Td>- Bathrooms</Table.Td>
											<Table.Td>
												{!edit ? (
													prospect?.bathrooms
												) : (
													<Input
														type="number"
														min={0}
														placeholder="Bathrooms"
														onChange={(e) => handleInputChange("bathrooms", Number(e.target.value))}
														defaultValue={currentProspect?.bathrooms}
													/>
												)}
											</Table.Td>
										</Table.Tr>
										<Table.Tr>
											<Table.Td>- Fee Type</Table.Td>
											<Table.Td>
												{!edit ? (
													prospect?.feeType
												) : (
													<Select
														placeholder="Fee Type"
														options={FeeTypesOptions}
														value={FeeTypesOptions.find((item) => item.value === currentProspect.feeType) || null}
														onChange={(option) => (option ? handleInputChange("feeType", option.value) : null)}
													/>
												)}
											</Table.Td>
										</Table.Tr>
										<Table.Tr>
											<Table.Td>- Max Walk up</Table.Td>
											<Table.Td>
												{!edit ? (
													prospect?.maxWalkup
												) : (
													<Input
														placeholder="Max Walk up"
														type="number"
														min={0}
														onChange={(e) => handleInputChange("maxWalkup", Number(e.target.value))}
														defaultValue={currentProspect?.maxWalkup}
													/>
												)}
											</Table.Td>
										</Table.Tr>
										<Table.Tr>
											<Table.Td>- Min Price</Table.Td>
											<Table.Td>
												{!edit ? (
													prospect?.minPrice
												) : (
													<Input
														placeholder="Min Price"
														type="number"
														min={0}
														onChange={(e) => handleInputChange("minPrice", Number(e.target.value))}
														defaultValue={currentProspect?.minPrice}
													/>
												)}
											</Table.Td>
										</Table.Tr>
										<Table.Tr>
											<Table.Td>- Max Price</Table.Td>
											<Table.Td>
												{!edit ? (
													prospect?.maxPrice
												) : (
													<Input
														placeholder="Max Price"
														type="number"
														min={0}
														onChange={(e) => handleInputChange("maxPrice", Number(e.target.value))}
														defaultValue={currentProspect?.maxPrice}
													/>
												)}
											</Table.Td>
										</Table.Tr>
										<Table.Tr>
											<Table.Td>- Move In Early</Table.Td>
											<Table.Td>
												{!edit ? (
													prospect?.moveInEarly ? (
														dayjs(prospect?.moveInEarly).format("YYYY-MM-DD")
													) : (
														"-"
													)
												) : (
													<DateInput
														clearable
														placeholder="Move In Early"
														onChange={(value) => handleInputChange("moveInEarly", value)}
														value={currentProspect.moveInEarly || null}
													/>
												)}
											</Table.Td>
										</Table.Tr>
										<Table.Tr>
											<Table.Td>- Move In Late</Table.Td>
											<Table.Td>
												{!edit ? (
													prospect?.moveInLate ? (
														dayjs(prospect?.moveInLate).format("YYYY-MM-DD")
													) : (
														"-"
													)
												) : (
													<DateInput
														clearable
														placeholder="Move In Late"
														onChange={(value) => handleInputChange("moveInLate", value)}
														value={currentProspect.moveInLate || null}
													/>
												)}
											</Table.Td>
										</Table.Tr>
										<Table.Tr>
											<Table.Td>- Min Sqft</Table.Td>
											<Table.Td>
												{!edit ? (
													prospect?.minSqft
												) : (
													<Input
														type="number"
														min={0}
														onChange={(e) => handleInputChange("minSqft", Number(e.target.value))}
														placeholder="Min Sqft"
														defaultValue={currentProspect?.minSqft}
													/>
												)}
											</Table.Td>
										</Table.Tr>
										<Table.Tr>
											<Table.Td>- Max Sqft</Table.Td>
											<Table.Td>
												{!edit ? (
													prospect?.maxSqft
												) : (
													<Input
														type="number"
														min={0}
														onChange={(e) => handleInputChange("maxSqft", Number(e.target.value))}
														placeholder="Max Sqft"
														defaultValue={currentProspect?.maxSqft}
													/>
												)}
											</Table.Td>
										</Table.Tr>
										<Table.Tr>
											<Table.Td>- Income</Table.Td>
											<Table.Td>
												{!edit ? (
													prospect?.income
												) : (
													<Input
														type="number"
														min={0}
														onChange={(e) => handleInputChange("income", Number(e.target.value))}
														placeholder="Income"
														defaultValue={currentProspect?.income}
													/>
												)}
											</Table.Td>
										</Table.Tr>
										<Table.Tr>
											<Table.Td>- Credit</Table.Td>
											<Table.Td>
												{!edit ? (
													prospect?.credit
												) : (
													<Input
														placeholder="Credit"
														type="number"
														min={0}
														onChange={(e) => handleInputChange("credit", Number(e.target.value))}
														defaultValue={currentProspect?.credit}
													/>
												)}
											</Table.Td>
										</Table.Tr>
										<Table.Tr>
											<Table.Td>- Notes</Table.Td>
											<Table.Td>
												{!edit ? (
													prospect?.notes
												) : (
													<Input
														placeholder="Notes"
														onChange={(e) => handleInputChange("notes", e.target.value)}
														defaultValue={currentProspect?.notes}
													/>
												)}
											</Table.Td>
										</Table.Tr>
									</Table.Tbody>
								</Table>
							</AccordionPanel>
						</AccordionItem>
					</Accordion>
					<Accordion variant="contained" defaultValue="data" mb={24}>
						<AccordionItem value="data">
							<Accordion.Control>
								<Title order={5}>Recurring Payment</Title>
							</Accordion.Control>
							<AccordionPanel>
								<Table withColumnBorders withTableBorder withRowBorders>
									<Table.Tbody>
										<Table.Tr>
											<Table.Td w="50%">- Name</Table.Td>
											<Table.Td>
												{!edit ? (
													prospect?.recurringPayments?.[0]?.name
												) : (
													<Input
														placeholder="Name"
														error={payment && !payment.name}
														onChange={(e) => onChangePayment("name", e.target.value)}
														defaultValue={payment?.name}
													/>
												)}
											</Table.Td>
										</Table.Tr>
										<Table.Tr>
											<Table.Td>- Email</Table.Td>
											<Table.Td>
												{!edit ? (
													prospect?.recurringPayments?.[0]?.email
												) : (
													<Input
														placeholder="Email"
														error={payment && !payment.email}
														onChange={(e) => onChangePayment("email", e.target.value)}
														defaultValue={payment?.email}
													/>
												)}
											</Table.Td>
										</Table.Tr>
										<Table.Tr>
											<Table.Td>- Phone</Table.Td>
											<Table.Td>
												{!edit ? (
													prospect?.recurringPayments?.[0]?.phone
												) : (
													<Input
														component={IMaskInput}
														mask="+1 (000) 000-00-00"
														placeholder="Phone"
														error={payment && !payment.phone}
														onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
															onChangePayment("phone", e.target.value)
														}
														defaultValue={payment?.phone}
													/>
												)}
											</Table.Td>
										</Table.Tr>
										<Table.Tr>
											<Table.Td>- Amount</Table.Td>
											<Table.Td>
												{!edit ? (
													prospect?.recurringPayments?.[0]?.amount
												) : (
													<Input
														placeholder="Amount"
														type="number"
														min={0}
														error={payment && !payment.amount}
														onChange={(e) => onChangePayment("amount", Number(e.target.value))}
														defaultValue={payment?.amount}
													/>
												)}
											</Table.Td>
										</Table.Tr>
										<Table.Tr>
											<Table.Td>- Start</Table.Td>
											<Table.Td>
												{!edit ? (
													prospect?.recurringPayments?.[0]?.start ? (
														dayjs(prospect?.recurringPayments?.[0]?.start).format("YYYY-MM-DD")
													) : (
														"-"
													)
												) : (
													<DateInput
														clearable
														placeholder="Start"
														error={payment && !payment.start}
														value={payment?.start || null}
														onChange={(value) => onChangePayment("start", value)}
													/>
												)}
											</Table.Td>
										</Table.Tr>
										<Table.Tr>
											<Table.Td>- End</Table.Td>
											<Table.Td>
												{!edit ? (
													prospect?.recurringPayments?.[0]?.end ? (
														dayjs(prospect?.recurringPayments?.[0]?.end).format("YYYY-MM-DD")
													) : (
														"-"
													)
												) : (
													<DateInput
														placeholder="End"
														clearable
														error={payment && !payment.end}
														onChange={(value) => onChangePayment("end", value)}
														value={payment?.end || null}
													/>
												)}
											</Table.Td>
										</Table.Tr>
										<Table.Tr>
											<Table.Td>- Interval</Table.Td>
											<Table.Td>
												{!edit ? (
													prospect?.recurringPayments?.[0]?.interval
												) : (
													<Input
														placeholder="Interval"
														type="number"
														min={0}
														error={payment && !payment.interval}
														onChange={(e) => onChangePayment("interval", Number(e.target.value))}
														defaultValue={payment?.interval}
													/>
												)}
											</Table.Td>
										</Table.Tr>
										<Table.Tr>
											<Table.Td>- Type</Table.Td>
											<Table.Td>
												{" "}
												{!edit ? (
													prospect?.recurringPayments?.[0]?.type
												) : (
													<Input
														placeholder="Type"
														error={payment && !payment.type}
														onChange={(e) => onChangePayment("type", e.target.value)}
														defaultValue={payment?.type}
													/>
												)}
											</Table.Td>
										</Table.Tr>
										<Table.Tr>
											<Table.Td>- Payee</Table.Td>
											<Table.Td>
												{" "}
												{!edit ? (
													prospect?.recurringPayments?.[0]?.payee
												) : (
													<Input
														placeholder="Payee"
														error={payment && !payment.payee}
														onChange={(e) => onChangePayment("payee", e.target.value)}
														defaultValue={payment?.payee}
													/>
												)}
											</Table.Td>
										</Table.Tr>
										<Table.Tr>
											<Table.Td>- Our Notes</Table.Td>
											<Table.Td>
												{!edit ? (
													prospect?.recurringPayments?.[0]?.ourNotes
												) : (
													<Input
														error={payment && !payment.ourNotes}
														onChange={(e) => onChangePayment("ourNotes", e.target.value)}
														placeholder="Our Notes"
														defaultValue={payment?.ourNotes}
													/>
												)}
											</Table.Td>
										</Table.Tr>
									</Table.Tbody>
								</Table>
							</AccordionPanel>
						</AccordionItem>
					</Accordion>
				</Grid.Col>
			</Grid>
		</Container>
	);
};
