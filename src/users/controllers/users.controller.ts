import { Request, Response } from "express";
import usersService from "../services/users.service";
import { genSalt, hash } from "bcryptjs";
import debug from "debug";

const log: debug.IDebugger = debug("app:users-controller");

class UsersController {
  async listUsers(req: Request, res: Response) {
    const users = await usersService.list(100, 0);
    res.status(200).send(users);
  }

  async getUserByid(req: Request, res: Response) {
    const user = await usersService.readByid(req.body.id);
    res.status(200).send(user);
  }

  async createUser(req: Request, res: Response) {
    const salt = await genSalt(10);
    req.body.password = await hash(req.body.password, salt);
    const userId = await usersService.create(req.body);
    res.status(200).send({ id: userId });
  }

  async patch(req: Request, res: Response) {
    const salt = await genSalt(10);
    if (req.body.password) {
      req.body.password = await hash(req.body.password, salt);
    }
    log(await usersService.patchById(req.body.id, req.body));
    res.status(204).send();
  }

  async put(req: Request, res: Response) {
    const salt = await genSalt(10);
    if (req.body.password) {
      req.body.password = await hash(req.body.password, salt);
    }
    log(await usersService.putById(req.body.id, req.body));
    res.status(204).send();
  }

  async removeUser(req: Request, res: Response) {
    log(await usersService.deleteById(req.body.id));
    res.status(204).send();
  }
}

export default new UsersController();
