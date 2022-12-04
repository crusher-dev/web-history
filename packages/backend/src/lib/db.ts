import { createClient } from "@supabase/supabase-js";
import { SUPABASE_CONFIG } from "../config";

export class WebHistoryDB {
    static client = createClient(
        SUPABASE_CONFIG.url,
        SUPABASE_CONFIG.key
    );

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
    timestamp: number;
};