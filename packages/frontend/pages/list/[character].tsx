import {  atom } from "jotai";
import type { NextPage } from "next";
import Head from "next/head";
import React from "react";

import { WebHistoryDB } from "../../src/modules/supabase";

import { useHydrateAtoms } from "jotai/utils";
import SITE_LIST_SCREEN from "../../src/screens/list_sites";

export const listDataAtom = atom([]);
export const selectedInfoAtom = atom({
	current: 0,
});

const WebsitePage: NextPage = ({ sites }: any) => {
	useHydrateAtoms([[listDataAtom, sites]]);
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
	const {character} = query;
	const {data} = await WebHistoryDB.getSiteRecords(character);

	return { props: { sites: data } };
}

export default WebsitePage;
