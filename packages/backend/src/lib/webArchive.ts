import { Browser, BrowserContext } from "playwright";
import { httpsRequest } from "../utils";

export interface IWebArchiveRecord {
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

async function getWebArchiveRecords(website: string): Promise<Array<IWebArchiveRecord>> {
    const websiteUrl = new URL(website);
    const recordsArr = JSON.parse(await httpsRequest(
        `https://web.archive.org/cdx/search/cdx?url=${websiteUrl.hostname}&collapse=timestamp:6&showDupeCount=true&output=json`
    ));

    const recordsKeys = recordsArr[0];

    const recordsData = recordsArr.slice(1).map((record: string[]) => {
        const result = record.reduce((acc: any, curr, i) => {
            acc[recordsKeys[i]] = curr;
            return acc;
        }, {});
        
        result["wa_url"] = `https://web.archive.org/web/${result.timestamp}/${website}`;
        return result;
    });
    const uniqueMap: any = {};

    const out = recordsData.filter((record: IWebArchiveRecord) => {
        // record.original is website

        if(uniqueMap[record.digest]) return false;
        const orignalURL = new URL(record.original);
        const value = orignalURL.hostname === new URL(website).hostname;
        if(value) {
            uniqueMap[record.digest] = true;
        }
        return value;
    });

    // Filter for timestamps to be 3 months apart
    const filtered = out.filter((record: IWebArchiveRecord, i: number) => {
        if(i === 0) return true;
        const prev = new Date(parseInt(out[i - 1].timestamp));
        const curr = new Date(parseInt(record.timestamp));
        const diff = Math.abs(prev.getTime() - curr.getTime());
        const diffDays = Math.ceil(diff / (1000 * 3600 * 24));
        return diffDays >= 90;
    });

    console.log("Total records is", filtered.length);

    return filtered;
}

const cache: any = {};

async function getWebArchiveScreenshot(record: IWebArchiveRecord, browser: Browser, browserContext: BrowserContext): Promise<{fullPageScreenshot: Buffer; viewPortScreenshot: Buffer;} | null> {
    console.time(`${record.timestamp}_screenshot`);
    let out = null;
    try {
        if(cache[record.timestamp]) {         console.timeEnd(`${record.timestamp}_screenshot`);
        return cache[record.timestamp]; }

        const page = await browserContext.newPage();
        // Load wa_url in iframe
        let pageRes =await page.goto(record.wa_url, {timeout: 90 * 1000}).catch((err) => (null));

        const isWebArchiveRedirectPage = await page.$("text=Redirecting to..");
        if (isWebArchiveRedirectPage) {
            // Wait for 302 redirect
            pageRes = await page.waitForNavigation({timeout: 95 * 1000 }).catch((err) => null);
        }
        // Make sure status is not greater than 404
        if(pageRes && pageRes?.status()! > 400) {
            console.log(`Page ${record.wa_url} not found`);
            return;
        }
        // Remove web.archive.org banner
        await page.evaluate(() => {
            const banner = document.querySelector("#wm-ipp-base");
            if (banner) {
                banner.remove();
            }
        });

        console.log(`Taking screenshot of ${record.wa_url}...`);
        
        // Take full page screenshot
        const res = await page.screenshot({ animations: "disabled", clip: { x:0, y:0, width: 1920, height: 1080 } });
        const fullPageScreenshot  = await page.screenshot({ animations: "disabled", fullPage: true });
        cache[record.timestamp] = {fullPageScreenshot, viewPortScreenshot: res};
        console.timeEnd(`${record.timestamp}_screenshot`);
        out = {fullPageScreenshot, viewPortScreenshot: res};
        await page.close();
    } catch(err) {
        console.log(err);
        console.timeEnd(`${record.timestamp}_screenshot`);
        console.log("err");
    };

    return out;
}

export { getWebArchiveRecords, getWebArchiveScreenshot };