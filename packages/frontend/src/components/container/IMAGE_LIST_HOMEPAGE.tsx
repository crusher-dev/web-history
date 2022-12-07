import { css } from "@emotion/react";

import React from "react";
import { CONTAINER_1234_24 } from "../../constants/style";

import { motion } from "framer-motion";
import { useAtom } from "jotai";
import { indexDataAtom } from "../../../pages";
import { getCdnFile } from "../../utils";


const SITES_SECTION = () => {
	const [data] = useAtom(indexDataAtom);
	return (
		<div css={[CONTAINER_1234_24,css`padding-bottom: 100px;`]}>
			<div className="pt-40 md:pt-24" css={css`color: #CBCBCB;`}>
				<h1 className="text-16 mt-0 mb-0 font-900 leading-none md:text-16 md:leading-1.7">go in past to see the evolution</h1> 
				<div className="text-13 font-400 mt-8 text-12 md:leading-1.7 md:mt-4" >You have to look at history as an evolution of society</div>
				<div className="mt-12 text-12">see list by: alphabet/type</div>
			</div>
			{Object.entries(data).map(([key,list])=>{
				return <ImageCarousel className={"mt-80 md:mt-40 mb-80"} name={key} list={list}/>
			})}
		</div>
	
	);
};


const SiteCard = ({item}: any)=>{	
	return (
		<a href={`/${item.url}`}>
			<motion.div  css={cardCSS}  whileHover={{
			scale: 1.01,
			transition: { duration: .15},
		  }}>
						<img src={getCdnFile(item.thumbnail_url)} css={css`object-fit: cover`}/>
						<div className="flex justify-between mt-16">
						<span className="font-700 card-label">
							{item.url}>
						</span>
						<span>
						oct 2020
						</span>
						</div>
					</motion.div>
		</a>
	)
}

const ImageCarousel = ({className,name,list}:any)=>{
	return (
		<div css={carouselCSS} className={className}>
				<h1 className=" text-14 font-600 leading-none mb-28">{name} website</h1>
				<div className="flex flex-wrap justify-between md:justify-start" css={css`gap: 20px; @media screen and (max-width: 680px){
					gap: 40px;
				}`}>
					{list.map((item)=>{
						return 	<SiteCard item={item}/>
					})}
				</div>

		</div>
	)
}

const cardCSS = css`
img{
	width: 234.17px;
	height: 160.74px;
	border: 1px solid #202020;
	border-radius: 17px;
	object-fit: cover;
	filter: opacity(0.8);

	@media screen and (max-width: 680px){
		height: auto;
		width: 100%;
		aspect-ratio: 16/11;

	}
}
cursor: pointer;
:hover{
	img{
		//transform: translateY(-3px);
		transform: rotate(-0.5deg);
		filter: opacity(.9);
	}
	.card-label{
		color: #5081FF;
	}
}
`

const carouselCSS = css`color: #CBCBCB;`

export default SITES_SECTION;
