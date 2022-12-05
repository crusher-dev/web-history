import type { NextPage } from "next";
import React from "react";
import SITES_SECTION from "../components/container/IMAGE_LIST_HOMEPAGE";
import TOP_SECTION from "../components/container/TOP_SECTION";

const HOME_SCREEN: NextPage = () => {
	return (
		<React.Fragment>
			<TOP_SECTION />

			<SITES_SECTION />
		</React.Fragment>
	);
};

export default HOME_SCREEN;
