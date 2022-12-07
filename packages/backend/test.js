const arr=  ["https://stripe.com", "https://airbnb.com", "https://wikipedia.org", "https://youtube.com", "https://go.dev", "https://gmail.com", "https://news.ycombinator.com", "https://twitter.com", "https://linkedin.com", "https://ebay.com", "https://stackoverflow.com", "https://reddit.com", "https://apple.com", "https://dropbox.com", "https://godaddy.com", "https://discord.com", "https://upwork.com"];
const http = require("http");

(async() => {
    for (const url of arr) {
        const res = await new Promise((resolve, reject) => {
            http.get(`http://localhost:3031/get?website=${url}`, (res) => {
                console.log("Res is", res);
                resolve(res.statusCode);
            }).on("error", (e) => {
                reject(e);
            });
        });
        console.log(url, res);
    }
})();