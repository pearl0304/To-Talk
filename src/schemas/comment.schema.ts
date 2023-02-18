import {
  Field,
  ID,
  ObjectType,
  ArgsType,
  InputType,
  Int,
} from '@nestjs/graphql';
import * as mongoose from 'mongoose';
import { Document } from 'mongoose';
import { User } from './user.schema';
import { Article } from './article.schema';

export const CommentSchema = new mongoose.Schema({
  _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
  uid: String,
  articleId: String,
  comment: String,
  date_created: String,
  date_updated: String,
  date_deleted: String,
  is_deleted: Boolean,
  log: String,
});

@ObjectType()
export class Comment extends Document {
  @Field(() => ID)
  id: string;

  @Field(() => ID)
  uid: string;

  @Field(() => ID)
  articleId: string;

  @Field(() => ID)
  comment: string;

  @Field(() => ID, { nullable: true })
  date_created: string;

  @Field(() => ID, { nullable: true })
  date_updated: string;

  @Field(() => ID, { nullable: true })
  date_deleted: string;

  @Field(() => ID, { nullable: true })
  is_deleted: string;

  @Field(() => ID, { nullable: true })
  log: string;
}

@ArgsType()
@InputType()
export class CommentInputType {
  @Field(() => ID, { nullable: true })
  id: string;

  @Field(() => ID)
  uid: string;

  @Field(() => ID)
  articleId: string;

  @Field(() => ID)
  comment: string;
}

@ArgsType()
@InputType()
export class CommentFindType {
  @Field(() => ID, { nullable: true })
  id: string;

  @Field(() => ID, { nullable: true })
  articleId: string;
}
