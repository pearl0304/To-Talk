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

export const ArticleSchema = new mongoose.Schema({
  _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
  uid: String,
  title: String,
  content: String,
  file_path: String,
  is_deleted: Boolean,
  date_created: String,
  date_updated: String,
  date_deleted: String,
});

@ObjectType()
export class Article extends Document {
  @Field(() => ID)
  id: string;

  @Field(() => ID)
  uid: string;

  @Field(() => User)
  writer: User;

  @Field(() => String)
  title: string;

  @Field(() => String)
  content: string;

  @Field(() => String, { nullable: true })
  file_path: string;

  @Field(() => Boolean, { nullable: true })
  is_deleted: string;

  @Field(() => String, { nullable: true })
  date_created: string;

  @Field(() => String, { nullable: true })
  date_updated: string;

  @Field(() => String, { nullable: true })
  date_deleted: string;
}

@ArgsType()
@InputType()
export class ArticleInputType {
  @Field(() => ID)
  uid: string;

  @Field(() => String)
  title: string;

  @Field(() => String)
  content: string;

  @Field(() => String, { nullable: true })
  file_path: string;
}
