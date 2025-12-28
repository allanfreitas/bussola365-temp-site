import { db } from "../src/db";
import { sql } from "drizzle-orm";
import { join } from "node:path";

async function runCommand(cmd: string[], errorMsg: string) {
  const proc = Bun.spawn(cmd, {
    stdout: "inherit",
    stderr: "inherit",
    env: { ...process.env },
  });
  await proc.exited;
  if (proc.exitCode !== 0) {
    console.error(errorMsg);
    process.exit(1);
  }
}

// async function runSqlFile(file: string, devSqlDir: string) {
//   const filePath = join(devSqlDir, file);
//   const fileRef = Bun.file(filePath);

//   if (await fileRef.exists()) {
//     console.log(`   - Executing ${file}...`);
//     const sqlContent = await fileRef.text();
//     try {
//       await db.execute(sql.raw(sqlContent));
//       console.log(`   ✅ Executed ${file}`);
//     } catch (error) {
//       console.error(`   ❌ Error executing ${file}:`, error);
//     }
//   } else {
//     console.log(`   ⚠️ File not found: ${file} (skipping)`);
//   }
// }

async function resetDb() {
  console.log("⏳ Starting Database Reset...");

  // Step 1: Clean Database
  console.log("🧹 Cleaning database...");
  try {
    // Drop public schema and recreate it to wipe everything
    await db.execute(sql.raw("DROP SCHEMA IF EXISTS public CASCADE"));
    await db.execute(sql.raw("CREATE SCHEMA public"));
    await db.execute(sql.raw("GRANT ALL ON SCHEMA public TO public"));
    await db.execute(sql.raw("GRANT ALL ON SCHEMA public TO CURRENT_USER"));
    console.log("✅ Database cleaned.");
  } catch (error) {
    console.error("❌ Failed to clean database:", error);
    process.exit(1);
  }

  //   // Step 2: Generate Migrations
  console.log("Hz Generating migrations...");
  await runCommand(
    ["bun", "run", "db:generate"],
    "❌ Failed to generate migrations."
  );
  console.log("✅ Migrations generated.");

  //   // Step 3: Run Migrations
  console.log("🚀 Running migrations...");
  await runCommand(
    //["bun", "x", "drizzle-kit", "migrate"],
    ["bun", "run", "db:migrate"],
    "❌ Failed to run migrations."
  );
  console.log("✅ Migrations applied.");

  //   console.log("🌱 Running seeds...");
  //   await runCommand(["bun", "run", "src/db/seed.ts"], "❌ Failed to run seeds.");
  //   console.log("✅ Seeds executed.");

  // console.log("📜 Running custom SQL files from dev_sql...");
  // const devSqlDir = join(process.cwd(), "dev_sql");

  // const sqlFiles = [
  //     'dev_webhooks.sql',
  //     'dev_messages.sql',
  //     'dev_attachments.sql'
  // ];

  // for (const file of sqlFiles) {
  //     await runSqlFile(file, devSqlDir);
  // }

  //   console.log("✨ Database reset complete!");
  process.exit(0);
}

//resetDb();
export { resetDb };
