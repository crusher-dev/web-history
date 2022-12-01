import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import { css } from '@emotion/react'
import { useState } from "react";

export default function Home() {
  const [showWebsiteHistory, setShowWebsiteHistory] = useState(true);

  const handleKeyDown = (event) => {
    if(event.keyCode === 13) {
        setShowWebsiteHistory(true);
    }
  };
  
  return (
    <div className={styles.container}>
      <Head>
        <title>Web History</title>
        <meta name="description" content="See how products evolved over time" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div css={containerCss}>
        <h2 className={styles.title}>
          Web History <a href="https://nextjs.org">v0.1</a>
        </h2>
        {
            showWebsiteHistory ? (
                <div css={css`margin-top: 4rem; width: 100%; `}>
                    <div css={sliderCss}>
                      <img src="/scr.png" alt="Screenshot of the website" css={css`width: 100%; padding: 1rem 1rem; border-radius: 1.5rem;`}/>
                      {/* <iframe src="https://web.archive.org/web/20020124144701/http://www.google.com/" css={css`width: 100%; height: calc(100vh - 2rem); border:none; border-radius: 0.5rem;`}/> */}
                    </div>
                </div>
            ): (
                <div css={css`margin-top: 2rem; padding-left: 2rem;`}>
                    <input onKeyDown={handleKeyDown} type="text" css={inputCss} placeholder="Enter a URL" />
                    <span css={css`margin-left: 1rem;`}>
                        <button onClick={() => setShowWebsiteHistory(true)} css={buttonCss}>Time Travel</button>
                    </span>
                </div>
            )
        }
      </div>
    </div>
  )
}

const sliderCss = css`
    width: 100%;
    flex: 1;
`;
const containerCss = css`
    min-height: 100vh;
    padding: 4rem 0;
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 100%;
    padding-bottom: 0rem;
`;

const inputCss = css`
    border-radius: 5px;
    border: 1px solid black;
    padding: 10px;
    font-size: 16px;
    width: 320px;
`;

const buttonCss = css`
    border-radius: 5px;
    border: 1px solid black;
    padding: 10px 20px;
    font-size: 16px;
    background: #eee;
    color: black;

    &:hover {
        background: #ddd;
    }
`;