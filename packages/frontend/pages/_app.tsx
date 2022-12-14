import "../styles/globals.css";
import type { AppProps } from "next/app";
// import {Helmet} from "react-helmet";
import Head from "next/head";

function MyApp({ Component, pageProps }: AppProps) {
	return (
		<>
			<Head>
				<title>Website history - by Crusher</title>
				<style
					dangerouslySetInnerHTML={{
						__html: `html{ font-size: 1px;}`,
					}}
				/>
				<meta name="viewport" content="initial-scale=1.0, width=device-width" />
				<link href="/resources/logo-100.png" rel="shortcut icon" type="image/x-icon"></link>

				<link rel="preconnect" href="https://fonts.googleapis.com" />
				<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin={true} />
				<link href="https://fonts.googleapis.com/css2?family=Source+Code+Pro:wght@400;500;600;700;800;900&display=swap" rel="stylesheet"></link>
			</Head>
			<Component {...pageProps} />
		</>
	);
}

export default MyApp;
