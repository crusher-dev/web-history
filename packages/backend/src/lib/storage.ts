import { AZURE_CONFIG } from "../config";
import { DefaultAzureCredential } from "@azure/identity";
import { BlobServiceClient, ContainerClient } from "@azure/storage-blob";

export class Storage {
    static blobServiceClient: BlobServiceClient = new BlobServiceClient(
        `https://${AZURE_CONFIG.accountName}.blob.core.windows.net`,
        new DefaultAzureCredential()
    );
    static blobContainerClient: ContainerClient | null = null;

    static async initialize() {
        await this.blobServiceClient.getContainerClient(AZURE_CONFIG.containerName).createIfNotExists();
        this.blobContainerClient = await this.blobServiceClient.getContainerClient(AZURE_CONFIG.containerName);
    }

    static async upload(buffer: Buffer, fileName: string): Promise<void> {
        await this.blobContainerClient?.uploadBlockBlob(fileName, buffer, buffer.length);
    }

    static async get(fileName: string): Promise<Buffer> {
        const blobClient = this.blobContainerClient?.getBlockBlobClient(fileName);
        const downloadBlockBlobResponse = await blobClient?.download();

        const streamToBuffer = (readableStream: any): Promise<Buffer> => {
            return new Promise((resolve, reject) => {
                const chunks: any = [];
                readableStream.on("data", (data: any) => {
                    chunks.push(data instanceof Buffer ? data : Buffer.from(data));
                });
                readableStream.on("end", () => {
                    resolve(Buffer.concat(chunks));
                });
                readableStream.on("error", reject);
            });
        };
        
        const downloaded: Buffer = await streamToBuffer(downloadBlockBlobResponse?.readableStreamBody!);
        return downloaded;
    }

    static async getUrl (fileName: string): Promise<string> {
        return `https://crusher.blob.core.windows.net/${AZURE_CONFIG.containerName}/${fileName}`;
    }
}