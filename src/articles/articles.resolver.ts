import { Resolver, Query, Mutation, Args, ResolveField } from '@nestjs/graphql';
import { Article } from '../schemas/article.schema';
import { ArticlesService } from './articles.service';
import { ApolloError } from 'apollo-server-express';
import { User } from '../schemas/user.schema';
import { UsersService } from '../users/users.service';
import { CurrentUser } from '../users/users.decorator';

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
      return this.articleService.findAllArticles(offset, limit, q);
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
  async findArticleById() {
    try {
      return this.articleService.findArticleById();
    } catch (e) {
      throw new ApolloError(e);
    }
  }

  @Mutation(() => Article)
  async createArticle() {
    try {
      return this.articleService.createArticle();
    } catch (e) {
      throw new ApolloError(e);
    }
  }

  @Mutation(() => Article)
  async updateArticle() {
    return this.articleService.updateArticle();
    try {
    } catch (e) {
      throw new ApolloError(e);
    }
  }

  @Mutation(() => Article)
  async deleteArticle() {
    return this.articleService.deleteArticle();
    try {
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
