// To be used github action
import Redis from "ioredis";
import { Crawler } from "./lib/crawler";
import { WebHistoryDB } from "./lib/db";
import { Storage } from "./lib/storage";
import {  Worker } from "bullmq";

const redisClient = new Redis({
    port: parseInt(process.env.REDIS_PORT || "6379"),
    host: process.env.REDIS_HOST || "localhost",
    password: process.env.REDIS_PASSWORD || "",
});


(async() => {
    await Storage.initialize();
    new Worker(
        "web-history",
        async (job) => {
            const { website } = job.data as any;
            const websiteURL = new URL(website);
    
            const hasSiteRecord = await WebHistoryDB.getSiteRecord(websiteURL.hostname);

            if(!hasSiteRecord?.data?.length) {
                await WebHistoryDB.insertSiteRecord({
                    url: websiteURL.hostname,
                });
            }

            const crawler = new Crawler(website);
            await crawler.start();
            return { status: "success" };
        },
        {
            connection: redisClient,
        }
    );
})();