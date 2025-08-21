import React from 'react';
import { CryptoCoinsListEntry } from "../page/cryptoCoinsList/CryptoCoinsListEntry";
import { QueryClient } from "@tanstack/react-query";
import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client";
import { createSyncStoragePersister } from "@tanstack/query-sync-storage-persister";
import { Container } from "@mui/material";
import { ErrorModal } from "../component/ErrorModal";
import { CryptoMarketThemeProvider } from "../util/style/CryptoMarketThemeProvider";
import "./global.css"

const ReactQueryDevtools = import.meta.env.DEV
  ? (await import("@tanstack/react-query-devtools")).ReactQueryDevtools
  : () => null;

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            refetchOnWindowFocus: false,
            refetchOnReconnect: false,
            refetchOnMount: false,
            gcTime: 1000 * 60 * 60 * 24, // 24h
            staleTime: 30_000,
            retry: 3,
            retryDelay: (attempt) => Math.min(1000 * 2 ** attempt, 10000),
        }
    }
})

const persister = createSyncStoragePersister({ storage: window.localStorage })

export const App = () => {
    return (
        <CryptoMarketThemeProvider>
            <PersistQueryClientProvider
                client={ queryClient }
                persistOptions={{ persister, maxAge: 1000 * 60 * 60 * 24 }}
            >
                <Container sx={ { display: 'flex', flexDirection: 'column' } }>
                    <CryptoCoinsListEntry/>
                </Container>
                <ErrorModal/>
                <ReactQueryDevtools initialIsOpen={ false }/>
            </PersistQueryClientProvider>
        </CryptoMarketThemeProvider>
    );
}

