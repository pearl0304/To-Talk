import { Resolver, Query, Mutation, Args, ResolveField } from '@nestjs/graphql';
import { Article, ArticleInputType } from '../schemas/article.schema';
import { ArticlesService } from './articles.service';
import { ApolloError } from 'apollo-server-express';
import { User } from '../schemas/user.schema';
import { UsersService } from '../users/users.service';
import { CurrentUser } from '../users/users.decorator';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { errorMessages } from '../errorMessages';

@Resolver(() => Article)
export class ArticlesResolver {
  constructor(
    private readonly articleService: ArticlesService,
    private readonly usersService: UsersService,
  ) {}

  @Query(() => [Article])
  async findAllArticles(
    @Args('offset') offset: number,
    @Args('limit') limit: number,
    @Args('q') q: string,
  ) {
    try {
      return await this.articleService.findAllArticles(offset, limit, q);
    } catch (e) {
      throw new ApolloError(e);
    }
  }

  @Query(() => [Article])
  async findUserArticles(
    @Args('uid') uid: string,
    @Args('offset') offset: number,
    @Args('limit') limit: number,
    @Args('q') q: string,
  ) {
    try {
      await this.usersService.findOneByUid(uid);
      return this.articleService.findUserArticles(uid, offset, limit, q);
    } catch (e) {
      throw new ApolloError(e);
    }
  }

  @Query(() => Article)
  async findArticleById(@Args('id') id: string) {
    try {
      return await this.articleService.findArticleById(id);
    } catch (e) {
      throw new ApolloError(e);
    }
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => Article)
  async createArticle(@Args('input') input: ArticleInputType) {
    try {
      return await this.articleService.createArticle(input);
    } catch (e) {
      throw new ApolloError(e);
    }
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => Article)
  async updateArticle(
    @Args('id') id: string,
    @Args('input') input: ArticleInputType,
    @CurrentUser() user: User,
  ) {
    try {
      // CHECK USER
      if (user.uid !== input.uid && user.level < 2) {
        errorMessages('004');
      }
      return await this.articleService.updateArticle(id, input);
    } catch (e) {
      throw new ApolloError(e);
    }
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => Article)
  async deleteArticle(@Args('id') id: string, @CurrentUser() user: User) {
    try {
      return await this.articleService.deleteArticle(id, user);
    } catch (e) {
      throw new ApolloError(e);
    }
  }

  /************************************
   *********** ResolveField ***********
   ************************************/

  @ResolveField()
  async writer(@CurrentUser() user: User) {
    try {
      const proc = await this.usersService.findOneByUid(user.uid);
      proc.uid = user.uid;
      return proc;
    } catch (e) {
      throw new ApolloError(e);
    }
  }
}
