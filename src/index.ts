#!/usr/bin/env node

import { log } from "@/services/log";
import { RouteifyCli } from "@/lib";

(async () => {
  try {
    log.white("Routeify CLI ☕");
    const cli = new RouteifyCli(process.argv);
    await cli.execute();
  } catch (error) {
    log.stopSpinner();
    log.magenta(error.message);
  }
})();
