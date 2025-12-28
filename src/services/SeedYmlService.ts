import fs from "node:fs";
import path from "node:path";
import yaml from "js-yaml";
import { db } from "../db";
import {
  appConfs,
  categories,
  coupons,
  messageIntents,
  prompts,
  messageTemplates,
} from "../db/schema";
import type { PgTable } from "drizzle-orm/pg-core";

type EntityType =
  | typeof appConfs
  //| typeof users
  | typeof categories
  | typeof coupons
  | typeof messageIntents
  | typeof prompts
  | typeof messageTemplates;

export class SeedYmlService {
  private seedBasePath: string;

  constructor() {
    const rootDir = process.cwd().split("apps")[0].split("packages")[0];
    this.seedBasePath = path.resolve(rootDir, "data/SeedData");
  }

  public async seedAsync() {
    console.log("Seeding data from YML files...");
    console.log(`Base path: ${this.seedBasePath}`);

    await this.importFromFolder("AppConfs", appConfs);
    //await this.importFromFolder("Users", users);
    await this.importFromFolder("Categories", categories);
    await this.importFromFolder("Coupons", coupons, "coupons");
    await this.importFromFolder("MessageIntents", messageIntents);
    await this.importFromFolder("Prompts", prompts, "prompt"); // Special handling for prompts
    await this.importFromFolder("MessageTemplates", messageTemplates);

    console.log("Seeding completed.");
  }

  private async importFromFolder(
    folderName: string,
    table: EntityType,
    tableName: string = ""
  ) {
    const folderPath = path.join(this.seedBasePath, folderName);

    if (!fs.existsSync(folderPath)) {
      console.warn(`⚠️ Folder not found: ${folderPath}`);
      return;
    }

    const files = fs
      .readdirSync(folderPath)
      .filter((file) => file.endsWith(".yml"));

    if (files.length === 0) {
      console.log(`ℹ️ No .yml files found in: ${folderPath}`);
      return;
    }

    console.log(`📁 Found ${files.length} YAML file(s) in '${folderName}'`);

    let totalRecords = 0;

    // Clear existing records? The C# code optionally did.
    // For safety, let's start with just appending/upserting or failing on dupes.
    // The C# "clearExisting" param was false by default in the call, so we mimic that (append/fail).

    for (const file of files) {
      const filePath = path.join(folderPath, file);
      try {
        const records = this.processYamlFile(filePath);
        if (records.length > 0) {
          // Normalize records for DB
          const normalizedRecords = records.map((record: any) => {
            if (tableName === "prompt") {
              return this.mapPrompt(record);
            }

            if (tableName === "coupons") {
              return this.mapCoupons(record);
            }
            // General mapping: convert camelCase (from YAML) to snake_case (DB) if needed?
            // Drizzle definition uses camelCase keys mapping to snake_case columns automatically for inserts IF using type inference.
            // However, we are passing raw objects. Drizzle insert accepts the defined schema keys (camelCase).
            // So we just need to ensure YAML keys match Schema keys.
            // The C# naming convention was CamelCase.
            return record;
          });

          // Batch insert
          await db
            .insert(table)
            .values(normalizedRecords)
            .onConflictDoNothing()
            .execute();

          totalRecords += records.length;
          console.log(`  ✅ ${file}: ${records.length} record(s)`);
        }
      } catch (ex: any) {
        console.error(`  ❌ ${file}: ERROR - ${ex.message}`);
        console.error(ex);
      }
    }

    console.log(
      `\n🎉 Import completed: ${totalRecords} record(s) for ${folderName}`
    );
  }

  private processYamlFile(filePath: string): any[] {
    const fileContent = fs.readFileSync(filePath, "utf8");
    try {
      const parsed = yaml.load(fileContent) as any;

      if (Array.isArray(parsed)) {
        return parsed;
      }

      // Support "old format" { entity: string, records: [] }
      if (parsed && parsed.records && Array.isArray(parsed.records)) {
        return parsed.records;
      }

      throw new Error(
        "Invalid YAML format. Expected array or object with 'records' array."
      );
    } catch (e: any) {
      throw new Error(`Failed to parse YAML: ${e.message}`);
    }
  }

  private mapPrompt(dto: any) {
    // C# Mapping:
    // Type, Provider, Model, SystemInstruction, UserTemplate, Active,
    // InputVariables (serialized), ModelConfig (serialized)

    return {
      type: dto.type,
      provider: dto.provider,
      model: dto.model,
      systemInstruction: dto.systemInstruction,
      userTemplate: dto.userTemplate,
      active: dto.active,
      // In schema.ts, these are jsonb, so we pass the object directly, Drizzle/PG driver handles serialization
      inputVariables: dto.inputVariables || [],
      modelConfig: dto.modelConfig || {},
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  }

  private mapCoupons(dto: any) {
    return {
      code: dto.code,
      description: dto.description,
      discountType: dto.discountType,
      discountValue: dto.discountValue,
      maxUses: dto.maxUses,
      timesUsed: dto.timesUsed,
      validFrom: new Date(dto.validFrom),
      validUntil: new Date(dto.validUntil),
      active: dto.active,
    };
  }
}
