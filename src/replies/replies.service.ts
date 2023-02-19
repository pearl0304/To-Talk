import { Injectable } from '@nestjs/common';
import { ApolloError } from 'apollo-server-express';
import { Reply, ReplyInputType } from '../schemas/reply.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { errorMessages } from '../errorMessages';
import moment from 'moment-timezone';

@Injectable()
export class RepliesService {
  constructor(@InjectModel('Reply') private replyModel: Model<Reply>) {}

  async findCommentReplyList(commentId: string, offset: number, limit: number) {
    try {
      const proc = await this.replyModel
        .find({
          commentId: commentId,
          is_deleted: false,
        })
        .skip(offset * limit)
        .sort({ date_created: -1 })
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

  async findReplyById(id: string) {
    try {
      const result = await this.replyModel.findById({ _id: id }).lean();
      if (!result) errorMessages('008');
      return {
        id: result._id,
        ...result,
      };
    } catch (e) {
      errorMessages('008');
    }
  }

  async createReply(input: ReplyInputType) {
    try {
      const data = {
        ...input,
        date_created: moment().utc().format(),
        is_deleted: false,
        log: `${moment().utc().format()}, ${input.uid} create reply`,
      };

      const result = await this.replyModel.create(data);
      return {
        id: result._id,
        ...data,
      };
    } catch (e) {
      throw new ApolloError(e);
    }
  }

  async updateReply(input: ReplyInputType) {
    try {
      const data = {
        ...input,
        date_updated: moment().utc().format(),
        log: `${moment().utc().format()},${input.uid}, update comment`,
      };

      await this.replyModel
        .findOneAndUpdate({ _id: input.id }, { ...data }, { new: true })
        .lean();

      return data;
    } catch (e) {
      throw new ApolloError(e);
    }
  }

  async deleteReply(id: string) {
    try {
      const data = {
        is_deleted: true,
        date_deleted: moment().utc().format(),
        log: `${moment().utc().format()}, deleted comment`,
      };

      await this.replyModel.findOneAndUpdate(
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
