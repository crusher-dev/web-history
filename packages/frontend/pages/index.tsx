import { css } from "@emotion/react";
import type { NextPage } from "next";
import Head from "next/head";
import React from "react";
import { WebHistoryDB } from "../src/modules/supabase";
import HOME_SCREEN from "../src/screens/home";

const Home: NextPage = (props) => {
	console.log(props)
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
	return { props: { sites: data } };
}