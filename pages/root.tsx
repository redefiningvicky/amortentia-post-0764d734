import { createRootRouteWithContext, Outlet } from "@tanstack/react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BottomNav } from "../src/components/kit";
import { Toaster } from "../src/components/ui/sonner";

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  component: Root,
  notFoundComponent: () => <main><h1>Page not found</h1><a href="#/">Return home</a></main>,
});
function Root() {
  const { queryClient } = Route.useRouteContext();
  return <QueryClientProvider client={queryClient}><Outlet/><BottomNav/><Toaster/></QueryClientProvider>;
}
