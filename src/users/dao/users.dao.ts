import mongooseService from "../../common/services/mongoose.service";
import { CreateUserDto } from "../dto/create.user.dto";
import { PutUserDto } from "../dto/put.user.dto";
import { PatchUserDto } from "../dto/patch.user.dto";
import shortid from "shortid";
import debug from "debug";

const log: debug.IDebugger = debug("app:in-memory-dao");

class UsersDao {
  private Schema = mongooseService.getMongoose().Schema;

  private userSchema = new this.Schema(
    {
      _id: String,
      email: String,
      password: { type: String, select: false },
      firstName: String,
      lastName: String,
      permissionFlags: Number,
    },
    { id: false }
  );

  public User = mongooseService.getMongoose().model("Users", this.userSchema);

  constructor() {
    log("Created new instance of UsersDao");
  }

  async addUser(userFields: CreateUserDto) {
    const userId = shortid.generate();
    const user = new this.User({
      _id: userId,
      ...userFields,
      permissionFlags: 1,
    });
    await user.save();
    return userId;
  }

  async getUserById(userId: string) {
    return this.User.findById(userId)
      .select("id_ email permissionFlags +password")
      .exec();
  }

  async getUserByEmail(email: string) {
    return this.User.findOne({ email: email }).exec();
  }

  async getUsers(limit = 25, page = 0) {
    return this.User.find()
      .limit(limit)
      .skip(limit * page)
      .exec();
  }

  async updateUserById(userId: string, userFields: PatchUserDto | PutUserDto) {
    const currentUser = await this.User.findOneAndUpdate(
      { _id: userId },
      { $set: userFields },
      { new: true }
    ).exec();
    return currentUser;
  }

  async removeUserById(userId: string) {
    return this.User.deleteOne({ _id: userId }).exec();
  }

  async getUserByEmailWithPassword(email: string) {
    return this.User.findOne({ email: email })
      .select("id_ email permissionFlags +password")
      .exec();
  }
}

export default new UsersDao();
