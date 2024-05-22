import rdl from "node:readline";

export const colours = {
  black: "\x1b[30m",
  red: "\x1b[31m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  magenta: "\x1b[35m",
  cyan: "\x1b[36m",
  white: "\x1b[37m",
  gray: "\x1b[90m",
  crimson: "\x1b[38m",
};

class Log {
  private interval: NodeJS.Timeout | undefined;
  private l = process.stdout;

  blue(message: string, options?: { return: boolean }) {
    if (options?.return) return `${colours.blue}${message}\x1b[0m`;

    this.l.write(`${colours.blue}${message}\x1b[0m\n`);
  }

  magenta(message: string) {
    this.l.write(`${colours.magenta}${message}\x1b[0m\n`);
    return message;
  }

  red(message: string) {
    this.l.write(`${colours.red}${message}\x1b[0m\n`);
    return message;
  }

  white(message: string, options?: { return: boolean }) {
    if (options?.return) return `${colours.white}${message}\x1b[0m`;

    this.l.write(`${colours.white}${message}\x1b[0m\n`);
  }

  green(message: string, options?: { return: boolean }) {
    if (options?.return) return `${colours.green}${message}\x1b[0m`;

    this.l.write(`${colours.green}${message}\x1b[0m\n`);
  }

  startSpinner(message?: string) {
    process.stdout.write("\x1B[?25l");

    const loadingFrames = [
      "⣿⣷⣶⣦⣄⣀",
      "⣾⣿⣷⣶⣦⣄",
      "⣿⣾⣿⣷⣶⣦",
      "⣿⣷⣾⣿⣷⣶",
      "⣿⣷⣶⣾⣿⣷",
      "⣿⣷⣶⣦⣾⣿",
    ];

    let currentFrame = 0;

    this.interval = setInterval(() => {
      let frame = loadingFrames[currentFrame];

      if (!frame) {
        currentFrame = 0;
        frame = loadingFrames[currentFrame];
      }

      this.l.write(this.green(frame, { return: true }));
      this.l.write(this.green(` ${message ? message : ""}`, { return: true }));
      rdl.cursorTo(process.stdout, 0);

      currentFrame =
        currentFrame >= loadingFrames.length ? 0 : currentFrame + 1;
    }, 100);
  }

  stopSpinner() {
    clearInterval(this.interval);
    this.l.write("\x1B[?25h");
    this.l.write("\x1B[2J\x1B[0f");
  }
}

export const log = new Log();
