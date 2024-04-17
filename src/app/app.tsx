import { Suspense } from "react";

import { AppRoutes } from "./providers/router/router";

export const App = () => {
	return (
		<div className="app">
			<Suspense fallback="">
				<AppRoutes />
			</Suspense>
		</div>
	);
};
