"use client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
function ReactqueryProvider (props: any) {

    const queryClient = new QueryClient()
    return (
         <QueryClientProvider client={queryClient}>
            {props.children}
         </QueryClientProvider>
    )
}

export default ReactqueryProvider;