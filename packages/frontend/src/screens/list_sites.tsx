import { css } from "@emotion/react";
import type { NextPage } from "next";
import Head from "next/head";
import React from "react";

import TOP_SECTION from "../components/container/TOP_SECTION";
import { WEBSITE_INFO, WEBSITE_FULL_VIEW } from "../components/container/WEBSITE_INFO";
import { WEBSITE_LIST_BLOCK } from "../components/container/WEBSITE_LIST_BLOCK";

const SITE_LIST_SCREEN: NextPage = () => {
	return (
		<React.Fragment>
			<TOP_SECTION />
			<WEBSITE_LIST_BLOCK/>
			
		
		</React.Fragment>
	);
};

export default SITE_LIST_SCREEN;
