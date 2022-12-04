import path from "path";
import https from "https";
import Pixelmatch from "pixelmatch";
import {PNG} from "pngjs";
var clustering = require('density-clustering');

const getOutputDirectory = (url: URL) => {
    const hostname = url.hostname;
    return path.join(__dirname, "..", "screenshots", hostname);
};

const httpsRequest = (url: string): Promise<string> => {
    return new Promise((resolve, reject) => {
        https.get(url, (res) => {
            let data = '';
            res.on('data', (chunk) => {
                data += chunk;
            });
            res.on('end', () => {
                resolve(data);
            });
        }).on("error", (err) => {
            reject(err);
        });
    });
};

async function processImages(images: Array<Buffer>): Promise<Array<Array<number>>> {
    const padImagePixels = (data: Array<Array<number>>) => {
        const max = Math.max(...data.map((image) => image.length));

        return  data.map((image) => {
            const padding = new Array(max - image.length).fill(0);
            return image.concat(padding);
        });
    }

    const imagePixels = images.map((image) => {
        return Array.from(image).map((pixel: any) => {
            return pixel / 255;
        });
    });

    // Get diff percentage
    const imagePixelsArr = padImagePixels(imagePixels);


    return imagePixelsArr;
}

async function getDiffPercentage(a: Buffer, b: Buffer): Promise<number> {
    // Print width of a and b
    const aImage = PNG.sync.read(a);
    const bImage = PNG.sync.read(b);

    console.log("Dimensions of a", aImage.width, aImage.height);
    console.log("Dimensions of b", bImage.width, bImage.height);
    // Pixelmatch
    return new Promise((resolve, reject) => {
        const width = 1920;
        const height = 1080;
        const diff = new PNG({ width, height });
        const misMatchPixels = Pixelmatch(aImage.data as any, bImage.data as any, diff.data, width, height, { threshold: 0.2 });
        resolve((misMatchPixels * 100)/(width * height));
    });
}


async function clusteriseImages(images: Array<Buffer>): Promise<Array<Array<number>>> {
    // Cluster images with distance 5 using HCA
    const imagePixelsArr = await processImages(images);
    var dbscan = new clustering.DBSCAN();
    // parameters: 5 - neighborhood radius, 2 - number of points in neighborhood to form a cluster
    var clusters = dbscan.run(imagePixelsArr, 15, 1);
    console.log("Clusters are", clusters);
    return clusters;
}

export { getOutputDirectory, httpsRequest, clusteriseImages, processImages, getDiffPercentage };