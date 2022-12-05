import {  atom } from "jotai";
import type { NextPage } from "next";
import Head from "next/head";
import React from "react";

import { WebHistoryDB } from "../src/modules/supabase";

import { useHydrateAtoms } from "jotai/utils";
import SITE_LIST_SCREEN from "../../src/screens/list_sites";

export const pageDataAtom = atom([]);
export const selectedInfoAtom = atom({
	current: 0,
});

const WebsitePage: NextPage = ({ siteRecord }: any) => {
	useHydrateAtoms([[pageDataAtom, siteRecord]]);
	return (
		<React.Fragment>
			<Head>
				<title>Website history - by Crusher</title>
			</Head>
			<SITE_LIST_SCREEN />
		</React.Fragment>
	);
};

export async function getServerSideProps({ query }) {
	// const { website } = query;
	// const res = await WebHistoryDB.getSiteSnapshots(website);
	// const siteRecord = res?.data || [];
	// const sortedRecord = siteRecord.sort((x: any, y: any) => {
	// 	return new Date(x.timestamp) - new Date(y.timestamp);
	// });

	return { props: { 
		// siteRecord: sortedRecord
	 } };
}

export default WebsitePage;
