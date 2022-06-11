import { CreateUserDto } from "../dto/create.user.dto";
import { PutUserDto } from "../dto/put.user.dto";
import { PatchUserDto } from "../dto/patch.user.dto";
import shortid from "shortid";
import debug from "debug";

const log: debug.IDebugger = debug("app:in-memory-dao");

class UsersDao {
  users: Array<CreateUserDto> = [];

  constructor() {
    log("Created new instance of UsersDao");
  }

  async addUser(user: CreateUserDto) {
    user.id = shortid.generate();
    this.users.push(user);
    return user.id;
  }

  async getUsers() {
    return this.users;
  }

  async getUserById(userId: string) {
    return this.users.find((user: { id: string }) => user.id === userId);
  }

  async putUserById(userId: string, user: PutUserDto) {
    const idx = this.users.findIndex(
      (obj: { id: string }) => obj.id === userId
    );
    this.users.splice(idx, 1, user);
    return `${user.id} updated via put`;
  }

  async patchUserById(userId: string, user: PatchUserDto) {
    const idx = this.users.findIndex(
      (obj: { id: string }) => obj.id === userId
    );
    let currentUser = this.users[idx];
    const allowedPatchFields = [
      "password",
      "firstName",
      "lastName",
      "permissionLevel",
    ];
    for (let field of allowedPatchFields) {
      if (field in user) {
        //  @ts-ignore
        currentUser[field] = user[field];
      }
    }
    this.users.splice(idx, 1, currentUser);
    return `${user.id} updated via patch`;
  }

  async removeUserById(userId: string) {
    const idx = this.users.findIndex(
      (obj: { id: string }) => obj.id === userId
    );
    this.users.splice(idx, 1);
    return `${userId} removed`;
  }

  async getUserByEmail(email: string) {
    const idx = this.users.findIndex(
      (obj: { email: string }) => obj.email === email
    );
    let currentUser = this.users[idx];
    if (currentUser) {
      return currentUser;
    } else {
      return null;
    }
  }
}

export default new UsersDao();
