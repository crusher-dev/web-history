import { css } from "@emotion/react";
import type { NextPage } from "next";
import Head from "next/head";
import React from "react";
import HOME_SCREEN from "../src/screens/home";

const Home: NextPage = () => {
	return (
		<React.Fragment>
			<Head>
				<title>Website history - By Crusher</title>
			</Head>
			<HOME_SCREEN/>
		</React.Fragment>
	);
};

export default Home;
