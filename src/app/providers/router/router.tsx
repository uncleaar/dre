import { LoginPage, RegisterPage } from "pages/AuthPage";
import { BuildingCreateOrUpdate, BuildingsPage, BuildingView } from "pages/BuildingsPage";
import { HomePage } from "pages/HomePage";
import { ListingsPage } from "pages/ListingsPage";
import { PermissionsPage, PermissionView } from "pages/PermissionsPage";
import { AmenitiesPage } from "pages/SettingsPage/ui/AmenitiesPage";
import { ContactsPage } from "pages/SettingsPage/ui/ContactsPage";
import { UtilitiesPage } from "pages/SettingsPage/ui/UtilitiesPage";
import { UnitsPage } from "pages/UnitsPage";
import { UsersPage } from "pages/UsersPage";
import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { ROUTES } from "shared/constants";
import { AuthLayout } from "widgets/AuthLayout";
import { Layout } from "widgets/Collapsed/ui/Collapsed";

import { AppointmentsList, AppointmentView } from "../../../pages/AppointmentsPage";
import { ListingCreate } from "../../../pages/ListingsPage/ui/ListingCreate/ListingCreate";
import { ListingView } from "../../../pages/ListingsPage/ui/View/ListingView";
import { CreateOrUpdateUnit } from "../../../pages/UnitsPage/ui/CreateOrUpdate/CreateOrUpdateUnit";
import { UnitView } from "../../../pages/UnitsPage/ui/View/UnitView";
import { useStateContext } from "../StateProvider/state";

export const AuthAppRoutes = () => (
	<AuthLayout>
		<Routes>
			<Route path={ROUTES.LOGIN} element={<LoginPage />} />
			<Route path={ROUTES.REGISTER} element={<RegisterPage />} />
			<Route path="*" element={<Navigate to={ROUTES.LOGIN} />} />
		</Routes>
	</AuthLayout>
);

export const AppRoutes = () => {
	const { state } = useStateContext();

	const token = state.token;

	return (
		<>
			{!token && <AuthAppRoutes />}

			{token && (
				<Layout>
					<Routes>
						<Route path={ROUTES.HOME} element={<HomePage />} />
						<Route path={ROUTES.BUILDINGS} element={<BuildingsPage />} />
						<Route path={ROUTES.BUILDING_ID} element={<BuildingView />} />
						<Route path={ROUTES.BUILDING_NEW} element={<BuildingCreateOrUpdate isEdit={false} />} />
						<Route path={ROUTES.BUILDING_UPDATE} element={<BuildingCreateOrUpdate isEdit={true} />} />
						<Route path={ROUTES.USERS} element={<UsersPage />} />
						<Route path={ROUTES.PERMISSIONS} element={<PermissionsPage />} />
						<Route path={ROUTES.PERMISSION_ID} element={<PermissionView />} />
						<Route path={ROUTES.LISTINGS} element={<ListingsPage />} />
						<Route path={ROUTES.LISTING_CREATE} element={<ListingCreate />} />
						<Route path={ROUTES.LISTING_ID} element={<ListingView />} />
						<Route
							path={ROUTES.LISTING_PUBLICATION_CREATE_UNIT}
							element={<CreateOrUpdateUnit edit={false} />}
						/>
						<Route path={ROUTES.LISTING_PUBLICATION_UPDATE_UNIT} element={<CreateOrUpdateUnit edit />} />
						<Route path={ROUTES.LISTING_PUBLICATION_UNIT_ID} element={<UnitView />} />
						<Route
							path={ROUTES.LISTING_PUBLICATION_UPDATE_BUILDING}
							element={<BuildingCreateOrUpdate isEdit />}
						/>
						<Route path={ROUTES.LISTING_PUBLICATION_BUILDING_ID} element={<BuildingView />} />
						<Route path={ROUTES.UNITS} element={<UnitsPage />} />
						<Route path={ROUTES.UNIT_ID} element={<UnitView />} />
						<Route path={ROUTES.UNITS_NEW} element={<CreateOrUpdateUnit edit={false} />} />
						<Route path={ROUTES.UNITS_UPDATE} element={<CreateOrUpdateUnit edit />} />
						<Route path={ROUTES.SETTINGS_CONTACTS} element={<ContactsPage />} />
						<Route path={ROUTES.SETTINGS_AMENITIES} element={<AmenitiesPage />} />
						<Route path={ROUTES.SETTINGS_UTILITIES} element={<UtilitiesPage />} />
						<Route path={ROUTES.APPOINTMENTS} element={<AppointmentsList />} />
						<Route path="*" element={<Navigate to={ROUTES.HOME} />} />
					</Routes>
				</Layout>
			)}
		</>
	);
};
