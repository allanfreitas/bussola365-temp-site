import { Command } from "commander";
import chalk from "chalk";
import { db, schema } from "@/db";
import { eq } from "drizzle-orm";

const program = new Command();

program
  .name("bussola-cli")
  .description("CLI for Bussola365 management")
  .version("1.0.0");

program
  .command("seed")
  .description("Seed database from YML files")
  .action(async () => {
    console.log(chalk.blue.bold("Seeding Database..."));
    try {
      const { SeedYmlService } = await import("../src/services/SeedYmlService");
      const seeder = new SeedYmlService();
      await seeder.seedAsync();
      console.log(chalk.green("Seeding completed successfully!"));
      process.exit(0);
    } catch (error) {
      console.error(chalk.red("Seeding failed:"), error);
      process.exit(1);
    }
  });

program
  .command("clean-db")
  .description("Reset the database (drops all data)")
  .action(async () => {
    console.log(chalk.blue.bold("Resetting Database..."));
    try {
      const { resetDb } = await import("./reset-db");
      await resetDb();
    } catch (error) {
      console.error(chalk.red("Database reset failed:"), error);
      process.exit(1);
    }
  });

program
  .command("create-admin")
  .description("Create an admin user after resetting the database")
  .action(async () => {
    console.log(chalk.blue.bold("Creating Admin User..."));
    try {
      const { auth } = await import("./../src/lib/auth");

      const email = process.env.ADMIN_EMAIL;
      const password = process.env.ADMIN_PASSWORD;

      if (!email || !password) {
        throw new Error(
          "ADMIN_EMAIL and ADMIN_PASSWORD environment variables must be set"
        );
      }

      //await db.delete(schema.users).where(eq(schema.users.email, email));
      await db.delete(schema.users);

      await auth.api.createUser({
        body: {
          email: email,
          password: password,
          name: "Bussola365 Admin",
          role: "admin",
          data: { emailVerified: true },
        },
      });

      await auth.api.createUser({
        body: {
          email: "u@bussola365.com.br",
          password: "123456",
          name: "Bussola365 User",
          role: "user",
          data: { emailVerified: true },
        },
      });

      console.log(chalk.green("Admin user created successfully!"));
      process.exit(0);
    } catch (error) {
      console.error(chalk.red("Admin user creation failed:"), error);
      process.exit(1);
    }
  });

program.parse();
