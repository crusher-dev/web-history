
import axios from "axios";
import https from "https";
import playwright from "playwright";

// promisify
import { promisify } from "util";

interface IWebArchiveRecord {
    urlkey: string;
    timestamp: string;
    original: string;
    mimetype: string;
    statuscode: string;
    digest: string;
    length: string;
    dupeCount: number;
    wa_url: string;
};

export class Crawler {
    private async getWebArchiveRecords(website: string): Promise<Array<IWebArchiveRecord>> {
        const records: string = await new Promise((resolve, reject) => {
            https.get(`https://web.archive.org/cdx/search/cdx?url=${website}&collapse=timestamp:6&showDupeCount=true&output=json`, (res) => {
                let data = '';
                res.on('data', (chunk) => {
                    data += chunk;
                });
                res.on('end', () => {
                    resolve(data);
                });
            }).on("error", (err) => {
                reject(err);
            });
        })

        // console.log(cdx.data.toString());
        const recordsArr = JSON.parse(records);
        const recordsKeys = recordsArr[0];

        const recordsData = recordsArr.slice(1).map((record: string[]) => {
            const result = record.reduce((acc: any, curr, i) => {
                acc[recordsKeys[i]] = curr;
                return acc;
            }, {});
            
            result["wa_url"] = `https://web.archive.org/web/${result.timestamp}/${website}`;
            return result;
        });

        return recordsData.filter((record: IWebArchiveRecord) => {
            // record.original is website
            const orignalURL = new URL(record.original);
            return orignalURL.hostname === new URL(website).hostname && record.statuscode === "200";
        });
    }

    async takeScreenshots(records: Array<IWebArchiveRecord>, directory: string, limit: number = 1) {
        const browser = await playwright.chromium.launch();

       const promises = records.reverse().slice(0, limit).map(async (record) => {
        try {
            const page = await browser.newPage();
            // Load wa_url in iframe
            await page.goto(record.wa_url);
            // Remove web.archive.org banner
            await page.evaluate(() => {
                const banner = document.querySelector("#wm-ipp-base");
                if (banner) {
                    banner.remove();
                }
            });

            console.log(`Taking screenshot of ${record.wa_url}...`);
            
            // Take full page screenshot
            await page.screenshot({ animations: "disabled", path: `./screenshots/${directory}/${record.timestamp}.png`, fullPage: true });

        } catch (err) { console.log(err);}
        });

        await Promise.all(promises);

        await browser.close();
    }

    async start(website: string) {
        console.log(`Crawling ${website}...`);
        console.time("crawler");
        const webArchiveRecords = await this.getWebArchiveRecords(website);
        const directory = new URL(website).hostname;
        await this.takeScreenshots(webArchiveRecords, directory, 1);
        console.timeEnd("crawler");

        return webArchiveRecords;
    }
}