import { css } from "@emotion/react";

import React from "react";
import { CONTAINER_1234_24 } from "../../constants/style";
import { GithubIcon, Logo } from "../../constants/svg";

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

const MENU = () => {
	return (
		<div id="menu" className="realtive flex items-center justify-between pt-24 relative">
			<div
				id="logo"
				className="font-source font-800 text-14"
				css={css`
					color: #cbcbcb;
				`}
			>
				website history
			</div>

			<div className="relative" css={inputContainer}>
				<input id="search" placeholder="search website" css={inputCSS} className="text-12" />
			</div>

			<div
				className="flex items-center"
				css={css`
					gap: 24px;
					color: #cbcbcb;
					letter-spacing: -0.04em;
				`}
			>
				<a className="text-13">examples</a>
				<a className="text-13">how it works</a>
				<div css={buttonCSS} className="flex no-select leading-none items-center pb-6 text-13">
					track my website
				</div>
			</div>
		</div>
	);
};

const MiddleBar = () => {
	return (
		<div className="flex mt-52 w-full justify-between">
			<div>
				<div className="flex items-center">
					<div className="flex items-center mr-20">
						{" "}
						<span className="mr-12">by</span> <Logo />{" "}
					</div>
				</div>
				<div className="mt-16 text-13.5">
					: fast{" "}
					<span
						css={css`
							color: #41bbff;
						`}
					>
						all-in-one
					</span>{" "}
					testing framework, with magical low-code
				</div>
			</div>

			<div
				className="flex items-center"
				css={css`
					gap: 20px;
				`}
			>
				<div
					css={css`
						min-height: 25.5px;
						min-width: 100px;
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
			<div css={[CONTAINER_1234_24]}>
				<MENU />
				<MiddleBar />
			</div>
		</div>
	);
};

const inputContainer = css`
	position: absolute !important;
	left: 50%;
	// -40px to offset CSS
	transform: translateX(calc(-50% - 40px));
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
