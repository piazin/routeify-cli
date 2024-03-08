export const contens = {
  "main.ts": `import { createExpressServer } from "routeify-express";
import { AppController } from "./controllers/App.Controller";

const app = createExpressServer({
controllers: [AppController],
});

app.listen(3000, () => console.log("server runing"));
      `,

  "controllers/App.Controller.ts": `import { Controller, Get, Request, Response } from "routeify-express";
  
@Controller()
export class AppController {
@Get()
hello(req: Request, res: Response) {
    res.status(200).json({message: "Hello World"});
}
}
    `,
} as Record<string, string>;
