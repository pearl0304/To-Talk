import {
  Field,
  ID,
  ObjectType,
  ArgsType,
  InputType,
  registerEnumType,
} from '@nestjs/graphql';
import * as mongoose from 'mongoose';
import { Document } from 'mongoose';
import { User } from './user.schema';

export const FollowSchema = new mongoose.Schema({
  _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
  uid: String,
  following: String,
  action: String,
  date_created: String,
});

export enum Action {
  ADD,
  REMOVE,
}

export enum FollowMode {
  FOLLOWER,
  FOLLOWEE,
}

registerEnumType(Action, {
  name: 'Action',
});

registerEnumType(FollowMode, {
  name: 'FollowMode',
});

@ObjectType()
export class Follow extends Document {
  @Field(() => ID)
  id: string;

  @Field(() => ID)
  uid: string;

  @Field(() => ID)
  following: string;

  @Field(() => User)
  follower: User;

  @Field(() => User)
  followee: User;

  @Field((type) => Action)
  action: string;

  @Field(() => String)
  date_created: string;
}

@ArgsType()
@InputType()
export class FollowInputType {
  @Field({ nullable: true })
  id: string;

  @Field()
  uid: string;

  @Field()
  following: string;

  @Field(() => Action)
  action: string;
}

@ArgsType()
@InputType()
export class GetFollowListInput {
  @Field()
  uid: string;
  @Field(() => FollowMode)
  mode: string;
}
