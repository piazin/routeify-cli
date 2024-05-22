import { log } from "@/services/log";
import { commands, helpFlags } from "@/constants";
import { RouteifyFactory } from "./RouteifyFactory";
import { RouteifyRunner } from "./RouteifyRunner";

export class RouteifyCli {
  private command: string;
  private readonly args: string[];
  private routeifyRunner: RouteifyRunner;
  private routeifyFactory: RouteifyFactory;

  constructor(args: string[]) {
    this.args = args;
    this.getCommand();
  }

  async execute() {
    switch (this.command) {
      case "new":
        this.routeifyFactory = new RouteifyFactory(this.args);
        await this.routeifyFactory.execute();
        break;
      case "dev" || "run":
        this.routeifyRunner = new RouteifyRunner(this.args, this.command);
        await this.routeifyRunner.execute();
        break;
      default:
        throw new Error("Command invalid");
    }
  }

  private getCommand() {
    const parsedArgs = this.args.slice(2);
    this.showHelpFlags(parsedArgs);
    this.validateCommand(parsedArgs[0]);
    return parsedArgs[0];
  }

  private validateCommand(command: string) {
    if (!commands.includes(command)) throw new Error(helpFlags["--help"][0]);
    this.command = command;
  }

  private showHelpFlags(args: string[]) {
    const helpFlag = Object.keys(helpFlags).find((f) => args.includes(f));

    if (helpFlag) {
      log.green(helpFlags[helpFlag][0]);
      process.exit(0);
    }
  }
}
