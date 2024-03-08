#!/usr/bin/env node

import { log } from "@/services/log";
import { RouteifyFactory } from "@/lib";

(async () => {
  try {
    log.white("Routeify CLI ☕");
    const factor = new RouteifyFactory(process.argv);
    await factor.execute();
  } catch (error) {
    log.stopSpinner();
    log.magenta(error.message);
  }
})();
