import { css } from "@emotion/react";

import React from "react";
import { CONTAINER_1234_24 } from "../../constants/style";
import { GithubIcon, Logo, SearchIcon } from "../../constants/svg";

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
	// background: linear-gradient(0deg, rgba(0, 0, 0, 0.60), rgba(0, 0, 0, 0.60)), url("/img/stripe.png");

	filter: blur(12.5px);
	z-index: -1;
	> div {
		position: absolute;
		z-index: 1;
		height: 201px;
		width: 100%;

		// background: linear-gradient(180deg, rgba(6, 9, 12, 0.6) 0%, #0A0C0E 100%);
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

const MENU = () => {
	return (
		<div id="menu" className="realtive flex items-center justify-between pt-24 relative" css={menuCSS}>
			<div
				id="logo"
				className="font-source font-800 text-14"
				css={css`
					color: #fff;
					grid-area: logo;
				`}
			>
				website history
			</div>

			<div className="relative" css={inputContainer}>
				<input id="search" placeholder="search website" css={inputCSS} className="text-12" autoComplete="off" />
				<SearchIcon
					className="absolute"
					css={css`
						top: 50%;
						transform: translateY(-50%);
						right: 16px;
					`}
				/>
			</div>

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
				<a className="text-13">examples</a>
				<a className="text-13">how it works</a>
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
			: fast{" "}
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
						<span className="mr-12">by</span> <Logo />
					</div>
				</div>
				<div
					className="mt-16 text-13.5 md:mt-8 md:text-12.5 md:leading-2"
					css={css`
						@media screen and (max-width: 680px) {
							display: none;
						}
					`}
				>
					{desktopLabel}
				</div>
				<div
					className="mt-16 text-13.5 md:mt-8 md:text-12.5 md:leading-2"
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
				className="flex items-center md:mt-8"
				css={css`
					gap: 20px;
				`}
			>
				<div
					className="mt-6"
					css={css`
						min-height: 25.5px;
						min-width: 100px;
						margin-right: -18px;
					`}
				>
					<a class="github-button" href="https://github.com/crusherdev/crusher" data-show-count="true" aria-label="Star crusherdev/crusher on GitHub">
						Star
					</a>
				</div>
				<GithubIcon />
				<div css={buttonCSS} className="flex no-select leading-none items-center pb-6 text-13">
					demo
				</div>
			</div>
			<script async defer src="https://buttons.github.io/buttons.js"></script>
		</div>
	);
};

const TOP_SECTION = (): JSX.Element => {
	return (
		<div className={"relative"}>
			<BLUR_LAYER />
			<div
				css={[
					CONTAINER_1234_24,
					// css`background: black; padding-bottom: 20px;`
				]}
			>
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
		margin-bottom: 4px;
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
