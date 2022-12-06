import { css } from "@emotion/react"
import { CONTAINER_1234_24 } from "../../constants/style"

const builtBy = (<div>
    built by <a href="" css={css`color:#36C3FF;`}>1x_engineer</a> and <a href="" css={css`color:#36C3FF;`}>utkarsh_dix</a>
    </div>)

export const Footer = ()=>{
    return (
        <div>
            <div css={[CONTAINER_1234_24, css`margin-top: 100px !important; margin-bottom: 50px;`]} className="flex justify-between text-12 mt-50 md:flex-wrap pb-20">
                {builtBy}
               <div className="flex" css={css`gap: 20px;`}>
               <a href="https://docs.crusher.dev">
                    docs
                </a>
                <a href="https://   crusher.dev">
                    crusher
                </a>
                <a href="https://github.com/crusherdev/crusher">
                    github
                </a>
               </div>
            </div>
        </div>
    )
}

export const Label = ()=>{
    return (
        <div>
            <div css={[CONTAINER_1234_24, css`margin-top: 70px !important`]} className="flex items-center justify-center text-12 mt-50">
            {builtBy}
            </div>
        </div>
    )
}