import { CommonRoutesConfig } from "../common/common.routes.config";
import usersController from "./controllers/users.controller";
import usersMiddleware from "./middleware/users.middleware";
import { Application } from "express";

export class UsersRoutes extends CommonRoutesConfig {
  constructor(app: Application) {
    super(app, "UsersRoutes");
  }

  configureRoutes() {
    this.app
      .route("/users")
      .get(usersController.listUsers)
      .post(
        usersMiddleware.validateRequiredUserBodyFields,
        usersMiddleware.validateSameEmailDoesntExist,
        usersController.createUser
      );

    this.app.param("userId", usersMiddleware.extractUserId);

    this.app
      .route("/users/:userId")
      .all(usersMiddleware.validateUserExists)
      .get(usersController.getUserByid)
      .delete(usersController.removeUser);

    this.app.put("/users/:userId", [
      usersMiddleware.validateRequiredUserBodyFields,
      usersMiddleware.validateSameEmailBelongToSameUser,
      usersController.put,
    ]);

    this.app.patch("/users/:userId", [
      usersMiddleware.validatePatchEmail,
      usersController.patch,
    ]);

    return this.app;
  }
}
