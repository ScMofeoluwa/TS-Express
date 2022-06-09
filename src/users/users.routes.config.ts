import { CommonRoutesConfig } from "../common/common.routes.config";
import { Application, Request, Response, NextFunction } from "express";

export class UsersRoutes extends CommonRoutesConfig {
  constructor(app: Application) {
    super(app, "UsersRoutes");
  }

  configureRoutes() {
    this.app
      .route("/users")
      .get((req: Request, res: Response) => {
        res.status(200).send("List of users");
      })
      .post((req: Request, res: Response) => {
        res.status(200).send("Post to users");
      });

    this.app
      .route("/users/:userId")
      .all((req: Request, res: Response, next: NextFunction) => {
        next();
      })
      .get((req: Request, res: Response) => {
        res.status(200).send(`GET requested for id ${req.params.userId}`);
      })
      .put((req: Request, res: Response) => {
        res.status(200).send(`PUT requested for id ${req.params.userId}`);
      })
      .patch((req: Request, res: Response) => {
        res.status(200).send(`PATCH requested for id ${req.params.userId}`);
      })
      .delete((req: Request, res: Response) => {
        res.status(200).send(`DELETE requested for id ${req.params.userId}`);
      });

    return this.app;
  }
}
