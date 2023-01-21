import React from 'react';
import { CryptoCoinsListEntry } from "../page/cryptoCoinsList/CryptoCoinsListEntry";
import { QueryClient, QueryClientProvider } from "react-query";
import { Container } from "@mui/material";

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            refetchOnWindowFocus: false,
            refetchOnReconnect: false,
            refetchOnMount: false,
            cacheTime: Infinity,
            staleTime: Infinity,
        }
    }
})

export const App = () => {
    return (
        <QueryClientProvider client={ queryClient }>
            <Container sx={{ display: 'flex', flexDirection: 'column' }}>
                <CryptoCoinsListEntry/>
            </Container>
        </QueryClientProvider>
    );
}

