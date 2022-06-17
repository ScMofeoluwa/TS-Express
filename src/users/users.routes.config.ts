import bodyValidationMiddleware from "../common/middleware/body.validation.middleware";
import usersController from "./controllers/users.controller";
import { CommonRoutesConfig } from "../common/common.routes.config";
import usersMiddleware from "./middleware/users.middleware";
import { Application } from "express";
import { body } from "express-validator";

export class UsersRoutes extends CommonRoutesConfig {
  constructor(app: Application) {
    super(app, "UsersRoutes");
  }

  configureRoutes() {
    this.app
      .route("/users")
      .get(usersController.listUsers)
      .post(
        body("email").isEmail(),
        body("password")
          .isLength({ min: 5 })
          .withMessage("Must include password (5+ characters)"),
        bodyValidationMiddleware.verifyBodyFieldsErrors,
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
      body("email").isEmail(),
      body("password")
        .isLength({ min: 5 })
        .withMessage("Must include password (5+ characters)"),
      body("firstName").isString(),
      body("lastName").isString(),
      body("permissionFlags").isInt(),
      bodyValidationMiddleware.verifyBodyFieldsErrors,
      usersMiddleware.validateSameEmailBelongToSameUser,
      usersController.put,
    ]);

    this.app.patch("/users/:userId", [
      body("email").isEmail().optional(),
      body("password")
        .isLength({ min: 5 })
        .withMessage("Must include password (5+ characters)").optional(),
      body("firstName").isString().optional(),
      body("lastName").isString().optional(),
      body("permissionFlags").isInt().optional(),
      bodyValidationMiddleware.verifyBodyFieldsErrors,
      usersMiddleware.validatePatchEmail,
      usersController.patch,
    ]);

    return this.app;
  }
}
