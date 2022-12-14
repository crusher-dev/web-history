import { css } from "@emotion/react";

import React, { useEffect } from "react";
import { useState } from "react";
import { CONTAINER_1234_24 } from "../../constants/style";
import { GithubIcon, Logo, SearchIcon } from "../../constants/svg";
import { WebHistoryDB } from "../../modules/supabase";

const BLUR_LAYER = () => {
	return (
		<div className="absolute" css={layerCSS}>
			<div className=""></div>
		</div>
	);
};

const layerCSS = css`
	position: absolute;
	width: 100%;
	top: -12px;
	height: 201px;

	background: url("/img/stripe.png");
	background-position: -200px;

	filter: blur(12.5px);
	z-index: -1;
	> div {
		position: absolute;
		z-index: 1;
		height: 201px;
		width: 100%;
		background: linear-gradient(180deg, rgba(2, 3, 4, 0.88) 0%, #0a0c0e 100%);
	}
`;

const menuCSS = css`

  @media screen and (max-width: 880px){
    display: grid;
    grid-template-areas: 
    'logo'
    'search'
    'menu';
    grid-template-columns: 1fr;
    grid-template-rows: repeat(3, auto);
    grid-row-gap: 4px;

`;

export const SEARCH_INPUT = () => {
	const [showBar, setShow] = useState(false);
	const [query,setQuery] = useState("")

	const [data,setData] = useState([]);

	useEffect(()=>{
		
		if(query.length<4){
			setData([])
			return;
		}
		const getData = async()=>{
			const {data} = await WebHistoryDB.getSiteRecordsForSearch(query);
			setData(data)
		}
		getData()
	},[query]);

	console.log(data)

	return (
		<div className="relative" css={inputContainer}>
			<input
			value={query}
			onChange={(e)=>{
				setQuery(e.target.value)
			}}
			onBlur={()=>{
				// basic hack don't want to add event listener right now
				setTimeout(setShow.bind(this, false),100)
			}} onFocus={setShow.bind(this, true)} id="search" placeholder="search website" css={inputCSS} className="text-12" autoComplete="off" />
			<SearchIcon
				className="absolute"
				css={css`
					top: 50%;
					transform: translateY(-50%);
					right: 16px;
				`}
			/>
			{showBar && (
				<div className="absolute flex flex-col" css={suggestionBoxCSS}>
					{data.map(({url})=>{
						return (<a href={`/${url}`}><div className="items text-12.5">Open {url}</div></a>)
					})}
					<a href={`/${query}`}>
					<div className="items text-12.5">track {query}</div>
					</a>
				</div>
			)}
		</div>
	);
};

const suggestionBoxCSS = css`
	background: rgb(13 12 12 / 60%);
	backdrop-filter: blur(6px);
	border-radius: 8px;
	border: 0.5px solid rgba(106, 106, 106, 0.2);
	padding: 12px 10px;
	width: 100%;
	top: calc(110% + 8px);

	gap: 5px;

	.items {
		padding: 4px 6px;
		cursor: pointer;
		border-radius: 6px;
		:hover {
			background: rgba(255, 255, 255, 0.1);
		}
	}
`;

const MENU = () => {
	return (
		<div id="menu" className="realtive flex items-center justify-between pt-24 relative" css={menuCSS}>
			<a href="https://crusher.dev/website-history">
				<div
					id="logo"
					className="flex items-center font-source font-800 text-14"
					css={css`
						color: #fff;
						grid-area: logo;
					`}
				>
					<img src="/resources/logo-100.png" height={"28px"} width={"28px"}/><span className="ml-12 leading-none">website history</span>
				</div>
			</a>
			<SEARCH_INPUT />
			<div
				className="flex items-center"
				css={css`
					gap: 24px;
					color: #cbcbcb;
					letter-spacing: -0.04em;
					@media screen and (max-width: 650px) {
						grid-area: menu;
					}
				`}
			>
				<a className="text-13" href="/list/a">list</a>
				{/* <a className="text-13">how it works</a> */}
				<div css={buttonCSS} className="flex no-select leading-none items-center pb-6 text-13">
					track site
				</div>
			</div>
		</div>
	);
};

