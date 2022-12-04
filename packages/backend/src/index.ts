import express from "express";
import { Crawler } from "./lib/crawler";

import fs from "fs";
import { getWebArchiveRecords } from "./lib/webArchive";
import { Queue } from "bullmq";
import Redis from "ioredis";
import { ISnapshotRecord, WebHistoryDB } from "./lib/db";
import { Storage } from "./lib/storage";
import { REDIS_CONFIG } from "./config";
const app = express()

const redisClient = new Redis({
    port: REDIS_CONFIG.port,
    host: REDIS_CONFIG.host,
    password: REDIS_CONFIG.password,
});

const workHistoryQueue = new Queue("web-history", {
    connection: redisClient,
});

function test(x: string) {
    return x + "_output";
}

// Allow localhost:3000
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "http://localhost:3000");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

// Make out/ directory public
app.use("/out", express.static("./out/"));


app.get('/', (req, res) => {
    res.send('Hello World!' + test("HELLO"))
});

app.get('/list', async (req, res) => {
    const folders = fs.readdirSync("./out/");
    const out = folders.map((folder) => {
        // Get latest image
        const files = fs.readdirSync(`./out/${folder}`);
        // sort file by name asc
        files.sort((a, b) => {
            return a.localeCompare(b);
        });
        const latestImage = files[files.length - 1];
        return {
            url: `http://localhost:3031/out/${folder}/${latestImage}`,
            folder: folder,
            timestamp: latestImage.split(".")[0],
        }
    });
    res.send(out);
});

app.get("/get", async (req, res) => {
    try {
    const { website } = req.query as any;
    const websiteURL = new URL(website);

    const siteSnapshots = await WebHistoryDB.getSiteSnapshots(websiteURL.hostname);
    if(siteSnapshots !== null) {
        const out = await Promise.all(siteSnapshots.map(async (snapshot: ISnapshotRecord) => {
            return {
                screenshot_url: await Storage.getUrl(snapshot.screenshot_url),
                thumbnail_url: await Storage.getUrl(snapshot.thumbnail_url),
                timestamp: snapshot.timestamp,
                wa_url: snapshot.wa_url,
            }
        }));
        return res.status(200).send(out);
    }

    await workHistoryQueue.add("web-history", {
        website,
    });
    return  res.status(200).send(JSON.stringify({ status: "started" }));  
} catch(e) {
    console.log(e);
    return res.status(500).send(JSON.stringify({ error: e.message }));
}
});

app.get("/trigger", async (req, res) => {
    const { website } = req.query as any;
    const crawler = new Crawler(website);
    const records = await crawler.start(website);
    
    res.status(200).send(JSON.stringify({ status: "started", records: records }));  
});
  
app.listen(3031, () => {
    console.log(`Example app listening on port ${3031}`)
});