export const contens = {
  "main.ts": `import { createExpressServer } from "routeify-express";
import { AppController } from "./controllers/App.Controller";

const app = createExpressServer({
  controllers: [AppController],
});

app.listen(3000, () => console.log("server runing"));
      `,

  "controllers/App.Controller.ts": `import { Controller, Get } from "routeify-express";
  
@Controller()
export class AppController {
  @Get()
  hello() {
      return "Hello World!";
  }
}
    `,
} as Record<string, string>;
