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

export class WebArchive {
    constructor(private browser: Browser, private browserContext: BrowserContext, private website: string){}

    private parseWebArchiveCDXResponse(record: any): Array<IWebArchiveRecord> {
        const recordsKeys = record[0];
    
        const recordsData = record.slice(1).map((record: string[]) => {
            const result = record.reduce((acc: any, curr, i) => {
                acc[recordsKeys[i]] = curr;
                return acc;
            }, {});
            
            result["wa_url"] = `https://web.archive.org/web/${result.timestamp}/${result.original}`;
            return result;
        });


        return recordsData;
    }
    
    private filterWebArchiveRecords(records: Array<IWebArchiveRecord>, urlToMatch: string | null = null, type: "digest" | "timestamp" = "digest") {
        if(type === "digest") {
            if(!urlToMatch) throw new Error("urlToMatch is required for digest filtering");
            const uniqueMap: any = {};

            return records.filter((record: IWebArchiveRecord) => {
                if(uniqueMap[record.digest]) return false;
                uniqueMap[record.digest] = true;
                return true;
            });
        } else {
            return records.filter((record: IWebArchiveRecord, i: number) => {
                if(i === 0) return true;
                const prev = new Date(parseInt(records[i - 1].timestamp));
                const curr = new Date(parseInt(record.timestamp));
                const diff = Math.abs(prev.getTime() - curr.getTime());
                const diffDays = Math.ceil(diff / (1000 * 3600 * 24));
                return diffDays >= 90;
            });
        }
    }


    async getWebArchiveRecords(website: string = this.website,  exactUrl: boolean = false, from: string | null = null, to: string | null = null, depth = 0) {
        const websiteUrl =  exactUrl ? website : new URL(website).hostname;

        const webArchiveCdxRes = JSON.parse(await httpsRequest(
            `https://web.archive.org/cdx/search/cdx?url=${websiteUrl}&collapse=timestamp:6&showDupeCount=true&output=json${from ? `&from=${from}` : ""}${to ? `&to=${to}` : ""}${depth ? `&depth=${depth}` : ""}`,
        ));

        const recordsArr = this.parseWebArchiveCDXResponse(webArchiveCdxRes);
        const digestFilteredRecords = this.filterWebArchiveRecords(recordsArr, website, "digest");
        const timestampFilteredRecords = this.filterWebArchiveRecords(digestFilteredRecords, website, "timestamp");
        
        let out = timestampFilteredRecords;
        if(!depth) {
            out = await this.resolveRedirectRecords(timestampFilteredRecords);
        }
        console.log("Total records is", out.length);
    
        return out;
    }


    async resolveRedirectRecords(records: Array<IWebArchiveRecord>): Promise<Array<IWebArchiveRecord>> {
        const redirectRecords = records.filter((record) => record.statuscode === "302");
        const nonRedirectRecords = records.filter((record) => record.statuscode !== "302");
        
        let redirectSpecificRecords: Array<IWebArchiveRecord> = [];
        for(let i = 0; i < redirectRecords.length; i++) {
            const redirectRecord = redirectRecords[i];
            const nextRecord = redirectRecords[i + 1];
            const page = await this.browserContext.newPage();
            let pageRes =await page.goto(redirectRecord.wa_url, {timeout: 90 * 1000}).catch((err) => (null));
            const isWebArchiveRedirectPage = await page.$("text=Redirecting to..");

            if (isWebArchiveRedirectPage) {
                const aHref = await page.$(".impatient a").then((el) => el?.getAttribute("href")).catch((err) => null);
                if(aHref) {
                    const regex = /https?:\/\/web.archive.org\/web\/(\d+)\/(.*)/gm;
                    const match = regex.exec(aHref!);
                    if(match) {
                        const timestamp = match[1];
                        const url = match[2];
                        
                        redirectSpecificRecords.push(...await this.getWebArchiveRecords(url, true, timestamp, nextRecord?.timestamp, 1));
                    }
                }
            }

            await page.close();
        }

        const out = [...nonRedirectRecords, ...redirectSpecificRecords];

        const sortedRecords = out.sort((a, b) => {
            // date is in YYYYDDMM format
            const aDate = new Date(parseInt(a.timestamp.slice(0, 4)), parseInt(a.timestamp.slice(4, 6)), parseInt(a.timestamp.slice(6, 8)));
            const bDate = new Date(parseInt(b.timestamp.slice(0, 4)), parseInt(b.timestamp.slice(4, 6)), parseInt(b.timestamp.slice(6, 8)));
            return aDate.getTime() - bDate.getTime();
        });
        const timestampFilteredRecords = this.filterWebArchiveRecords(sortedRecords, null, "timestamp");

        return timestampFilteredRecords;
    }
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