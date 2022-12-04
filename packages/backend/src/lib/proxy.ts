import axios from "axios";
import cheerio from "cheerio";
import { httpsRequest } from "../utils";

class Proxy {
    static addressArr: Array<{ip: string; port: string}> = [];

    static async initialize() {
        // Store from https://sslproxies.org/
        await httpsRequest("https://sslproxies.org/").then((html) => {
            const $ = cheerio.load(html);
            const rows = $(".fpl-list tbody tr");
            rows.each((i: number, row: any) => {
                const ipAddress = $(row).find("td:nth-child(1)").text();
                const portNumber = $(row).find("td:nth-child(2)").text();
                const https = $(row).find("td:nth-child(7)").text();
                if(https.trim() == "yes")
                Proxy.addressArr.push({ip: ipAddress, port: portNumber});
            });
        });
    }

    static async getIpAddress(): Promise<{ip: string; port: string;}> {
        const randomIndex = Math.floor(Math.random() * Proxy.addressArr.length);
        return Proxy.addressArr[randomIndex];
    }
}

export { Proxy };