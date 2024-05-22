export const contens = {
  "src/main.ts": `import { createExpressServer } from "routeify-express";
import { AppController } from "./controllers/app.controller";

const app = createExpressServer({
  controllers: [AppController],
});

app.listen(3000, () => console.log("server runing"));
      `,

  "src/controllers/app.controller.ts": `import { Controller, Get } from "routeify-express";
  
@Controller()
export class AppController {
  @Get()
  hello() {
      return "Hello World!";
  }
}
    `,
} as Record<string, string>;
