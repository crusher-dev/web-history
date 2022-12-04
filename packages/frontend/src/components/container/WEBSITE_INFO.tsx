import { css } from "@emotion/react";

import React from "react";
import { CONTAINER_1234_24 } from "../../constants/style";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { ZoomIcon } from "../../constants/svg";

export const SmallCard = () => {
	return (
		<motion.div
			style={{
				opacity: 0.7,
			}}
			whileHover={{
				y: -3,
				opacity: 1,
				transition: { duration: 0.1 },
			}}
		>
			<img src="img/stripe.png" css={imageCSS} />
			<div className="mt-20">oct 2020</div>
		</motion.div>
	);
};

const ZOOM_MODE = ({ isVisible, setZoom }) => {
	return (
		<AnimatePresence>
			{isVisible && (
				<motion.div
					initial={{ opacity: 0 }}
					animate={{ opacity: 1, transition: { duration: 0.2 } }}
					exit={{ opacity: 0 }}
					css={overlayCSS}
					className={"flex items-center"}
					onClick={setZoom.bind(this, false)}
				>
					<img src="/img/stripe.png" css={leftImage} />
					<img src="/img/stripe.png" css={centerImage} />
					<img src="/img/stripe.png" css={leftImage} />
				</motion.div>
			)}
		</AnimatePresence>
	);
};

const leftImage = css`
	filter: blur(1.5px);
	border-radius: 29px;
	width: 775px;
	height: 465px;
	object-fit: cover;
`;
const centerImage = css`
	width: 775px;
	height: 465px;
	border-radius: 29px;
	object-fit: cover;
`;
const overlayCSS = css`
	position: fixed;
	z-index: 20;
	top: 0;
	left: 0;
	width: 100vw;
	height: 100vh;
	background: rgba(1, 1, 1, 0.66);
	backdrop-filter: blur(9px);
	gap: 32px;
	padding: 0 80px;
	overflow-x: scroll;
`;
export const WEBSITE_INFO = (): JSX.Element => {
	const [showZoom, setZoom] = useState(false);
	return (
		<div
			css={[
				CONTAINER_1234_24
			]}
		>
			<div className="flex justify-between pt-40 md:pt-24">
				<div
					className=""
					css={css`
						color: #cbcbcb;
					`}
				>
					<h1 className="text-16 mt-0 mb-0 font-900 leading-none md:text-16 md:leading-1.7" >
						stripe.com design history
					</h1>

					<div className="text-13 font-400 mt-8 text-12 md:leading-1.7 md:mt-4">for navigating use updated 12 times</div>
				</div>
				<div className="flex items-center cursor-pointer" onClick={setZoom.bind(this, true)}>
					<ZoomIcon height={16} width={16} className="mr-6 mt-2"/> zoom
				</div>
			</div>

			<div
				className="mt-36 md:mt-20 flex"
				css={css`
					gap: 48px;
				`}
			>
				<SmallCard />
				<SmallCard />
			</div>

			<ZOOM_MODE isVisible={showZoom} setZoom={setZoom} />
		</div>
	);
};

export const WEBSITE_FULL_VIEW = () => {
	return (
		<div className="mt-64">
			<img src="img/stripe.png" />
		</div>
	);
};

const imageCSS = css`
	width: 129px;
	height: 83px;
	background: url(Screenshot 2022-11-28 at 11.16.png);
	border: 1.5px solid #bbbbbb;
	border-radius: 10px;
`;

export default WEBSITE_INFO;
