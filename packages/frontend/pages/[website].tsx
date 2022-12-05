import { css } from "@emotion/react";
import { useAtom, atom } from "jotai";
import type { NextPage } from "next";
import Head from "next/head";
import React from "react";
import { WebHistoryDB } from "../src/modules/supabase";
import WEBSITE_SCREEN from "../src/screens/website";
import { useHydrateAtoms } from "jotai/utils";

export const pageDataAtom = atom([]);
export const selectedInfoAtom = atom({
	current: 0,
});

const Home: NextPage = ({ siteRecord }: any) => {
	useHydrateAtoms([[pageDataAtom, siteRecord]]);

	return (
		<React.Fragment>
			<Head>
				<title>Website history - By Crusher</title>
			</Head>
			<WEBSITE_SCREEN />
		</React.Fragment>
	);
};

// This gets called on every request
export async function getServerSideProps({ query }) {
	const { website } = query;

	// Fetch data from external API
	const res = await WebHistoryDB.getSiteSnapshots(website);
	const siteRecord = res?.data || [];

	const sortedRecord = siteRecord.sort((x: any, y: any) => {
		return new Date(x.timestamp) - new Date(y.timestamp);
	});

	console.log(res, query);

	console.log(siteRecord);

	return { props: { siteRecord: sortedRecord } };
}

export default Home;
