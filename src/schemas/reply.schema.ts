import { Field, ID, ObjectType, ArgsType, InputType } from '@nestjs/graphql';
import * as mongoose from 'mongoose';
import { Document } from 'mongoose';

export const ReplySchema = new mongoose.Schema({
  _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
  uid: String,
  commentId: String,
  reply: String,
  date_created: String,
  date_updated: String,
  date_deleted: String,
  is_deleted: Boolean,
  log: String,
});

@ObjectType()
export class Reply extends Document {
  @Field(() => ID)
  id: string;

  @Field(() => ID)
  uid: string;

  @Field(() => ID)
  commentId: string;

  @Field(() => ID)
  reply: string;

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
export class ReplyInputType {
  @Field(() => ID, { nullable: true })
  id: string;

  @Field(() => ID)
  uid: string;

  @Field(() => ID)
  commentId: string;

  @Field(() => ID)
  reply: string;
}
