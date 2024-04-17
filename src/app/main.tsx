import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import { createTheme, MantineProvider } from "@mantine/core";
import { DatesProvider } from "@mantine/dates";
import { Notifications } from "@mantine/notifications";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

import AuthMiddleware from "./middleware/authMiddleware";
import { ErrorBoundary } from "./providers/ErrorBoundary/ErrorBoundary";
import { StateContextProvider } from "./providers/StateProvider/state";
import { App } from "./app";

import "./styles/globals.scss";
import "@mantine/core/styles.css";
import "@mantine/notifications/styles.css";
import "@mantine/dates/styles.css";

const theme = createTheme({});

const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			staleTime: 5 * 1000
		}
	}
});

ReactDOM.createRoot(document.getElementById("root")!).render(
	<React.StrictMode>
		<BrowserRouter>
			<QueryClientProvider client={queryClient}>
				<ReactQueryDevtools initialIsOpen={false} />
				<ErrorBoundary>
					<MantineProvider theme={theme}>
						<Notifications />
						<StateContextProvider>
							<AuthMiddleware>
								<DatesProvider settings={{ locale: "en" }}>
									<App />
								</DatesProvider>
							</AuthMiddleware>
						</StateContextProvider>
					</MantineProvider>
				</ErrorBoundary>
			</QueryClientProvider>
		</BrowserRouter>
	</React.StrictMode>
);
