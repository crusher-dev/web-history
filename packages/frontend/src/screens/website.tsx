import { css } from "@emotion/react";
import { useAtom } from "jotai";
import type { NextPage } from "next";
import Head from "next/head";
import React from "react";
import { isAvailableAtom } from "../../pages/[website]";

import TOP_SECTION from "../components/container/TOP_SECTION";
import { WEBSITE_INFO, WEBSITE_FULL_VIEW } from "../components/container/WEBSITE_INFO";
import { WEBSITE_SUBSCRIBE_PROMPT } from "../components/container/WEBSITE_SUBSCRIBE_PROMPT";

const WEBSITE_SCREEN: NextPage = () => {
	const [isAvaiable] = useAtom(isAvailableAtom)
	return (
		<React.Fragment>
			<TOP_SECTION />
			{isAvaiable && (
				<React.Fragment>
					<WEBSITE_INFO />
					<WEBSITE_FULL_VIEW />
				</React.Fragment>
			)}
			{!isAvaiable && (
				<WEBSITE_SUBSCRIBE_PROMPT/>
			)}
		</React.Fragment>
	);
};

export default WEBSITE_SCREEN;
