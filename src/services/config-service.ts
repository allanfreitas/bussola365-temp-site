import { db } from "@/db";
import { appConfs } from "@/db/schema";
import { ConfigEnum } from "@/enums/enums";
import { eq } from "drizzle-orm";

class ConfigService {
    constructor() { }

    async get(key: string): Promise<string | null> {
        const [config] = await db
            .select()
            .from(appConfs)
            .where(eq(appConfs.confKey, key))
            .limit(1);
        return config?.confValue;
    }

    async getJobEnabled(): Promise<boolean> {
        const jobEnabled = await this.get(ConfigEnum.JobsEnabled);
        return jobEnabled === "SIM";
    }

    async getWhatappBusinessNumberId(): Promise<string | null> {
        return this.get(ConfigEnum.WhatappBusinessNumberId);
    }
}

const configService = new ConfigService();
export default configService;

