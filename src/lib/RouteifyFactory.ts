import { join } from "path";
import fs from "fs/promises";
import { promisify } from "util";
import { exec as execCB } from "child_process";

import { log } from "@/services/log";
import { commands, flags } from "@/constants";
import { contens } from "@/templates/simple-project";

const exec = promisify(execCB);

export class RouteifyFactory {
  private command: string;
  private projectName: string;
  private readonly args: string[];
  private flags: { flag: string; value: string | number | boolean }[];

  constructor(args: string[]) {
    this.args = this.parseArgs(args);
  }

  async execute() {
    switch (this.command) {
      case "new":
        await this.createNewProject();
        break;
      default:
        throw new Error("Command invalid");
    }
  }

  private async createNewProject() {
    log.startSpinner("we are creating your project...");
    await this.createFolders();
    await this.createFiles();
    await this.initPackageManager();
    log.stopSpinner();
    log.white("Project created successfully");
    log.green(`
      cd ${this.projectName}
    `);
  }

  private async initPackageManager() {
    const packageManager =
      this.flags.find((f) => f.flag === "-p")?.value || "npm";
    const initCommand = packageManager === "pnpm" ? "init" : "init -y";
    const installCommand = packageManager === "npm" ? "install" : "add";

    log.blue(`📦 Initializing ${packageManager} and installing dependencies`);
    await exec(`cd ${this.projectName} && ${packageManager} ${initCommand}`);

    await exec(
      `cd ${this.projectName} && ${packageManager} ${installCommand} routeify-express`
    );

    await exec(
      `cd ${this.projectName} && ${packageManager} ${installCommand} typescript @types/node -D`
    );

    await exec(
      `cd ${this.projectName} && npx tsc --init --experimentalDecorators`
    );
  }

  private async createFolders() {
    const dirs = [
      `${this.projectName}`,
      `${this.projectName}/src`,
      `${this.projectName}/src/controllers`,
    ];

    for (const dir of dirs) {
      await fs.mkdir(join(process.cwd(), dir));
    }

    log.blue("📁 Creating folders");
  }

  private async createFiles() {
    try {
      const files = ["main.ts", "controllers/App.Controller.ts"];

      for (const file of files) {
        const content = contens[file];

        await fs.writeFile(
          join(process.cwd(), this.projectName, "src", file),
          content
        );
      }

      log.blue("🗃️  Creating files");
    } catch (error) {
      throw error;
    }
  }

  private parseArgs(args: string[]): string[] {
    /*                 #0  #1              #any #0
      bash -> routeify new name-of-project -p package-manager
    */

    const parsedArgs = args.slice(2);
    const [command, projectName] = parsedArgs;

    if (!commands.includes(command)) throw new Error(flags["-help"][0]);
    this.command = command;

    const isInvalidName = !projectName || projectName.startsWith("-");
    if (isInvalidName) throw new Error("Nome do projeto invalido");
    this.projectName = projectName;

    this.flags = parsedArgs.reduce((acc, currentArg, index) => {
      if (!currentArg.startsWith("-")) return acc;

      let existFlag = currentArg.startsWith("-") && flags[currentArg];
      if (!existFlag) throw new Error(`Flag ${currentArg} invalida`);

      const flag = currentArg;
      const valueOfFlag = parsedArgs[index + 1];
      const value = flags[currentArg].find((v) => v == valueOfFlag);

      if (!value)
        throw new Error(
          `O valor ${valueOfFlag} informado na flag ${flag} não é valido. use: ${flags[currentArg]}`
        );

      if (acc.find((v) => v.flag == flag))
        throw new Error(`A flag ${flag} foi informada mais de uma vez`);

      acc.push({ flag, value });
      return acc;
    }, []);

    return parsedArgs;
  }
}
