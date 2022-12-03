import { css } from "@emotion/react";

import React from "react";
import { CONTAINER_1234_24 } from "../../constants/style";

import { motion } from "framer-motion";

export const SmallCard= ()=>{
	return (
		<motion.div 
		style={{
			opacity: .7,
		}}
		whileHover={{
			y: -3,
			opacity: 1,
			transition: { duration: .1 },
		}}>
			<img src="img/stripe.png" css={imageCSS}/>
			<div className="mt-20">
			oct 2020
			</div>

		</motion.div>
	)
}

export const WEBSITE_INFO = (): JSX.Element => {
	return (
			<div
				css={[
					CONTAINER_1234_24,
					// css`background: black; padding-bottom: 20px;`
				]}
			>
			<div>
				<div className="pt-40 md:pt-24" css={css`color: #CBCBCB;`}>
					<h1 className="text-16 mt-0 mb-0 font-900 leading-none md:text-16 md:leading-1.7">stripe.com</h1> 
					<div className="text-13 font-400 mt-8 text-12 md:leading-1.7 md:mt-4" >for navigating use  updated 12 times</div>
				</div>
			</div>
			
			<div className="mt-36 flex" css={css`gap: 48px;`} >
				<SmallCard/><SmallCard/>
			</div>
				

			</div>
	);
};

export const WEBSITE_FULL_VIEW = ()=>{
	return (
		<div className="mt-64">
			<img src="img/stripe.png"/>

		</div>
	);
}

const imageCSS = css`
width: 129px;
height: 83px;

background: url(Screenshot 2022-11-28 at 11.16.png);
border: 1.5px solid #BBBBBB;
border-radius: 10px;
`;


export default WEBSITE_INFO;
