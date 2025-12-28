import { Command } from "commander";
import chalk from "chalk";

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

program.parse();
