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
			<div className="pt-40" css={css`color: #CBCBCB;`}>
				<h1 className="text-18 font-900 leading-none">go back in past to see the evolution</h1>
				<div className="text-13.5 font-400 mt-16" >You have to look at history as an evolution of society</div>
			</div>

			<ImageCarousel/>

		</div>
	
	);
};


const ImageCarousel = ()=>{
	return (
		<div css={carouselCSS}>
				<h1 className="mt-48 text-14 font-600 leading-none mb-28">top website</h1>
				<div className="flex">
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
}
:hover{
img{
	//transform: translateY(-3px);
	transform: rotate(-2deg);
}
.card-label{
	color: #5081FF;
}
}
`

const carouselCSS = css`color: #CBCBCB;`

export default IMAGE_LIST_HOMEPAGE;
