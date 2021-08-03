import express from "express";
import swaggerUi from "swagger-ui-express";

import { RegisterRoutes } from "./routes";
import swaggerJson from "./swagger/swagger.json";

const DEFAULT_SERVER_PORT = 5000;

class AppController {
  public express;

  public listen() {
    this.express.listen(process.env.SERVER_PORT || DEFAULT_SERVER_PORT, () => {
      console.log("listening");
    });
  }

  constructor() {
    this.express = express();
    this.routes();
    this.middlewares();
    this.displaySwagger();
  }

  private routes() {
    RegisterRoutes(this.express);
  }

  private middlewares() {
    this.express.use(express.json());
    //this.express.use(checkAuthentication);
  }

  private displaySwagger() {
    this.express.use(
      "/doc",
      swaggerUi.serve,
      swaggerUi.setup({
        swaggerJson,
      })
    );
  }
}

export default new AppController();
