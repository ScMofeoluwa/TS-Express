import usersDao from "../dao/users.dao";
import { CRUD } from "../../common/interfaces/crud.interface";
import { CreateUserDto } from "../dto/create.user.dto";
import { PutUserDto } from "../dto/put.user.dto";
import { PatchUserDto } from "../dto/patch.user.dto";

class UsersService implements CRUD {
  async create(resource: CreateUserDto) {
    return usersDao.addUser(resource);
  }

  async deleteById(id: string) {
    return usersDao.removeUserById(id);
  }

  async list(limit: number, page: number) {
    return usersDao.getUsers(limit, page);
  }

  async patchById(id: string, resource: PatchUserDto) {
    return usersDao.updateUserById(id, resource);
  }

  async readByid(id: string) {
    return usersDao.getUserById(id);
  }

  async putById(id: string, resource: PutUserDto) {
    return usersDao.updateUserById(id, resource);
  }

  async getUserByEmail(email: string) {
    return usersDao.getUserByEmail(email);
  }

  async getUserByEmailWithPassword(email: string) {
    return usersDao.getUserByEmailWithPassword(email);
  }
}

export default new UsersService();
