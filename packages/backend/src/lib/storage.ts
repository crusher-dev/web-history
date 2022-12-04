import B2 from "backblaze-b2";
import { BACKBLAZE_CONFIG } from "../config";

export class Storage {
    static backBlazeInstance: B2 = new B2({
        applicationKeyId: BACKBLAZE_CONFIG.applicationKeyId,
        applicationKey: BACKBLAZE_CONFIG.applicationKey,
    });

    static async initialize() {
        await this.backBlazeInstance.authorize();
    }

    static async upload(buffer: Buffer, fileName: string): Promise<void> {
        const { data: { uploadUrl, authorizationToken } } = await Storage.backBlazeInstance.getUploadUrl({
            bucketId: BACKBLAZE_CONFIG.bucket,
        });

        const out =await this.backBlazeInstance.uploadFile({
            uploadUrl,
            uploadAuthToken: authorizationToken,
            fileName,
            data: buffer,
        });

        console.log("Upload result", out);
        
    }

    static async get(fileName: string): Promise<Buffer> {
        const { data } = await this.backBlazeInstance.downloadFileByName({
            fileName,
            bucketName: BACKBLAZE_CONFIG.bucket,
            responseType: "arraybuffer",
        });

        return data;
    }

    static async getUrl (fileName: string): Promise<string> {
        return `https://f004.backblazeb2.com/file/${BACKBLAZE_CONFIG.bucket}/${fileName}`;
    }
}