import { QueryClient } from "@tanstack/react-query";
import { createRouter as createTanStackRouter } from "@tanstack/react-router";
import { routerWithQueryClient } from "@tanstack/react-router-with-query";
import { routeTree } from "./routeTree.gen";
import { DefaultCatchBoundary } from "./components/DefaultCatchBoundary";
import { NotFound } from "./components/NotFound";
import { createGrpcWebTransport } from "@connectrpc/connect-web";
import { TransportProvider } from "@connectrpc/connect-query";
import type { Transport } from "@connectrpc/connect";

// NOTE: Most of the integration code found here is experimental and will
// definitely end up in a more streamlined API in the future. This is just
// to show what's possible with the current APIs.

export function createRouter() {
	// Use different base URL for development vs production
	const baseUrl =
		process.env.NODE_ENV === "development"
			? "http://localhost:8080" // For docker compose backend
			: "http://localhost:8080"; // For production

	const finalTransport = createGrpcWebTransport({
		baseUrl,
		// Use binary format for better compatibility with Envoy
		useBinaryFormat: true,
	});

	const queryClient = new QueryClient();

	const router = routerWithQueryClient(
		createTanStackRouter({
			routeTree,
			context: {
				queryClient,
				transport: finalTransport,
			} as { queryClient: QueryClient; transport: Transport },
			defaultPreload: "intent",
			defaultErrorComponent: DefaultCatchBoundary,
			defaultNotFoundComponent: () => <NotFound />,
			Wrap: ({ children }) => (
				<TransportProvider transport={finalTransport}>
					{children}
				</TransportProvider>
			),
		}),
		queryClient,
	);

	return router;
}

declare module "@tanstack/react-router" {
	interface Register {
		router: ReturnType<typeof createRouter>;
	}
}
