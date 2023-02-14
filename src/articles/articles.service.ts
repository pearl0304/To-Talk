import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Article, ArticleInputType } from '../schemas/article.schema';
import { ApolloError } from 'apollo-server-express';
import moment from 'moment-timezone';

@Injectable()
export class ArticlesService {
  constructor(@InjectModel('Article') private articleModel: Model<Article>) {}

  /**
   * GET ALL ARTICLES EXCEPT WAS DELETED BY SOMEONE
   * @param offset
   * @param limit
   * @param q
   */
  async findAllArticles(offset: number, limit: number, q: string) {
    try {
      const proc = await this.articleModel
        .find({ is_deleted: false })
        .skip(offset * limit)
        .sort({ date_updated: -1, date_created: -1 })
        .limit(limit)
        .lean();

      const result = proc.map((data) => {
        return {
          id: data._id,
          ...data,
        };
      });

      return result;
    } catch (e) {
      throw new ApolloError(e);
    }
  }

  async findUserArticles(
    uid: string,
    offset: number,
    limit: number,
    q: string,
  ) {
    try {
      const proc = await this.articleModel
        .find({
          is_deleted: false,
          uid: uid,
        })
        .skip(offset * limit)
        .sort({ date_updated: -1, date_created: -1 })
        .limit(limit)
        .lean();

      const result = proc.map((data) => {
        return {
          id: data._id,
          ...data,
        };
      });

      return result;
    } catch (e) {
      throw new ApolloError(e);
    }
  }

  async findArticleById() {
    try {
    } catch (e) {
      throw new ApolloError(e);
    }
  }

  async createArticle() {
    try {
    } catch (e) {
      throw new ApolloError(e);
    }
  }

  async updateArticle() {
    try {
    } catch (e) {
      throw new ApolloError(e);
    }
  }

  async deleteArticle() {
    try {
    } catch (e) {
      throw new ApolloError(e);
    }
  }
}
