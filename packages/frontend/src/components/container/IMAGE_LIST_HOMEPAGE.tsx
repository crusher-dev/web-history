import { css } from "@emotion/react";

import React from "react";
import { CONTAINER_1234_24 } from "../../constants/style";


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



const IMAGE_LIST_HOMEPAGE = () => {
	return (
		
		<div css={CONTAINER_1234_24}>
			<div className="pt-40 md:pt-24" css={css`color: #CBCBCB;`}>
			
				<h1 className="text-16 mt-0 mb-0 font-900 leading-none md:text-16 md:leading-1.7">go in past to see the evolution</h1> 
				<div className="text-13 font-400 mt-8 text-12 md:leading-1.7 md:mt-4" >You have to look at history as an evolution of society</div>
				<div className="mt-12 text-11">see list by: alphabet/type</div>
			</div>

			<ImageCarousel className={"mt-80 md:mt-40 mb-80"}/>
			<ImageCarousel className={"mt-48 md:mt-32"}/>
		</div>
	
	);
};


const Card = ()=>{
	return (
		<div  css={cardCSS}>
						<img src="/img/stripe.png"/>
						<div className="flex justify-between mt-16">
						<span className="font-700 card-label">
							stripe.com >
						</span>
						<span>
						oct 2020
						</span>
						</div>
					</div>
	)
}
const ImageCarousel = ({className})=>{
	return (
		<div css={carouselCSS} className={className}>
				<h1 className=" text-14 font-600 leading-none mb-28">top website</h1>
				<div className="flex flex-wrap justify-between md:justify-start" css={css`gap: 20px; @media screen and (max-width: 680px){
					gap: 40px;
				}`}>
					{["","","",""].map(()=>{
						return 	<Card/>
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

export default IMAGE_LIST_HOMEPAGE;
