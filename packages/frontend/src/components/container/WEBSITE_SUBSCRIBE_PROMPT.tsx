import { css } from "@emotion/react";
import React from "react";

import { CONTAINER_1234_24 } from "../../constants/style";
import { Logo } from "../../constants/svg";
import { Button } from "../common/Button";

const SUBSCRIVE_CARD = ()=>{

	const label = (
		<React.Fragment>
			fast{" "}
			<span
				css={css`
					color: #36C3FF;
				`}
			>
				all-in-one testing
			</span>
			, with low-code
		</React.Fragment>
	);

	return (
		<div css={cardCSS} className={" m-auto pb-36 md:mt-70"}>
			<div className="py-32 px-32 md:px-28 md:py-24">
				<div className="text-16 font-800 mb-10">We’re tracking this website</div>
				<div className="mb-24 text-12" css={css`color: #CBCBCB;`}>queue #210</div>
				<div className="flex mb-24" css={css`gap: 12px;`}>
					<input css={inputCSS} placeholder="email"/> <Button type={"large"}>subscribe</Button>

				</div>
				<div className="text-11 leading-2 mb-52" css={css`color: #CBCBCB;`}>we’ll send you an email when we have tracked this page+ other updates</div>
			</div>


			<div className="flex flex-col justify-center items-center py-36" css={css`
				border-top: 1px dashed #1B1B1B;
				border-bottom: 1px dashed #1B1B1B;
				background: rgba(0, 0, 0, 0.11);
			`}>
				<div css={css`color: #565656;`}>
					<a href="https://crusher.dev" className="flex text-12 items-center" >
					built by <Logo alt="Crusher logo" className="ml-12" />
					</a>
				</div>
				<div className="mb-28 mt-12 md:text-12 text-12">
					{label}
				</div>
				<div className="flex mb-24" css={css`gap: 12px;`}>
					<Button type={"large"}>Star crusher</Button>
					<Button type={"large"}>Join discord</Button>
				</div>
			</div>
		</div>
	)
}

const inputCSS = css`
	background: rgba(255, 255, 255, 0.02);
	border-radius: 8px;
	border: 0.5px solid rgba(106, 106, 106, 0.2);
	padding: 5px 12px;
	min-height: 34px;
	cursor: pointer;
	width: 223px;

	:focus {
		border-color: rgba(71, 71, 71);
	}

	@media screen and (max-width: 880px) {
		width: 100%;
		min-height: 38px;
	}
`;


const cardCSS = css`
background: rgba(0, 0, 0, 0.11);
border: 1px solid #1B1B1B;
backdrop-filter: blur(8.5px);
/* Note: backdrop-filter has minimal browser support */
width: 472px;
border-radius: 19px;
max-width: 100%
`

export const WEBSITE_SUBSCRIBE_PROMPT = (): JSX.Element => {

	return (
		<div css={[CONTAINER_1234_24]}>
			<SUBSCRIVE_CARD/>
		</div>
	);
};



