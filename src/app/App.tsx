import React from 'react';
import { CryptoCoinsListEntry } from "../page/cryptoCoinsList/CryptoCoinsListEntry";
import { QueryClient, QueryClientProvider } from "react-query";
import { Container } from "@mui/material";
import { ReactQueryDevtools } from "react-query/devtools";
import { ErrorModal } from "../component/ErrorModal";
import { CryptoMarketThemeProvider } from "../util/style/CryptoMarketThemeProvider";
import "./global.css"

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
        <CryptoMarketThemeProvider>
            <QueryClientProvider client={ queryClient }>
                <Container sx={ { display: 'flex', flexDirection: 'column' } }>
                    <CryptoCoinsListEntry/>
                </Container>
                <ErrorModal/>
                <ReactQueryDevtools initialIsOpen={ false }/>
            </QueryClientProvider>
        </CryptoMarketThemeProvider>
    );
}

