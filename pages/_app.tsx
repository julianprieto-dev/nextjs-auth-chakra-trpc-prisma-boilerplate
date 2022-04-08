import type { AppProps } from "next/app";
import { withTRPC } from "@trpc/next";
import { AppRouter } from "server/routers/_app";
import { ChakraProvider } from "@chakra-ui/react";
import AuthProvider from "contexts/AuthContext";
import { getUserFromLocalStorage } from "utils/common";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <AuthProvider>
      <ChakraProvider>
        <Component {...pageProps} />
      </ChakraProvider>
    </AuthProvider>
  );
}

export default withTRPC<AppRouter>({
  config({ ctx }) {
    const url = process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}/api/trpc`
      : "http://localhost:3000/api/trpc";
    const userFromStorage = getUserFromLocalStorage();

    return {
      url,
      headers: {
        Authorization: userFromStorage ? `Bearer ${userFromStorage.accessToken}` : undefined,
      },
      queryClientConfig: {
        defaultOptions: {
          queries: {
            refetchOnWindowFocus: false,
          },
        },
      },
    };
  },
  ssr: false,
})(MyApp);
