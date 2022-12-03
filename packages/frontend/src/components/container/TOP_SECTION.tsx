import { css } from "@emotion/react";

import React, { ReactElement } from "react";
import { CONTAINER_1234_24 } from "../../constants/style";

const BLUR_LAYER = ()=>{
    
    return (         
    <div className="absolute" css={layerCSS}>
        <div className="">

        </div>
    </div>
    )
}

const layerCSS = css`
    position: absolute;
    width: 100%;
    height: 193px;
    
    background: url("/img/stripe.png");
    background: linear-gradient(0deg, rgba(0, 0, 0, 0.60), rgba(0, 0, 0, 0.60)), url("/img/stripe.png");
    
    filter: blur(12.5px);
    z-index: -1;
>div{
    position: absolute;
    z-index: 1;
    height: 193px;
    width: 100%;

    background: linear-gradient(180deg, rgba(6, 9, 12, 0.6) 0%, #0A0C0E 100%);
}
`

const TOP_SECTION = ():JSX.Element => {
	return (
        <div className={"relative"}>
               <BLUR_LAYER/>
                <div css={[CONTAINER_1234_24]}>
                    <div id="menu" className="realtive flex items-center justify-between pt-24 relative">
                        <div className="font-source font-800 text-14" css={css` color: #CBCBCB;`}>
                            website history
                        </div>

                        <div className="relative" css={inputContainer}>
                            <input placeholder="search website" css={inputCSS} className="text-12"/>
                        </div>

                        <div className="flex items-center" css={css`gap: 24px; color: #CBCBCB; letter-spacing: -0.04em;`}>
                            <a className="text-13">examples</a>
                            <a className="text-13">how it works</a>
                            <div css={buttonCSS} className="flex no-select leading-none items-center pb-6 text-13">
                            track my website
                            </div>
                        </div>
                    </div>
                </div>
           </div>
		
	);
};

const inputContainer = css`
    position: absolute !important;
    left: 50%;
    // -40px to offset CSS
    transform: translateX(calc(-50% - 40px));
`
const inputCSS = css`

    background: rgba(255, 255, 255, 0.02);
    border-radius: 8px;
    border: .5px solid rgba(106, 106, 106, 0.2);
    padding: 5px 12px;
    min-height: 34px;
    cursor: pointer;
    width: 283px;


    :focus{
        border-color: rgba(71, 71, 71);
    }
    
`

const buttonCSS = css`
    background: rgba(255, 255, 255, 0.04);
    border-radius: 6px;
    border: .5px solid rgba(106, 106, 106, 0.3);
    padding: 0 10px;
    padding-bottom: 1px;
    min-height: 26px;
    cursor: pointer;
    :hover{
        background: rgba(255, 255, 255, 0.09);
    }
`

export default TOP_SECTION;
