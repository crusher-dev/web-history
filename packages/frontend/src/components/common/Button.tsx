import { css } from "@emotion/react";

export const Button = ({ children }) => {
	return (
		<div css={buttonCSS} className="flex no-select leading-none items-center pb-6 text-13">
			{children}
		</div>
	);
};

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
