import "../styles/globals.css";
import type { AppProps } from "next/app";
// import {Helmet} from "react-helmet";
import Head from "next/head";

function MyApp({ Component, pageProps }: AppProps) {
	return (
    <>
        <Head>
          <title>Web History</title>
          <meta name="viewport" content="initial-scale=1.0, width=device-width" />
          <link href="/favicon.png" rel="shortcut icon" type="image/x-icon"></link>
        </Head>
        <Component {...pageProps} />
      </>
	);
}


export default MyApp;
