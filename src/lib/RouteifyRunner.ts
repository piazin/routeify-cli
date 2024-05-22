import { stdout, exit } from "process";
import fs from "fs/promises";
import { log } from "@/services/log";
import { spawn } from "child_process";
import { readCliJsonConfig } from "@/utils/read-cli-json-config";

export class RouteifyRunner {
  private command: string;
  private readonly args: string[];
  private cliJson: {
    projectName: string;
    rootDir: string;
    entryFile: string;
  };

  constructor(args: string[], command: string) {
    this.args = args;
    this.command = command;
  }

  async execute() {
    this.cliJson = await readCliJsonConfig();
    await this.validateCliConfig();
    switch (this.command) {
      case "dev":
        this.dev();
        break;
      default:
        log.red("Command not found");
        break;
    }
  }

  private dev() {
    log.startSpinner("starting server...");

    const process = spawn("npx", ["tsx watch", this.cliJson.entryFile], {
      cwd: this.cliJson.rootDir,
      stdio: ["inherit", "pipe", "pipe"],
    });

    process.stdout.once("readable", () => log.stopSpinner());

    process.stdout.on("data", (data) => {
      stdout.write(data);
    });

    process.stderr.on("data", (data) => {
      stdout.write(data);
    });

    process.on("error", (error) => {
      log.red(`error: ${error.message}`);
    });

    process.on("close", (code) => {
      log.blue(`Process exited with code ${code}`);
    });
  }

  private async validateCliConfig() {
    if (!this.cliJson.entryFile) {
      log.red("entryFile not found in routeify-cli.json");
      exit(1);
    }

    if (!this.cliJson.rootDir) {
      log.red("rootDir not found in routeify-cli.json");
      exit(1);
    }

    try {
      await fs.access(this.cliJson.rootDir);
      await fs.access(`${this.cliJson.rootDir}/${this.cliJson.entryFile}`);
    } catch (error) {
      log.red("rootDir or entryFile not found");
      exit(1);
    }
  }
}
