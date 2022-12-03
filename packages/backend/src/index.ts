import express from "express";
import { Crawler } from "./lib/crawler";

const app = express();
const crawner = new Crawler();

function test(x: string) {
  return x + "_output";
}

app.get("/", (req, res) => {
  res.send("Hello World!" + test("HELLO"));
});

app.get("/cluster", async (req, res) => {
  await crawner.cluster("stripe.com");
  res.send(JSON.stringify({ status: "success" }));
});

app.get("/trigger", async (req, res) => {
  const { website } = req.query as any;
  const records = await crawner.start(website);

  res.status(200).send(JSON.stringify({ status: "started", records: records }));
});

app.listen(3031, () => {
  console.log(`Example app listening on port ${3031}`);
});
