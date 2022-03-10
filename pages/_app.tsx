import '../styles/globals.css'
import { AppBar, Box, Container, ThemeProvider, Toolbar, Typography } from '@mui/material';
import type { AppProps } from 'next/app'
import Head from 'next/head';
import React from 'react';
import { theme } from '../styles/theme';

function MyApp({ Component, pageProps }: AppProps) {
  React.useEffect(() => {
    // Remove the server-side injected CSS.
    const jssStyles = document.querySelector('#jss-server-side');
    if (jssStyles) {
      jssStyles.parentElement!.removeChild(jssStyles);
    }
  }, []);

  return (
    <React.Fragment>
      <Head>
        <title>Ulventech Form</title>
        <meta name="viewport" content="minimum-scale=1, initial-scale=1, width=device-width" />
      </Head>
      <ThemeProvider theme={theme}>
        <AppBar position="fixed">
          <Toolbar variant="dense">
            <Typography variant="h6">Ulventech Dynamic Form</Typography>
          </Toolbar>
        </AppBar>

        <Container>
          <Box marginTop={10}>
            <Component {...pageProps} />
          </Box>
        </Container>
      </ThemeProvider>
    </React.Fragment>
  );
}

export default MyApp
