import { createClient } from "@supabase/supabase-js";


const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
const supabaseKey =  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;

export class WebHistoryDB {


    static client = createClient(supabaseUrl,supabaseKey);

    static async insertSiteRecord (payload: ISiteRecord): Promise<any> {
        return this.client.from("sites").insert(payload);
    }

    static async getSiteRecords (): Promise<any> {
        return this.client.from("sites").select();
    }

    static async getSiteRecord (url: string): Promise<any> {
        return this.client.from("sites").select().eq("url", url);
    }

    static async updateSiteRecord (url: string, payload: ISiteRecord): Promise<any> {
        return this.client.from("sites").update(payload).eq("url", url);
    }

    static async deleteSiteRecord (url: string): Promise<any> {
        return this.client.from("sites").delete().eq("url", url);
    }

    static async insertSnapshotRecord (payload: ISnapshotRecord & { site_id: number; }): Promise<any> {
        return this.client.from("snapshots").insert(payload);
    }

    static async getSnapshotRecords (): Promise<any> {
        return this.client.from("snapshots").select();
    }

    static async getSnapshotRecord (id: number): Promise<any> {
        return this.client.from("snapshots").select().eq("id", id);
    }

    static async getSiteSnapshots (siteUrl: string): Promise<any> {
        const siteRecord = await WebHistoryDB.getSiteRecord(siteUrl);
        if(!siteRecord.data?.length) return null;
        const siteId = siteRecord?.data?.[0]?.id;
        const res = await this.client.from("snapshots").select().eq("site_id", siteId);
        return res;
    }

    static async updateSnapshotRecord (id: number, payload: ISnapshotRecord): Promise<any> {
        return this.client.from("snapshots").update(payload).eq("id", id);
    }

    static async deleteSnapshotRecord (id: number): Promise<any> {
        return this.client.from("snapshots").delete().eq("id", id);
    } 
}

export interface ISiteRecord {
    url: string;
    category?: "social" | "news" | "shopping" | "entertainment" | "other" | null;
}

export interface ISnapshotRecord  {
    site?: ISiteRecord;
    screenshot_url: string;
    wa_url: string;
    thumbnail_url: string;
    timestamp: number;
};