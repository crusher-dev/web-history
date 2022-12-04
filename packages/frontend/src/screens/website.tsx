import { css } from "@emotion/react";
import type { NextPage } from "next";
import Head from "next/head";
import React from "react";

import TOP_SECTION from "../components/container/TOP_SECTION";
import { WEBSITE_INFO, WEBSITE_FULL_VIEW } from "../components/container/WEBSITE_INFO";

const WEBSITE_SCREEN: NextPage = () => {
	return (
		<React.Fragment>
			<TOP_SECTION />
			<WEBSITE_INFO />
			<WEBSITE_FULL_VIEW />
		</React.Fragment>
	);
};

export default WEBSITE_SCREEN;
