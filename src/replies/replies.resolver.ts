import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { ApolloError } from 'apollo-server-express';
import { RepliesService } from './replies.service';
import { Reply, ReplyInputType } from '../schemas/reply.schema';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../users/users.decorator';
import { User } from '../schemas/user.schema';
import { errorMessages } from '../errorMessages';

@Resolver(() => Reply)
export class RepliesResolver {
  constructor(private readonly repliesService: RepliesService) {}

  @Query(() => [Reply])
  async findCommentReplyList(
    @Args('commentId') commentId: string,
    @Args('offset') offset: number,
    @Args('limit') limit: number,
  ) {
    try {
      return await this.repliesService.findCommentReplyList(
        commentId,
        offset,
        limit,
      );
    } catch (e) {
      throw new ApolloError(e);
    }
  }

  @Query(() => Reply)
  async findReply(@Args('id') id: string) {
    try {
      return await this.repliesService.findReplyById(id);
    } catch (e) {
      throw new ApolloError(e);
    }
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => Reply)
  async createReply(
    @Args('input') input: ReplyInputType,
    @CurrentUser('user') user: User,
  ) {
    try {
      if (user.uid !== input.uid && user.level < 2) {
        errorMessages('004');
      }
      return await this.repliesService.createReply(input);
    } catch (e) {
      throw new ApolloError(e);
    }
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => Reply)
  async updateReply(
    @Args('input') input: ReplyInputType,
    @CurrentUser('user') user: User,
  ) {
    try {
      if (user.uid !== input.uid && user.level < 2) {
        errorMessages('004');
      }
      return await this.repliesService.updateReply(input);
    } catch (e) {
      throw new ApolloError(e);
    }
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => Reply)
  async deleteReply(@Args('id') id: string) {
    try {
      return await this.repliesService.deleteReply(id);
    } catch (e) {
      throw new ApolloError(e);
    }
  }
}
