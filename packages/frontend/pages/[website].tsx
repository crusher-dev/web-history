import { css } from "@emotion/react";
import { useAtom,atom } from "jotai";
import type { NextPage } from "next";
import Head from "next/head";
import React from "react";
import { WebHistoryDB } from "../src/modules/supabase";
import WEBSITE_SCREEN from "../src/screens/website";
import { useHydrateAtoms } from 'jotai/utils'


export const pageDataAtom = atom([])
export const selectedInfoAtom = atom({
	current: 0
})

const Home: NextPage = ({siteRecord} : any) => {
	useHydrateAtoms([[pageDataAtom,siteRecord]])
	const [data,setData] = useAtom(pageDataAtom)

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
export async function getServerSideProps() {
	// Fetch data from external API
	const res = await WebHistoryDB.getSiteSnapshots("stripe.com")
	const siteRecord = res?.data || [];	

	return { props: { siteRecord } }
  }
  

export default Home;
