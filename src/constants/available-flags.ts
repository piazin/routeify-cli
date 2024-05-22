export const flags = {
  "-p": ["npm", "pnpm", "yarn"],
  "--no-git": undefined,
  "--no-install": undefined,
  "--help": [
    `
    Usage: routeify new <project-name> [options]
    
    -p: package manager to use
    --no-git: do not initialize git
    --help: show help
    
    Example:
    routeify new name-of-project -p pnpm
    
    Usage: routeify dev 
  `,
  ],
} as {
  [key: string]: string[];
};
