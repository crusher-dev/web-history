import { css } from "@emotion/react";


import { CONTAINER_1234_24 } from "../../constants/style";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { Arrow, ZoomIcon } from "../../constants/svg";
import { Button } from "../common/Button";
import { atom, useAtom } from "jotai";
import { pageDataAtom, selectedInfoAtom } from "../../../pages/[website]";
import { useRouter } from "next/router";
import { KeyboardEvent } from "react";
import { useCallback } from "react";
import { getCdnFile } from "../../utils";

const zoomAtom = atom(false);



export const SmallCard = ({ instanceInfo, index }) => {
	const { thumbnail_url, timestamp,is_nsfw } = instanceInfo;
	const [selectedInstance, selectInstance] = useAtom(selectedInfoAtom);

	const select = () => {
		selectInstance({ current: index });
	};
	const isSelected = selectedInstance.current === index;
	const date = new Date(timestamp);

	const Wrapper = useCallback(({children})=>{
		if(typeof(window) !== 'undefined' && window.innerWidth < 600){
			return <a href={!!is_nsfw ? "/img/nsfw.jpg" : getCdnFile(thumbnail_url)} target="_blank">{children}</a>
		}
		return children;
	},[])



	return (
		<Wrapper>
			<motion.div
			style={{
				opacity: 0.4,
			}}
			animate={{opacity: isSelected? 1 : 0.4}}
			whileHover={{
				y: -3,
				opacity: 1,
				transition: { duration: 0.1 },
			}}
			onClick={select.bind(this)}
		>
			<img src={!!is_nsfw ? "/img/nsfw.jpg" :getCdnFile(thumbnail_url)} css={imageCSS} />
			<div className="mt-12 md:mt-12">
				{date.toLocaleString("default", { month: "long" })} {date.getFullYear()}
			</div>
		</motion.div>
		</Wrapper>
	);
};

const ZOOM_MODE = ({ isVisible, setZoom, selectedIndex }) => {
	useEffect(() => {
		const handleScroll:any = (e:KeyboardEvent) => {
			e.stopPropagation()
			const { keyCode } = e;

			const scrollBox = document.querySelector("#scroll-box") as HTMLImageElement;
			const currentImage  = document.querySelector("#current-image") as HTMLImageElement;

			if (keyCode === 37 && scrollBox) {
				scrollBox.scrollTo({
					left: scrollBox.scrollLeft - currentImage.offsetWidth,
					behavior: "smooth",
				});
			}
			if (keyCode === 39 && scrollBox) {
				scrollBox.scrollTo({
					left: scrollBox.scrollLeft + currentImage.offsetWidth,
					behavior: "smooth",
				});
			}
		};
		if(isVisible){
			document.addEventListener("keydown", handleScroll);

			setTimeout(() => {
				const scrollBox = document.querySelector("#scroll-box") as HTMLImageElement;
				const currentImage  = document.querySelectorAll("#current-image")[selectedIndex] as HTMLImageElement;
				scrollBox.scrollLeft = scrollBox.scrollWidth
				if(scrollBox && currentImage){
					scrollBox.scrollTo({
						left: currentImage.offsetLeft  - (window.innerWidth / 2) + (currentImage.offsetWidth/2),
						behavior: "smooth",
					});
				}
			}, 100);
		}else{
			document.body.style.overflow = "normal";
			document.removeEventListener("keydown", handleScroll);
		}
	}, [isVisible]);

	useEffect(() => {
		document.body.style.overflow = isVisible ? "hidden" : "auto";
	}, [isVisible]);

	const [data] = useAtom(pageDataAtom);
	const [, selectInstance] = useAtom(selectedInfoAtom);

	return (
		<AnimatePresence>
			{isVisible && (
				<motion.div
					initial={{ opacity: 0.2, y: 0 }}
					animate={{ opacity: 1, y: 0, transition: { duration: 0.2 } }}
					exit={{ opacity: 0, transition: { duration: 0.3 } }}
					css={isVisible ? overlayCSS : null}
					className={"flex items-center"}
					onClick={setZoom.bind(this, false)}
					id="scroll-box"
				>
					<>
		
						{data.map((instance, index) => {
							const { screenshot_url,is_nsfw } = instance;
							const select = () => {
								selectInstance({ current: index });
							};
							return (
								<motion.img
									onClick={select}
									src={!!is_nsfw ? "/img/nsfw.jpg": getCdnFile(screenshot_url)}
									initial={{ opacity: 0, y: 400 }}
									animate={{ opacity: 1, y: 0, transition: { duration: 0.2 } }}
									exit={{ opacity: 0, y: 100, transition: { duration: 0.1 } }}
									css={centerImage}
									id="current-image"
								/>
							);
						})}
					</>
					<div
						className="flex"
						css={css`
							position: fixed;
							bottom: 20px;
						`}
					>
						<span className="mr-8">for navigating use </span>
						<div
							className="flex"
							css={css`
								gap: 8px;
							`}
						>
							<Arrow />
							<Arrow
								css={css`
									transform: rotate(180deg);
								`}
							/>
						</div>
					</div>
				</motion.div>
			)}
		</AnimatePresence>
	);
};

