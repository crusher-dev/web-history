import { css } from "@emotion/react";
import type { NextPage } from "next";
import Head from "next/head";
import React from "react";
import IMAGE_LIST_HOMEPAGE from "../components/container/IMAGE_LIST_HOMEPAGE";
import TOP_SECTION from "../components/container/TOP_SECTION";

const HOME_SCREEN: NextPage = () => {
	return (
		<React.Fragment>
			<TOP_SECTION />
			<IMAGE_LIST_HOMEPAGE />
		</React.Fragment>
	);
};

export default HOME_SCREEN;
