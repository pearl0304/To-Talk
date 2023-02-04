import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import {
  User,
  UserInputType,
  UserLoginInputType,
  UserSchema,
} from '../schemas/user.schema';
import { ApolloError } from 'apollo-server-express';
import * as moment from 'moment-timezone';
@Injectable()
export class UsersService {
  constructor(@InjectModel('User') private userModel: Model<User>) {}

  async findEmail(email: string) {
    try {
      const result = await this.userModel.findOne({ email: email }).exec();
      if (result) throw new ApolloError('DUPLICATED EMAIL');
    } catch (e) {
      throw new ApolloError(e);
    }
  }

  async createUser(user: UserInputType) {
    try {
      // CHECK PASSWORD
      let password = '';
      if (user.password1 !== user.password2) {
        throw new ApolloError(`DON'T MATCH THE PASSWORD`);
      } else {
        password = user.password1;
        delete user.password1;
        delete user.password2;
      }
      // CHECK DUPLICATED EMAIL
      await this.findEmail(user.email);

      // CREATE ACCOUNT
      const data = {
        ...user,
        password: password,
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
}
