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
	const {data} = await WebHistoryDB.getSiteRecords();
	
	return { props: { list:{
		popular: data
	} } };
}