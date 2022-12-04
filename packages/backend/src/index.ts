import express from "express";
import { Crawler } from "./lib/crawler";

import fs from "fs";
import { getWebArchiveRecords } from "./lib/webArchive";
import { Queue } from "bullmq";
import Redis from "ioredis";
const app = express()

const redisClient = new Redis({
    port: parseInt(process.env.REDIS_PORT || "6379"),
    host: process.env.REDIS_HOST || "localhost",
    password: process.env.REDIS_PASSWORD || "",
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
    if(fs.existsSync(`out/${websiteURL.hostname}`)) {
        const files = fs.readdirSync(`./out/${websiteURL.hostname}`);
        const imagesRes = files.map((file) => {
            return {
                url: `http://localhost:3031/out/${websiteURL.hostname}/${file}`,
                wa_url: `https://web.archive.org/web/${file.replace(".png", "")}/${websiteURL.hostname}`,
                timestamp: file.split(".")[0]
            }
        });
        return res.status(200).json(imagesRes);
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