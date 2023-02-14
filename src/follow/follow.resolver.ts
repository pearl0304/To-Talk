import { UseGuards } from '@nestjs/common';
import { Resolver, Query, Mutation, Args, ResolveField } from '@nestjs/graphql';
import {
  Follow,
  FollowInputType,
  GetFollowListInput,
} from '../schemas/follow.schema';
import { FollowService } from './follow.service';
import { ApolloError } from 'apollo-server-express';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../users/users.decorator';
import { User } from '../schemas/user.schema';
import { UsersService } from '../users/users.service';
import { errorMessages } from '../errorMessages';

@Resolver(() => Follow)
export class FollowResolver {
  constructor(
    private followService: FollowService,
    private readonly usersService: UsersService,
  ) {}

  @Query(() => [Follow])
  async getFollowList(
    @Args('input') input: GetFollowListInput,
    @Args('offset') offset: number,
    @Args('limit') limit: number,
    @Args('q') q: string,
  ) {
    try {
      await this.usersService.findOneByUid(input.uid);
      return await this.followService.getFollowList(input, offset, limit, q);
    } catch (e) {
      throw new ApolloError(e);
    }
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => Follow)
  async doFollow(
    @CurrentUser() user: User,
    @Args('input') input: FollowInputType,
  ) {
    try {
      if (user.uid !== input.uid) errorMessages('004');
      await this.usersService.findOneByUid(input.following);
      return await this.followService.doFollow(input);
    } catch (e) {
      throw new ApolloError(e);
    }
  }

  /************************************
   *********** ResolveField ***********
   ************************************/

  @ResolveField()
  async follower(@CurrentUser() user: User) {
    try {
      const proc = await this.usersService.findOneByUid(user.uid);
      proc.uid = user.uid;
      return proc;
    } catch (e) {
      throw new ApolloError(e);
    }
  }

  @ResolveField()
  async followee(@CurrentUser() user: User) {
    try {
      const proc = await this.usersService.findOneByUid(user.uid);
      proc.uid = user.uid;
      return proc;
    } catch (e) {
      throw new ApolloError(e);
    }
  }
}
