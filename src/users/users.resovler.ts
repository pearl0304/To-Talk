import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import {
  User,
  UserInputType,
  UserLoginInputType,
} from '../schemas/user.schema';
import { ApolloError } from 'apollo-server-express';
import { UsersService } from './users.service';

@Resolver()
export class UsersResolver {
  constructor(private usersService: UsersService) {}
  @Query(() => [User])
  async findAll() {
    try {
      return [
        { uid: '1', email: 'apple@test.com', displayName: '돌아온애쁠' },
        { uid: '2', email: 'banan@test.com', displayName: '바나나반하나' },
      ];
    } catch (e) {
      throw new ApolloError(e);
    }
  }

  @Mutation(() => User)
  async createUser(@Args('input') user: UserInputType) {
    try {
      return await this.usersService.createUser(user);
    } catch (e) {
      throw new ApolloError(e);
    }
  }

  @Mutation(() => User)
  async login(@Args('input') user: UserLoginInputType) {
    try {
      return await this.usersService.login(user);
    } catch (e) {
      throw new ApolloError(e);
    }
  }
}
