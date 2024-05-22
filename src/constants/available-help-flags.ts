import { getVersion } from "@/utils/get-version";

export const helpFlags = {
  "--help": [
    `
        Usage: routeify new <project-name> [options]
    
        -p: package manager to use
        --no-git: do not initialize git
        --help: show help
    
        Example:
            routeify new name-of-project -p pnpm
        `,
  ],
  "--version": [`Version: ${getVersion()}`],
} as {
  [key: string]: string[];
};
