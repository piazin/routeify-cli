export const flags = {
  "-p": ["npm", "pnpm", "yarn"],
  "-help": [
    `
    -p: package manager to use
    -help: show help

    Example:
      routeify new name-of-project -p pnpm
  `,
  ],
} as {
  [key: string]: string[];
};
