// To be used github action
import Redis from "ioredis";
import { Crawler } from "./lib/crawler";
import { WebHistoryDB } from "./lib/db";
import { Storage } from "./lib/storage";
import {  Worker } from "bullmq";
import { REDIS_CONFIG } from "./config";

const redisClient = new Redis({
    port: REDIS_CONFIG.port,
    host: REDIS_CONFIG.host,
    password: REDIS_CONFIG.password,
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