import React, { FC } from "react";
import { Controller } from "react-hook-form";
import { getListings } from "shared/api/listings";

import { Listing } from "../../../../../../types/listings";
import { AsyncSelectPaginate } from "../../../../../../widgets/AsyncSelectPaginate/AsyncSelectPaginate";

interface ListingPublicationCreateProps {
	control: any;
}

export const ListingPublicationCreate: FC<ListingPublicationCreateProps> = ({ control }) => {
	return (
		<>
			<Controller
				name="listing"
				control={control}
				rules={{ required: "This field is required" }}
				render={({ field }) => (
					<AsyncSelectPaginate
						{...field}
						placeholder="Search listing"
						loadOptions={getListings}
						onChange={(value) => field.onChange(value)}
						onBlur={() => field.onBlur()}
						pageSize={10}
						getOptionLabel={(item: Listing) => item.id}
						getOptionValue={(item: Listing) => item.id}
					/>
				)}
			/>
		</>
	);
};
