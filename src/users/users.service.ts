import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserInputType, UserSchema } from '../schemas/user.schema';
import { ApolloError } from 'apollo-server-express';

@Injectable()
export class UsersService {
  constructor(@InjectModel('User') private userModel: Model<User>) {}

  async createUser(user: UserInputType) {
    try {
      console.log(user);
    } catch (e) {
      throw new ApolloError(e);
    }
  }
}
