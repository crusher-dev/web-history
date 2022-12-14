
import axios, { formToJSON } from "axios";
import https from "https";
import playwright, { Browser, BrowserContext, firefox } from "playwright";
import fs from "fs";
import pixelmatch from "pixelmatch";

// promisify
import { promisify } from "util";
import { clusteriseImages, compressPng, getDiffPercentage, httpsRequest, processImages, resizeImageToThumbnail } from "../utils";
import { getWebArchiveRecords, getWebArchiveScreenshot, IWebArchiveRecord, WebArchive } from "./webArchive";
import { Storage } from "./storage";
import { WebHistoryDB } from "./db";

export class Crawler {
    browser: Browser | null = null;
    browserContext: BrowserContext | null = null;
    webArchiveRecords: Array<IWebArchiveRecord> = [];
    cache: any = {};
    webArchive: WebArchive | null = null;
    currentIndex: number = 0;

    _cacheMap: any = {};
    _screenshotCache: any = {};

    constructor(private website: string){}

    async isNewScreenshot(leftScreenshot: Buffer, rightScreenshot: Buffer) {
        if(!rightScreenshot) return { value: 100 };
        const diffPercentage = await getDiffPercentage(leftScreenshot, rightScreenshot);
        console.log("Diff percentage is", diffPercentage);
        return { value: diffPercentage > 15 };
    }

    async getUniqueWebArchiveRecords(left: number, right: number, records: Array<IWebArchiveRecord>, outputs: any = {}) {
        if(this._cacheMap[left + "_" + right]) {
            return;
        }
        this._cacheMap[left + "_" + right] = true;
        
        if(left >= right) {
            return outputs;
        }

        console.log("Left", left, "Right", right);

        const mid = Math.floor((left + right) / 2);
        
        const [leftScreenshot, rightScreenshot] = await Promise.all([getWebArchiveScreenshot(records[left], this.browser!, this.browserContext!, this._screenshotCache),  getWebArchiveScreenshot(records[right], this.browser!, this.browserContext!, this._screenshotCache)]);

        const isDiff = await this.isNewScreenshot(leftScreenshot?.viewPortScreenshot!, rightScreenshot?.viewPortScreenshot!);
        if(isDiff.value) {
            if(!outputs[left]) {
                outputs[left] = leftScreenshot;
                await this.saveScreenshot(leftScreenshot?.fullPageScreenshot!, leftScreenshot?.viewPortScreenshot!, left);
            }
            if(!outputs[right]) {
                outputs[right] = rightScreenshot;
                await this.saveScreenshot(rightScreenshot?.fullPageScreenshot!, rightScreenshot?.viewPortScreenshot!, right);
            }

                await this.getUniqueWebArchiveRecords(left, mid, records, outputs);
            await this.getUniqueWebArchiveRecords(mid, right, records, outputs);
            // await this.getUniqueWebArchiveRecords(left, mid, records, outputs);
            // await this.getUniqueWebArchiveRecords(mid, right, records, outputs);
        } else {
            // Save the starting screenshots
            if(!Object.keys(outputs).length) {
                outputs[left] = leftScreenshot;
                await this.saveScreenshot(leftScreenshot?.fullPageScreenshot!, leftScreenshot?.viewPortScreenshot!, left);
                outputs[right] = rightScreenshot;
                await this.saveScreenshot(rightScreenshot?.fullPageScreenshot!, rightScreenshot?.viewPortScreenshot!, right);
            }
        }

    }

    async saveScreenshot(screenshot: Buffer, viewportScreenshot: Buffer, i: number) {
        const webSiteUrl = new URL(this.website);
        const directory = webSiteUrl.hostname;
        const finalScreenshot = await compressPng(screenshot);
        const filename = `${directory}/${this.webArchiveRecords[i].timestamp}.${finalScreenshot.type}`;
        await Storage.upload(finalScreenshot.buffer, filename);

        const thumbnail = await resizeImageToThumbnail(viewportScreenshot);
        const finalThumbnail = await compressPng(thumbnail);
        const thumbnailUrl = `${directory}/${this.webArchiveRecords[i].timestamp}-thumbnail.${finalThumbnail.type}`;
        await Storage.upload(finalThumbnail.buffer, thumbnailUrl);

        // Get date from yyyyMMdd
        const date = new Date(parseInt(this.webArchiveRecords[i].timestamp.slice(0, 4)), parseInt(this.webArchiveRecords[i].timestamp.slice(4, 6)), parseInt(this.webArchiveRecords[i].timestamp.slice(6, 8)));

        const siteRecord = await WebHistoryDB.getSiteRecord(webSiteUrl.hostname);
        const siteId = siteRecord?.data?.[0]?.id;
 
        const out = await WebHistoryDB.insertSnapshotRecord({
            site_id: siteId,
            timestamp: date as any,
            screenshot_url: filename,
            wa_url:  `https://web.archive.org/web/${this.webArchiveRecords[i].timestamp}/${this.website}`,
            thumbnail_url: thumbnailUrl,
        });
    }

    async takeScreenshots(records: Array<IWebArchiveRecord>, directory: string, limit: number = 1, parallel = 2) {
       const promises = records.slice(0, limit);

        let outputs: any = {};
        await this.getUniqueWebArchiveRecords(1, promises.length - 1, promises, outputs);
    }

    async start() {
        this.browser = await playwright.chromium.launch({headless: true});
        this.browserContext = await this.browser.newContext({
            viewport: {
                width: 1920,
                height: 1080
            },
            screen: {
                width: 1920,
                height: 1080
            }
        });
        this.webArchive = new WebArchive(this.browser, this.browserContext, this.website);
        // Open new page so that browser context is never really destroyed
        await this.browserContext.newPage();
        this.webArchiveRecords = await this.webArchive.getWebArchiveRecords(
            this.website,
        );
        // fs.writeFileSync("records.json", JSON.stringify(this.webArchiveRecords, null, 2));
        const directory = new URL(this.website).hostname;
        await this.takeScreenshots(this.webArchiveRecords, directory, this.webArchiveRecords.length);
        await this.browserContext.close();
        await this.browser.close();

        return this.webArchiveRecords;
    }
}