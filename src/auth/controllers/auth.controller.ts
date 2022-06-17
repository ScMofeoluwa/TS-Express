import { Request, Response } from "express";
import debug from "debug";
import jwt from "jsonwebtoken";
import crypto from "crypto";

const log: debug.IDebugger = debug("app:auth-controller");

// @ts-expect-error
const jwtSecret: string = process.env.JWT_SECRET;
const tokenExpirationInSeconds = 3600;

class AuthController {
  async createJWT(req: Request, res: Response) {
    try {
      const refreshId = req.body.userId + jwtSecret;
      const salt = crypto.createSecretKey(crypto.randomBytes(16));
      const hash = crypto
        .createHmac("sha512", salt)
        .update(refreshId)
        .digest("base64");
      req.body.refreshKey = salt.export();
      const token = jwt.sign(req.body, jwtSecret, {
        expiresIn: tokenExpirationInSeconds,
      });
      return res.status(201).send({ accessToken: token, refreshToken: hash });
    } catch (err) {
      log("createJWT error: %0", err);
      return res.status(500).send();
    }
  }
}

export default new AuthController();
