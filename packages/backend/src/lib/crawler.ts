
import axios, { formToJSON } from "axios";
import https from "https";
import playwright, { Browser, firefox } from "playwright";
import fs from "fs";
import pixelmatch from "pixelmatch";

// promisify
import { promisify } from "util";
import { clusteriseImages, getDiffPercentage, httpsRequest, processImages } from "../utils";
import { getWebArchiveRecords, getWebArchiveScreenshot, IWebArchiveRecord } from "./webArchive";

export class Crawler {
    browser: Browser | null = null;
    webArchiveRecords: Array<IWebArchiveRecord> = [];
    cache: any = {};
    currentIndex: number = 0;

    constructor(private website: string){

    }

    async isNewScreenshot(leftScreenshot: Buffer, rightScreenshot: Buffer) {
        if(!rightScreenshot) return { value: 100 };
        const diffPercentage = await getDiffPercentage(leftScreenshot, rightScreenshot);

        console.log("Diff percentage", diffPercentage);
        return { value: diffPercentage > 25 };
    }

    async getUniqueWebArchiveRecords(left: number, right: number, records: Array<IWebArchiveRecord>, outputs: any = {}, _previousOutput: Buffer | null = null) {
        if(left >= right) {
            return outputs;
        }

        const mid = Math.floor((left + right) / 2);
        const [leftScreenshot, rightScreenshot] = await Promise.all([getWebArchiveScreenshot(records[left], this.browser!),  getWebArchiveScreenshot(records[right], this.browser!)]);

        const isDiff = await this.isNewScreenshot(leftScreenshot!, rightScreenshot!);
        if(isDiff.value) {
            if(!outputs[left]) {
                outputs[left] = leftScreenshot;
                await this.saveScreenshot(leftScreenshot!, left);
            }
            if(!outputs[right]) {
                outputs[right] = rightScreenshot;
                await this.saveScreenshot(rightScreenshot!, right);
            }

            await this.getUniqueWebArchiveRecords(left, mid, records, outputs, leftScreenshot);
            await this.getUniqueWebArchiveRecords(mid + 1, right, records, outputs, rightScreenshot);
        }

    }

    async saveScreenshot(screenshot: Buffer, i: number) {
        const webSiteUrl = new URL(this.website);
        const directory = webSiteUrl.hostname;
        console.log("Directory is", directory);
        if(!fs.existsSync(`./out/${directory}`)) {
            fs.mkdirSync(`./out/${directory}`);
        }
        // not thread-safe
        const filename = `./out/${directory}/${this.webArchiveRecords[i].timestamp}.png`;
        await promisify(fs.writeFile)(filename, screenshot);
    }

    async takeScreenshots(records: Array<IWebArchiveRecord>, directory: string, limit: number = 1, parallel = 2) {
       const promises = records.slice(0, limit);

        let outputs: any = {};
        await this.getUniqueWebArchiveRecords(1, promises.length - 1, promises, outputs);
        // K-means clustering of screenshots
    }

    async start(website: string) {
        this.browser = await playwright.chromium.launch({headless: false});
        this.webArchiveRecords = await getWebArchiveRecords(website);
        const directory = new URL(website).hostname;
        await this.takeScreenshots(this.webArchiveRecords, directory, this.webArchiveRecords.length);
        await this.browser.close();

        return this.webArchiveRecords;
    }
}