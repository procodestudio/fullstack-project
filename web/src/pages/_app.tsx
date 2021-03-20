import { AppProps } from 'next/app';
import { ChakraProvider, ColorModeProvider } from '@chakra-ui/react'
import { createClient, Provider as GQLProvider } from 'urql';

import theme from '../theme'

const client = createClient({
  url: 'http://localhost:4000/graphql',
  fetchOptions: {
    credentials: "include",
  }
});

const MyApp: React.FC<AppProps> = ({ Component, pageProps }) => {
  return (
    <GQLProvider value={client}>
      <ChakraProvider resetCSS theme={theme}>
        <ColorModeProvider
          options={{
            useSystemColorMode: true,
          }}
        >
          <Component {...pageProps} />
        </ColorModeProvider>
      </ChakraProvider>
    </GQLProvider>
  );
}

export default MyApp;