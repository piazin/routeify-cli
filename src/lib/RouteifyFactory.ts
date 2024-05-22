import { join } from "path";
import fs from "fs/promises";
import { promisify } from "util";
import { exec as execCB } from "child_process";

import { log } from "@/services/log";
import { flags } from "@/constants";
import { contens } from "@/templates/simple-project";

const exec = promisify(execCB);

export class RouteifyFactory {
  private projectName: string;
  private readonly args: string[];
  private flags: { flag: string; value: string | number | boolean }[];

  constructor(args: string[]) {
    this.args = this.parseArgs(args);
  }

  async execute() {
    await this.createNewProject();
  }

  private async createNewProject() {
    log.startSpinner("We are creating your project...");
    await this.createFolders();
    await this.createFiles();
    await this.configureCliJson();
    await this.initGit();
    await this.initPackageManager();
    await this.installDependencies();
    log.stopSpinner();
    log.green(`
      ${this.projectName} was created successfully.
      cd ${this.projectName}
    `);
  }

  private async initPackageManager() {
    const packageManager =
      this.flags.find((f) => f.flag === "-p")?.value || "npm";
    const initCommand = packageManager === "pnpm" ? "init" : "init -y";

    log.blue(`📦 Initializing ${packageManager}`);
    await exec(`cd ${this.projectName} && ${packageManager} ${initCommand}`);
    const packageJson = await fs.readFile(
      join(process.cwd(), this.projectName, "package.json"),
      "utf-8"
    );

    const parsedPackageJson = JSON.parse(packageJson);
    parsedPackageJson.scripts = {
      dev: "routeify dev",
    };

    await fs.writeFile(
      join(process.cwd(), this.projectName, "package.json"),
      JSON.stringify(parsedPackageJson, null, 2)
    );
  }

  private async installDependencies() {
    const skip = this.flags.find((f) => f.flag === "--no-install");

    if (skip) {
      log.blue("🔗 Skipping dependencies installation");
      return;
    }

    const packageManager =
      this.flags.find((f) => f.flag === "-p")?.value || "npm";
    const installCommand = packageManager === "npm" ? "install" : "add";

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
      const files = Object.keys(contens);

      for (const file of files) {
        const content = contens[file];

        await fs.writeFile(
          join(process.cwd(), this.projectName, file),
          content
        );
      }

      log.blue("🗃️  Creating files");
    } catch (error) {
      throw error;
    }
  }

  private async configureCliJson() {
    const cliJson = {
      rootDir: "src",
      projectName: this.projectName,
      entryFile: "main.ts",
    };

    await fs.writeFile(
      join(process.cwd(), this.projectName, "routeify-cli.json"),
      JSON.stringify(cliJson, null, 2)
    );
  }

  private async initGit() {
    const skip = this.flags.find((f) => f.flag === "--no-git");

    if (skip) {
      log.blue("🔗 Skipping git initialization");
      return;
    }

    try {
      log.blue("🔗 Initializing git");
      await exec(`cd ${this.projectName} && git init`);
      await exec(`cd ${this.projectName} && touch .gitignore`);
      await fs.writeFile(
        join(process.cwd(), this.projectName, ".gitignore"),
        "node_modules\ndist\n.env\n"
      );
    } catch (error) {
      log.red("Error initializing git");
    }
  }

  private parseArgs(args: string[]): string[] {
    /*                 #0  #1              #any #0
      bash -> routeify new name-of-project -p package-manager
    */

    const parsedArgs = args.slice(3);
    const [projectName] = parsedArgs;
    this.validateProjectName(projectName);

    this.flags = parsedArgs.reduce((acc, currentArg, index) => {
      const validStartFlag =
        currentArg.startsWith("-") || currentArg.startsWith("--");
      if (!validStartFlag) return acc;

      let existFlag = validStartFlag && Object.keys(flags).includes(currentArg);
      if (!existFlag) throw new Error(`Flag ${currentArg} inválida.`);

      let existFlagValues = flags[currentArg]?.length > 0;
      const flag = currentArg;

      if (acc.find((v) => v.flag == flag))
        throw new Error(`A flag ${flag} foi informada mais de uma vez`);

      if (existFlagValues) {
        const valueOfFlag = parsedArgs[index + 1];
        const value = flags[currentArg].find((v) => v == valueOfFlag);

        if (!value)
          throw new Error(
            `O valor ${valueOfFlag} informado na flag ${flag} não é valido. use: ${flags[currentArg]}`
          );

        acc.push({ flag, value });
      } else acc.push({ flag, value: true });

      return acc;
    }, []);

    return parsedArgs;
  }

  private validateProjectName(projectName: string) {
    const isInvalidName =
      !projectName ||
      projectName.startsWith("-") ||
      projectName.startsWith("--");

    if (isInvalidName) throw new Error("Nome do projeto invalido");

    this.projectName = projectName;
  }
}
