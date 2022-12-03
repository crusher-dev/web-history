import axios, { formToJSON } from "axios";
import https from "https";
import playwright, { Browser, firefox } from "playwright";

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
}

export class Crawler {
  private async getWebArchiveRecords(
    website: string
  ): Promise<Array<IWebArchiveRecord>> {
    const records: string = await new Promise((resolve, reject) => {
      https
        .get(
          `https://web.archive.org/cdx/search/cdx?url=${website}&collapse=timestamp:6&showDupeCount=true&output=json`,
          (res) => {
            let data = "";
            res.on("data", (chunk) => {
              data += chunk;
            });
            res.on("end", () => {
              resolve(data);
            });
          }
        )
        .on("error", (err) => {
          reject(err);
        });
    });

    // console.log(cdx.data.toString());
    const recordsArr = JSON.parse(records);
    const recordsKeys = recordsArr[0];

    const recordsData = recordsArr.slice(1).map((record: string[]) => {
      const result = record.reduce((acc: any, curr, i) => {
        acc[recordsKeys[i]] = curr;
        return acc;
      }, {});

      result[
        "wa_url"
      ] = `https://web.archive.org/web/${result.timestamp}/${website}`;
      return result;
    });

    return recordsData.filter((record: IWebArchiveRecord) => {
      // record.original is website
      const orignalURL = new URL(record.original);
      return (
        orignalURL.hostname === new URL(website).hostname &&
        record.statuscode === "200"
      );
    });
  }

  async takePageScreenshot(
    record: IWebArchiveRecord,
    directory: string,
    browser: Browser
  ) {
    try {
      const page = await browser.newPage();
      // Load wa_url in iframe
      const pageRes = await page.goto(record.wa_url, { timeout: 60 * 1000 });
      // Make sure status is not greater than 404
      if (pageRes?.status()! > 400) {
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
      await page.screenshot({
        animations: "disabled",
        path: `./screenshots/${directory}/${record.timestamp}.png`,
        fullPage: true,
      });
    } catch (err) {
      console.log(err);
    }
  }

  async screenshotBinarySearch(left: number, right: number) {}

  async takeScreenshots(
    records: Array<IWebArchiveRecord>,
    directory: string,
    limit: number = 1,
    parallel = 2
  ) {
    const browser = await playwright.chromium.launch();

    const promises = records.reverse().slice(0, limit);

    for (let i = 0; i < promises.length; i += parallel) {
      await Promise.all(
        promises.slice(i, i + parallel).map(async (record) => {
          await this.takePageScreenshot(record, directory, browser);
        })
      );
    }

    // Trigger promises with interval of 1 second

    await Promise.all(promises);

    // K-means clustering of screenshots

    await browser.close();
  }

  async cluster(directory: string) {
    const kmeans = require("node-kmeans");
    const fs = require("fs");
    const path = require("path");
    const { promisify } = require("util");
    const readdir = promisify(fs.readdir);
    const readFile = promisify(fs.readFile);

    const files = await readdir(`./screenshots/${directory}`);
    const images = await Promise.all(
      files.map(async (file) => {
        const buffer = await readFile(`./screenshots/${directory}/${file}`);
        return buffer;
      })
    );

    const k = 5;
    await new Promise((resolve, reject) => {
      // Convert readFile images to float
      const data = images.map((image) => {
        return Array.from(image).map((pixel: any) => {
          return pixel / 255;
        });
      });
      // Add padding to create same size images
      const max = Math.max(...data.map((image) => image.length));
      const paddedData = data.map((image) => {
        const padding = new Array(max - image.length).fill(0);
        return image.concat(padding);
      });
      kmeans.clusterize(paddedData, { k: k }, (err: any, res: any) => {
        if (err) reject(err);
        else {
          // res.forEach((cluster: any, i: number) => {
          //     cluster.clusterInd.forEach((ind: number) => {
          //         // Create directory if not exists
          //         if(!fs.existsSync(`./screenshots/${directory}/cluster${i}/`))
          //             fs.mkdirSync(`./screenshots/${directory}/cluster${i}/`);
          //         fs.renameSync(`./screenshots/${directory}/${files[ind]}`,`./screenshots/${directory}/cluster${i}/${files[ind]}`);
          //     });
          // });
          resolve(res);
        }
      });
    }).catch((err) => console.log(err));
  }

  async start(website: string) {
    console.log(`Crawling ${website}...`);
    console.time("crawler");
    const webArchiveRecords = await this.getWebArchiveRecords(website);
    const directory = new URL(website).hostname;
    await this.takeScreenshots(
      webArchiveRecords,
      directory,
      webArchiveRecords.length
    );
    console.timeEnd("crawler");

    return webArchiveRecords;
  }
}