const MiddleBar = () => {
	const mobileLabel = (
		<React.Fragment>
			fast{" "}
			<span
				css={css`
					color: rgba(160, 255, 65, 1);
				`}
			>
				all-in-one testing
			</span>
			, with low-code
		</React.Fragment>
	);

	const desktopLabel = (
		<React.Fragment>
		fast{" "}
			<span
				css={css`
					color: #41bbff;
				`}
			>
				all-in-one testing
			</span>{" "}
			framework, with magical low-code
		</React.Fragment>
	);
	return (
		<div className="flex mt-52 mb-36 md:mb-20 w-full justify-between md:flex-col">
			<div>
				<div className="flex items-center">
					<div className="flex items-center mr-20">
						<span className="mr-12">by</span>
						<a href="https://crusher.dev">
							<Logo alt="Crusher logo" />
						</a>
					</div>
				</div>
				<div
					className="mt-12 text-12 md:mt-6 md:text-12.5 md:leading-2"
					css={css`
						@media screen and (max-width: 680px) {
							display: none;
						}
					`}
				>
					{desktopLabel}
				</div>
				<div
					className="mt-12 text-12 md:mt-8 md:text-12.5 md:leading-2"
					css={css`
						@media screen and (min-width: 680px) {
							display: none;
						}
					`}
				>
					{mobileLabel}
				</div>
			</div>

			<div
				className="flex items-center md:mt-12"
				css={css`
					gap: 20px;
				`}
			>
				<div
					className="mt-6"
					css={css`
						min-height: 25.5px;
						min-width: 130px;
						margin-right: -18px;
						zoom: 0.85;
					`}
				>
					<a class="github-button" href="https://github.com/crusherdev/crusher" data-show-count="true" aria-label="Star crusherdev/crusher on GitHub" data-icon="octicon-star" data-size="large">
					Star
					</a>
				</div>
				<a href="https://github.com/crusher-dev/crusher" target="_blank">
					<GithubIcon alt="Crusher codebase" />
				</a>
				<a href="https://docs.crusher.dev/getting-started/create-your-first-test#recording-first-test" target="_blank">
					<div css={buttonCSS} className="flex no-select leading-none items-center pb-6 text-13">
						demo
					</div>
				</a>
			</div>
			<script async defer src="https://buttons.github.io/buttons.js"></script>
		</div>
	);
};

const TOP_SECTION = (): JSX.Element => {
	return (
		<div className={"relative"}>
			<BLUR_LAYER />
			<div css={[CONTAINER_1234_24]}>
				<MENU />
				<MiddleBar />
			</div>
		</div>
	);
};

const inputContainer = css`
	position: absolute;
	left: 50%;
	transform: translateX(calc(-50% - 40px));

	grid-area: search;
	@media screen and (max-width: 880px) {
		position: relative !important;
		grid-area: search;
		left: 0% !important;
		transform: none;
		margin-top: 12px;
		margin-bottom: 8px;
		width: 100%;
		max-width: 400px;
	}
`;
const inputCSS = css`
	background: rgba(255, 255, 255, 0.02);
	border-radius: 8px;
	border: 0.5px solid rgba(106, 106, 106, 0.2);
	padding: 5px 12px;
	min-height: 34px;
	cursor: pointer;
	width: 283px;

	:focus {
		border-color: rgba(71, 71, 71);
	}

	@media screen and (max-width: 880px) {
		width: 100%;
		min-height: 38px;
	}
`;

const buttonCSS = css`
	background: rgba(255, 255, 255, 0.04);
	border-radius: 6px;
	border: 0.5px solid rgba(106, 106, 106, 0.3);
	padding: 0 10px;
	padding-bottom: 1px;
	height: 26px;
	cursor: pointer;
	:hover {
		background: rgba(255, 255, 255, 0.09);
	}
`;

export default TOP_SECTION;
