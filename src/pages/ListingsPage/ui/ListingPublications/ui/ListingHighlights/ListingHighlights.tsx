import React, { FC, useEffect } from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { updateListingPublication } from "shared/api/listing-publications";
import { SUCCESS_MESSAGES } from "shared/constants/success-messages";
import { Input, TableContent } from "shared/ui";
import { HighlightCategory, ListingPublication } from "types/listing-publications-list";

import { ActionIcon, Button, Flex, Modal } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import { IconX } from "@tabler/icons-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import styles from "./ListingHighlights.module.scss";

interface ListingHighlightsProps {
	listingId: string;
	categories: HighlightCategory[];
}

export const ListingHighlights: FC<ListingHighlightsProps> = ({ listingId, categories }) => {
	const queryClient = useQueryClient();
	const [opened, { open, close }] = useDisclosure(false);

	const { control, handleSubmit, reset, setValue } = useForm({
		defaultValues: {
			highlightCategories: categories
		}
	});

	useEffect(() => {
		setValue("highlightCategories", categories);
	}, [categories, setValue]);

	const { fields, append, remove } = useFieldArray({
		control,
		name: "highlightCategories"
	});

	const { mutate } = useMutation({
		mutationKey: ["publications"],
		mutationFn: async (data: ListingPublication) =>
			await updateListingPublication(data, listingId as string),
		onSuccess: async () => {
			await queryClient.invalidateQueries({ queryKey: ["publications"] });
			notifications.show({ title: "Success", message: SUCCESS_MESSAGES.publication_update });
		},
		onError: () => {
			notifications.show({
				title: "Error",
				message: "An error occurred while updating the building."
			});
		}
	});

	const onSubmit = (data: any) => {
		mutate(data);
		close();
		reset();
	};

	return (
		<div>
			<Button my={10} onClick={open}>
				Add category
			</Button>

			<Modal opened={opened} onClose={close} title="Add category">
				<Flex
					component="form"
					onSubmit={handleSubmit(onSubmit)}
					direction="column"
					gap={20}
					align="center"
				>
					{fields.map((field, index) => (
						<Flex direction="column" key={field.id} gap={20} className={styles.box}>
							<Controller
								name={`highlightCategories.${index}.categoryName`}
								control={control}
								render={({ field }) => <Input placeholder="Category Name" {...field} size="sm" />}
							/>
							{field.highlights.map((highlight, hIndex) => (
								<Controller
									key={hIndex}
									name={`highlightCategories.${index}.highlights.${hIndex}`}
									control={control}
									render={({ field }) => <Input placeholder="Highlights" {...field} size="sm" />}
								/>
							))}
							<ActionIcon
								variant="subtle"
								aria-label="Highlights"
								onClick={() => remove(index)}
								color="gray"
								className={styles.icon}
							>
								<IconX style={{ width: "70%", height: "70%" }} stroke={1.5} />
							</ActionIcon>
						</Flex>
					))}
					<Button onClick={() => append({ categoryName: "", highlights: [""] })}>Add Category</Button>
					<Button type="submit">Submit</Button>
				</Flex>
			</Modal>

			<TableContent rows={categories} />
		</div>
	);
};
