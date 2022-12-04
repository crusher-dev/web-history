// To be used github action
import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import { Crawler } from "./lib/crawler";
import { WebHistoryDB } from "./lib/db";
import { Storage } from "./lib/storage";

const argv: any = yargs(hideBin(process.argv)).argv;
(async() => {
    if(argv?.site) {
        const siteUrl = new URL(argv.site);

        await Storage.initialize();
        const hasSiteRecord = await WebHistoryDB.getSiteRecord(siteUrl.hostname);

        if(!hasSiteRecord?.data?.length) {
            console.log("No records found for site", siteUrl.hostname);
            const res = await WebHistoryDB.insertSiteRecord({
                url: siteUrl.hostname,
            });
            console.log("Inserted site record", res);
        }

        const crawler = new Crawler(argv?.site);
        await crawler.start();
        
        console.log("Finished crawling");
    } else {
        // Show usage
        console.log("Usage: web-history-crawler --site=<site-url>");
    }
})();
