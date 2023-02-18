import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { ApolloError } from 'apollo-server-express';
import moment from 'moment-timezone';
import { errorMessages } from '../errorMessages';
import {
  Comment,
  CommentFindType,
  CommentInputType,
} from '../schemas/comment.schema';
import { User } from '../schemas/user.schema';

@Injectable()
export class CommentsService {
  constructor(@InjectModel('Comment') private commentModel: Model<Comment>) {}

  /**
   * GET ONE ARTICLE'S COMMENTS LIST
   * @param articleId
   * @param offset
   * @param limit
   */
  async findCommentsList(articleId: string, offset: number, limit: number) {
    try {
      const proc = await this.commentModel
        .find({ articleId: articleId, is_deleted: false })
        .skip(offset * limit)
        .sort({ date_created: -1 })
        .limit(limit)
        .lean();

      const result = proc.map((data) => {
        return {
          id: data._id,
          ...data,
        };

        return result;
      });
    } catch (e) {
      throw new ApolloError(e);
    }
  }

  /**
   * GET ONE COMMENT BY ID
   * @param id
   */
  async findCommentByID(id: string) {
    try {
      const result = await this.commentModel
        .findOne({ _id: id, is_deleted: false })
        .lean();
      return {
        ...result,
      };
    } catch (e) {
      throw new ApolloError(e);
    }
  }

  /**
   * CREATE COMMENT
   * @param input
   */
  async createComment(input: CommentInputType) {
    try {
      const data = {
        ...input,
        date_created: moment().utc().format(),
        is_deleted: false,
        log: `${moment().utc().format()},${input.uid}, write new comment`,
      };

      const result = await this.commentModel.create(data);
      return {
        id: result._id,
        ...data,
      };
    } catch (e) {
      throw new ApolloError(e);
    }
  }

  /**
   * Update Comment
   * @param input
   */
  async updateComment(input) {
    try {
      const data = {
        ...input,
        date_updated: moment().utc().format(),
        log: `${moment().utc().format()},${input.uid}, update comment`,
      };

      await this.commentModel
        .findOneAndUpdate({ _id: input.id }, { ...data }, { new: true })
        .lean();

      return data;
    } catch (e) {
      throw new ApolloError(e);
    }
  }

  /**
   * DELETE COMMENT
   * @param id
   */
  async deleteComment(id: string) {
    try {
      const data = {
        is_deleted: true,
        date_deleted: moment().utc().format(),
        log: `${moment().utc().format()}, deleted comment`,
      };

      await this.commentModel.findOneAndUpdate(
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
