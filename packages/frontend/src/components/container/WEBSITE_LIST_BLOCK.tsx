import { css } from "@emotion/react";


import { CONTAINER_1234_24 } from "../../constants/style";
import { useRouter } from "next/router";
import { useAtom } from "jotai";
import { listDataAtom } from "../../../pages/list/[character]";



export const WEBSITE_LIST_BLOCK = (): JSX.Element => {
	const { query } = useRouter();
	const [sites] = useAtom(listDataAtom)

	const alphabets = Array(26)
    .fill(97)
    .map((x, y) => String.fromCharCode(x + y));

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
					<h1 className="text-16 mt-0 mb-0 font-900 leading-none md:text-16 md:leading-1.7">{query.website} sites with character a</h1>

				</div>
			</div>

			<div className="flex text-13 mt-12" css={css`gap: 20px; `}>
				<span>Sites starting with by:-</span>
				{alphabets.map((alphabet)=>{
					const isSelected = query?.character === alphabet
					return <a href={`${alphabet}`}>
						<span css={[
						css`:hover{color:#41bbff; text-decoration: underline;} cursor:pointer; `, isSelected && css`color:#41bbff;`
					]}>{alphabet}</span>
					</a>
				})}
			</div>
			<div
				className="mt-60 md:mt-32 flex md:pb-40"
				css={css`
					gap: 80px;
					overflow-x: scroll;
				`}
			>
				{sites.map(({url})=>{
					return (

					<a href={`../${url}`}>
						<div>{url}</div>
					</a>

					)
				})}
			</div>
		</div>
	);
};