const centerImage = css`
	min-width: 775px;
	max-width: 775px;
	min-height: 465px;
	max-height: 465px;
	object-position: top;
	border-radius: 29px;
	object-fit: cover;
	border: 10px solid rgba(255, 255, 255, 0.1);

	:hover{
	    border: 10px solid rgb(255 255 255 / 50%) !important;
	}
`;
const overlayCSS = css`
	position: fixed;
	z-index: 20;
	top: 0;
	left: 0;
	width: 100vw;
	height: 100vh;
	background: rgba(1, 1, 1, 0.66);
	backdrop-filter: blur(20px);
	gap: 32px;
	padding: 0 80px;
	overflow-x: overlay;
`;
export const WEBSITE_INFO = (): JSX.Element => {
	const [zoom, setZoom] = useAtom(zoomAtom);
	const [data] = useAtom(pageDataAtom);
	const [instance, selectInstance] = useAtom(selectedInfoAtom);
	const { query } = useRouter();

	useEffect(() => {
		const handleScroll:any = (e:KeyboardEvent) => {
			e.stopPropagation()
			const { keyCode } = e;
			const zoom = document.querySelector("#scroll-box"); // Refers to the zoomed scroll box
			if(zoom) { return; };

			if (keyCode === 39) {
				selectInstance(({current})=>{
					if(current === data.length) return {current}
					return {current: ++current}
				})
			}
			if (keyCode === 37) {
					selectInstance(({current})=>{
						if(current <= 0) return {current}
						return {current: --current}
					})
			}
		};
		document.addEventListener("keydown", handleScroll);

		return ()=>{
			document.removeEventListener("keydown", handleScroll);
		}
	}, []);


	return (
		<div css={[CONTAINER_1234_24]}>
			<div
				className="flex justify-between pt-40 md:pt-24 md:flex-col md:mb-20"
				css={css`
					@media screen and (max-width: 680px) {
						gap: 20px;
					}
				`}
			>
				<div
					className=""
					css={css`
						color: #cbcbcb;
					`}
				>
					<h1 className="text-16 mt-0 mb-0 font-900 leading-none md:text-16 md:leading-1.7">{query.website} design history</h1>

					<div className="flex items-center text-13 font-400 mt-10 text-12 md:leading-1.7 md:mt-2">
						<div className="flex items-center md:hidden">
							<span className="mr-8">for navigating use </span>
							<div
								className="flex"
								css={css`
									gap: 8px;
								`}
							>
								<Arrow />
								<Arrow
									css={css`
										transform: rotate(180deg);
									`}
								/>
							</div>
						</div>

						<span className="ml-16">updated {data.length} times</span>
					</div>
				</div>
				<div
					className="flex items-center"
					css={css`
						gap: 20px;
						align-self: flex-start;
					`}
				>
					<div className="flex items-start cursor-pointer md:hidden leading-1" onClick={setZoom.bind(this, true)} css={zoomBox}>
						<ZoomIcon height={16} width={16} className="mr-6 mt-2" /> zoom
					</div>
					<Button>share</Button>
				</div>
			</div>

			<div
				className="mt-36 md:mt-32 flex md:flex-col-reverse md:pb-40"
				css={css`
					gap: 32px;
					overflow-x: auto;
				`}
			>
				{data.map((instanceInfo, index) => {
					return <SmallCard instanceInfo={instanceInfo} index={index} />;
				})}
			</div>
		</div>
	);
};

const zoomBox = css`
	color: #a0a0a0;
	line-height: 1.2;
	svg path {
		fill: #a0a0a0;
	}
	:hover {
		cursor: pointer;
		color: #fff;
		text-decoration: underline;
		svg path {
			fill: #fff;
		}
	}
`;

export const WEBSITE_FULL_VIEW = () => {
	const [showZoom, setZoom] = useAtom(zoomAtom);
	const [data] = useAtom(pageDataAtom);
	const [info] = useAtom(selectedInfoAtom);

	const selectedIndex = info.current;

	if (!data[selectedIndex]) {
		return null;
	}
	const { screenshot_url,is_nsfw } = data[selectedIndex];
	return (
		<div className="mt-64 md:hidden" css={[CONTAINER_1234_24,css`
			margin-top: 60px;
			margin-bottom: 100px;
			img{
				border-radius: 18px;
				border: 10px solid #ffffff4f;
			}
		`]}>
			<ZOOM_MODE selectedIndex={selectedIndex} isVisible={showZoom} setZoom={setZoom} />
			<motion.img src={!!is_nsfw ? "/img/nsfw.jpg" :getCdnFile(screenshot_url)} initial={{ opacity: 0.6 }} animate={{ opacity: 1, y: 0, transition: { duration: 0.4 } }} />
		</div>
	);
};

const imageCSS = css`
	min-width: 129px;
	height: 83px;
	background: url(Screenshot 2022-11-28 at 11.16.png);
	border: 1.5px solid #bbbbbb;
	border-radius: 10px;
	object-fit: cover;

	@media screen and (max-width: 680px) {
		width: 400px;
		height: 203px;
	}
`;

export default WEBSITE_INFO;
