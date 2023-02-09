import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import {
  Follow,
  FollowInputType,
  GetFollowListInput,
} from '../schemas/follow.schema';
import { ApolloError } from 'apollo-server-express';
import moment from 'moment-timezone';

@Injectable()
export class FollowService {
  constructor(@InjectModel('Follow') private followModel: Model<Follow>) {}

  /**
   * FIND FOLLOW DOC
   * @param uid
   * @param following
   */
  async findFollow(uid: string, following: string) {
    try {
      const result = await this.followModel
        .findOne({
          uid: uid,
          following: following,
        })
        .lean();

      return result;
    } catch (e) {
      throw new ApolloError(e);
    }
  }

  /**
   * GET USER'S FOLLOW OR FOLLOWING LIST
   * @param input
   * @param offset
   * @param limit
   * @param q
   */
  async getFollowList(
    input: GetFollowListInput,
    offset: number,
    limit: number,
    q: string,
  ) {
    try {
      let condition = {};
      if (input.mode == 'FOLLOWER') {
        condition = { following: input.uid };
      } else {
        condition = { uid: input.uid };
      }
      const pdoc = await this.followModel
        .find(condition)
        .skip(offset * limit)
        .sort({ date_created: -1 })
        .limit(limit)
        .lean();

      const result = pdoc.map((data) => {
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
   * DO  FOLLOW OR UNFOLLOW
   * @param input
   */
  async doFollow(input: FollowInputType) {
    try {
      if (input.action === 'ADD') {
        //  IF A USER ALREADY FOLLOWED, DELETE THE DOCUMENT.
        const check_duplicated = await this.findFollow(
          input.uid,
          input.following,
        );
        if (check_duplicated)
          await this.followModel.deleteOne({ _id: input.id });

        // ADD DOCUMENT.
        const data = {
          ...input,
          date_created: moment().utc().format(),
        };

        const result = await this.followModel.create(data);
        return {
          id: result._id,
          ...data,
        };
      } else {
        await this.followModel.deleteOne({ _id: input.id });
      }
    } catch (e) {
      throw new ApolloError(e);
    }
  }
}
