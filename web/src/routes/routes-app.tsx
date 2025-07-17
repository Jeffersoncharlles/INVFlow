import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import LayoutRoot from "@/page/layout";
import Streams from "@/page/streams";

const queryClient = new QueryClient();

const RoutesApp = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LayoutRoot />}>
            <Route index element={<Streams />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
};
export default RoutesApp;
