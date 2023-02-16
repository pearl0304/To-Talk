import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Article, ArticleInputType } from '../schemas/article.schema';
import { ApolloError } from 'apollo-server-express';
import moment from 'moment-timezone';
import { errorMessages } from '../errorMessages';
import { User } from '../schemas/user.schema';

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

  /**
   * GET ONE USER'S ARTICLES
   * @param uid
   * @param offset
   * @param limit
   * @param q
   */
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

  /**
   * GET ONE ARTICLE
   * @param id
   */
  async findArticleById(id: string) {
    try {
      const proc = this.articleModel.findOne({ _id: id }).lean();
      if (!proc) errorMessages('006');
      const result = {
        id: id,
        ...proc,
      };
      return result;
    } catch (e) {
      throw errorMessages('006');
    }
  }

  /**
   * CRATE ARTICLE
   * @param input
   */
  async createArticle(input: ArticleInputType) {
    try {
      const data = {
        ...input,
        date_created: moment().utc().format(),
        log: `${moment().utc().format()},${input.uid},write new article`,
      };
      const result = await this.articleModel.create(data);
      return {
        id: result._id,
        ...data,
      };
    } catch (e) {
      throw new ApolloError(e);
    }
  }

  /**
   * UPDATE ARTICLE
   * @param id
   * @param input
   */
  async updateArticle(id: string, input: ArticleInputType) {
    try {
      // CHECK THERE IS ARTICLE
      const article = await this.findArticleById(id);

      // CHECK USER
      if (article.uid !== input.uid) {
        errorMessages('004');
      }

      const data = {
        ...input,
        date_updated: moment().utc().format(),
        log: `${moment().utc().format()},${input.uid}, update article`,
      };

      await this.articleModel.findOneAndUpdate(
        { _id: id },
        { ...data },
        { new: true },
      );

      return {
        id: id,
        ...data,
      };
    } catch (e) {
      throw new ApolloError(e);
    }
  }

  /**
   * DELETE ARTICLE
   * @param id
   * @param user
   */
  async deleteArticle(id: string, user: User) {
    try {
      const proc = await this.findArticleById(id);

      // CHECK USER
      if (proc.uid !== user.uid && user.level !== 3) {
        errorMessages('004');
      }

      const data = {
        date_deleted: moment().utc().format(),
        is_deleted: true,
        log: `${moment().utc().format()},${user.uid}, delete article`,
      };

      await this.articleModel.findOneAndUpdate(
        { _id: id },
        { ...data },
        { new: true },
      );

      return id;
    } catch (e) {
      throw new ApolloError(e);
    }
  }
}
