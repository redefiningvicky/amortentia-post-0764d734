import { createRoot } from "react-dom/client";
import { createRouter, createHashHistory, RouterProvider } from "@tanstack/react-router";
import { QueryClient } from "@tanstack/react-query";
import { routeTree } from "../src/routeTree.gen";
import "@fontsource/cinzel-decorative/700.css";
import "@fontsource/cormorant-garamond/500.css";
import "@fontsource/cormorant-garamond/600.css";
import "@fontsource/cormorant-garamond/700.css";
import "@fontsource/cormorant-garamond/500-italic.css";
import "../src/styles.css";

const router = createRouter({
  routeTree,
  history: createHashHistory(),
  context: { queryClient: new QueryClient() },
  scrollRestoration: true,
});
router.subscribe("onResolved", () => {
  const match = [...router.state.matches].reverse().find(m => m.meta?.some(meta => meta?.title));
  const title = match?.meta?.find(meta => meta?.title)?.title;
  document.title = title ? String(title) : "Amortentia Post";
});
createRoot(document.getElementById("root")!).render(<RouterProvider router={router}/>);
