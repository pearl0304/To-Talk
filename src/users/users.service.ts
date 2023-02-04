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
import * as bcrypt from 'bcrypt';
import { AuthService } from '../auth/auth.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel('User') private userModel: Model<User>,
    private readonly authService: AuthService,
  ) {}

  async findOneByEmail(email: string) {
    try {
      return await this.userModel.findOne({ email: email }).exec();
    } catch (e) {
      throw new ApolloError(e);
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
        throw new ApolloError(`DON'T MATCH THE PASSWORD`);
      } else {
        password = user.password1;
        delete user.password1;
        delete user.password2;
      }
      // CHECK DUPLICATED EMAIL
      const check_email = await this.findOneByEmail(user.email);
      if (check_email) throw new ApolloError('DUPLICATED EMAIL');

      // CREATE ACCOUNT
      const data = {
        ...user,
        password: await bcrypt.hash(password, saltRounds),
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

  async login(input: UserLoginInputType) {
    try {
      const user = await this.authService.validateUser(
        input.email,
        input.password,
      );
      if (!user) {
        throw new ApolloError(`NO USER INFO`);
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
}
