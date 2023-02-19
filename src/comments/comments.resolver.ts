import { Resolver, Query, Mutation, Args, ResolveField } from '@nestjs/graphql';
import { Comment, CommentInputType } from '../schemas/comment.schema';
import { ArticlesService } from '../articles/articles.service';
import { UsersService } from '../users/users.service';
import { ApolloError } from 'apollo-server-express';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CommentsService } from './comments.service';
import { CurrentUser } from '../users/users.decorator';
import { User } from '../schemas/user.schema';
import { errorMessages } from '../errorMessages';

@Resolver(() => Comment)
export class CommentsResolver {
  constructor(
    private readonly commentsService: CommentsService,
    private readonly articlesService: ArticlesService,
    private readonly usersService: UsersService,
  ) {}

  @Query(() => [Comment])
  async findCommentsList(
    @Args('articleId') articleId: string,
    @Args('offset') offset: number,
    @Args('limit') limit: number,
  ) {
    try {
      await this.articlesService.findArticleById(articleId);
      return this.commentsService.findCommentsList(articleId, offset, limit);
    } catch (e) {
      throw new ApolloError(e);
    }
  }

  @Query(() => Comment)
  async findCommentByID(
    @Args('id') id: string,
    @Args('articleId') articleId: string,
  ) {
    try {
      await this.articlesService.findArticleById(articleId);
      return await this.commentsService.findCommentByID(id);
    } catch (e) {
      throw new ApolloError(e);
    }
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => Comment)
  async createComment(@Args('input') input: CommentInputType) {
    try {
      await this.articlesService.findArticleById(input.articleId);
      return await this.commentsService.createComment(input);
    } catch (e) {
      throw new ApolloError(e);
    }
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => Comment)
  async updateComment(
    @Args('input') input: CommentInputType,
    @CurrentUser('user') user: User,
  ) {
    try {
      await this.articlesService.findArticleById(input.articleId);
      if (user.uid !== input.uid && user.level < 2) {
        errorMessages('004');
      }
      return await this.commentsService.updateComment(input);
    } catch (e) {
      throw new ApolloError(e);
    }
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => Comment)
  async deleteComment(@Args('id') id: string, @CurrentUser('user') user: User) {
    try {
      return await this.commentsService.deleteComment(id);
    } catch (e) {
      throw new ApolloError(e);
    }
  }
}
