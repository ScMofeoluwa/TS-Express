import { CommonRoutesConfig } from "../common/common.routes.config";
import jwtMiddleware from "./middleware/jwt.middleware";
import authController from "./controllers/auth.controller";
import authMiddleware from "./middleware/auth.middleware";
import { Application } from "express";
import BodyValidationMiddleware from "../common/middleware/body.validation.middleware";
import { body } from "express-validator";

export class AuthRoutes extends CommonRoutesConfig {
  constructor(app: Application) {
    super(app, "AuthRoutes");
  }

  configureRoutes(): Application {
    this.app.post("/auth", [
      body("email").isEmail(),
      body("password").isString(),
      BodyValidationMiddleware.verifyBodyFieldsErrors,
      authMiddleware.verifyUserPassword,
      authController.createJWT,
    ]);

    this.app.post("/auth/refresh-token", [
      jwtMiddleware.validJWTNeeded,
      jwtMiddleware.verifyRefreshBodyField,
      jwtMiddleware.validRefreshNeeded,
      authController.createJWT,
    ]);

    return this.app;
  }
}
