import { css } from "@emotion/react";
import { useHydrateAtoms } from "jotai/utils";
import { atom } from "jotai/vanilla";
import type { NextPage } from "next";
import Head from "next/head";
import React from "react";
import { WebHistoryDB } from "../src/modules/supabase";
import HOME_SCREEN from "../src/screens/home";

export const indexDataAtom = atom({});

const Home: NextPage = (props) => {
	useHydrateAtoms([[indexDataAtom, props.list]]);
	return (
		<React.Fragment>
			<Head>
				<title>Website history - By Crusher</title>
			</Head>
			<HOME_SCREEN />
		</React.Fragment>
	);
};

export default Home;


export async function getServerSideProps({ query }) {
	let {data} = await WebHistoryDB.getSiteRecords();
	if(data?.length) {
		data = await Promise.all(data.map((item) => {
			return new Promise(async (resolve, reject) => {
				let snapshotRes = await WebHistoryDB.getLatestSnapshotRecord(item.id);
				resolve({...item, thumbnail_url: snapshotRes?.data?.[0]?.thumbnail_url || null});
			});
		}));
	}
	return { props: { list:{
		popular: data
	} } };
}