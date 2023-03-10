import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import {
  User,
  UserInputType,
  UserLoginInputType,
  UserUpdateInputType,
} from '../schemas/user.schema';
import { ApolloError } from 'apollo-server-express';
import * as moment from 'moment-timezone';
import * as bcrypt from 'bcrypt';
import { AuthService } from '../auth/auth.service';
import { errorMessages } from '../errorMessages';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel('User') private userModel: Model<User>,
    private readonly authService: AuthService,
  ) {}

  /**
   * GET USER INFO BY EMAIL
   * @param email
   */
  async findOneByEmail(email: string) {
    try {
      return await this.userModel
        .findOne({ email: email, deleted: false })
        .lean();
    } catch (e) {
      errorMessages('005');
    }
  }

  /**
   * GET USER INFO BY UID
   * @param uid
   */
  async findOneByUid(uid: string) {
    try {
      const result = await this.userModel
        .findOne({ _id: uid, deleted: false })
        .lean();
      if (!result) {
        return errorMessages('005');
      } else {
        return result;
      }
    } catch (e) {
      errorMessages('005');
    }
  }

  /**
   * Create new Account
   * @param user
   */
  async createUser(user: UserInputType) {
    try {
      // CHECK PASSWORD
      let password = '';
      const saltRounds = 10;
      if (user.password1 !== user.password2) {
        errorMessages('001');
      } else {
        password = user.password1;
        delete user.password1;
        delete user.password2;
      }
      // CHECK DUPLICATED EMAIL
      const check_email = await this.findOneByEmail(user.email);
      if (check_email) errorMessages('002');

      // CREATE ACCOUNT
      const data = {
        ...user,
        password: await bcrypt.hash(password, saltRounds),
        level: 1,
        deleted: false,
        date_created: moment().utc().format(),
      };

      const result = await this.userModel.create(data);
      return {
        uid: result._id,
        ...data,
      };
    } catch (e) {
      throw new ApolloError(e);
    }
  }

  /**
   * Login and create JWT TOKEN
   * @param input
   */
  async login(input: UserLoginInputType) {
    try {
      const user = await this.authService.validateUser(
        input.email,
        input.password,
      );
      if (!user) {
        errorMessages('005');
      } else {
        const access_token = await this.authService.generateUserCredentials(
          user,
        );
        console.log('access_token => ', access_token);

        user.uid = user._id;
        user.access_token = access_token.access_token;

        return user;
      }
    } catch (e) {
      throw new ApolloError(e);
    }
  }

  /**
   * Update User Information
   * @param user
   * @param uid
   * @param input
   */
  async updateUserInfo(user: User, uid: string, input: UserUpdateInputType) {
    try {
      // CHECK USER INFO
      if (user.uid !== uid) errorMessages('004');
      await this.findOneByUid(uid);

      // UPDATE DISPLAY NAME
      if (input.displayName) {
        const check_displayName = await this.userModel
          .findOne({
            displayName: input.displayName,
          })
          .exec();
        if (check_displayName) errorMessages('003');
      }

      // UPDATE PASSWORD
      if (input.password1) {
        let password = '';
        const saltRounds = 10;
        if (input.password1 !== input.password2) {
          errorMessages('001');
        } else {
          password = input.password1;
          delete input.password1;
          delete input.password2;
          input.password = await bcrypt.hash(password, saltRounds);
        }
      }

      // TODO :: UPDATE PROFILE

      const data = {
        ...input,
        date_updated: moment().utc().format(),
      };

      await this.userModel.findOneAndUpdate(
        { _id: uid },
        { ...data },
        { new: true },
      );

      const result = {
        uid: uid,
        ...data,
      };

      return result;
    } catch (e) {
      throw new ApolloError(e);
    }
  }

  /**
   * UPDATE DELETED VALUE
   * @param user
   * @param uid
   */
  async deleteUser(user: User, uid: string) {
    let deleted_by = '';
    try {
      if (user.uid !== uid && user.level < 2) errorMessages('004');
      await this.findOneByUid(uid);

      if (user.uid == uid) {
        deleted_by = uid;
      } else if (user.uid !== uid && user.level >= 2) {
        deleted_by = user.uid;
      }

      const data = {
        deleted: true,
        deleted_by: deleted_by,
        date_deleted: moment().utc().format(),
      };

      const result = await this.userModel
        .findOneAndUpdate({ _id: uid }, { ...data }, { new: true })
        .lean();

      result.uid = uid;

      return result;
    } catch (e) {
      throw new ApolloError(e);
    }
  }

  /**************************************
   *********** ONLY FOR ADMIN ***********
   **************************************/

  /**
   * UPDATE USER'S LEVEL
   * @param user
   * @param uid
   * @param level
   */
  async updateUserLevel(user: User, uid: string, level: number) {
    try {
      if (user.level < 3) errorMessages('004');
      await this.findOneByUid(uid);

      const data = {
        level: level,
        updated_by: user.uid,
        date_created: moment().utc().format(),
      };

      const result = await this.userModel.findOneAndUpdate(
        { _id: uid },
        { ...data },
        { new: true },
      );

      result.uid = uid;

      return result;
    } catch (e) {
      throw new ApolloError(e);
    }
  }

  /**
   * DELETE USER DATA FROM DATABASE
   * @param user
   * @param uid
   */
  async deleteUserByAdmin(user: User, uid: string) {
    try {
      if (user.level < 3) errorMessages('004');
      const proc = await this.userModel.findOne({ _id: uid, deleted: true });
      if (!proc) errorMessages('005');

      await this.userModel.deleteOne({ _id: uid });
      return true;
    } catch (e) {
      throw new ApolloError(e);
    }
  }
}
