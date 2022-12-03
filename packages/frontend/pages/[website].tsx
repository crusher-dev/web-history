import { css } from "@emotion/react";
import type { NextPage } from "next";
import Head from "next/head";
import React from "react";

import WEBSITE_SCREEN from "../src/screens/website";

const Home: NextPage = () => {
	return (
		<React.Fragment>
			<Head>
				<title>Website history - By Crusher</title>
			</Head>
			<WEBSITE_SCREEN />
		</React.Fragment>
	);
};

export default Home;
