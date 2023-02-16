/**
 * level 1 : 일반 유저 (default)
 * level 2 : 관리자 (수정, 삭제 권한)
 * level 3 : 수퍼관리자 (수정, 삭제, 권한 변경)
 * **/

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
import { IsEmail } from 'class-validator';

export const UserSchema = new mongoose.Schema({
  _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
  email: String,
  password: String,
  displayName: String,
  photoURL: String,
  intro: String,
  level: Number,
  updated_by: String,
  deleted_by: String,
  access_token: String,
  deleted: Boolean,
  date_created: String,
  date_updated: String,
  date_deleted: String,
});

@ObjectType()
export class User extends Document {
  @Field(() => ID)
  uid: string;

  @Field(() => String)
  email: string;

  @Field(() => String)
  displayName: string;

  @Field(() => String, { nullable: true })
  photoURL: string;

  @Field(() => String, { nullable: true })
  intro: string;

  @Field(() => Int, { nullable: true })
  level: number;

  @Field(() => Boolean, { nullable: true })
  deleted: boolean;

  @Field(() => ID, { nullable: true })
  updated_by: string;

  @Field(() => ID, { nullable: true })
  deleted_by: string;

  @Field(() => User, { nullable: true })
  updater: User;

  @Field(() => User, { nullable: true })
  deleter: User;

  @Field(() => String, { nullable: true })
  access_token: string;

  @Field(() => String, { nullable: true })
  date_created: string;

  @Field(() => String, { nullable: true })
  date_updated: string;

  @Field(() => String, { nullable: true })
  date_deleted: string;

  password: string;
}

@ArgsType()
@InputType()
export class UserInputType {
  @IsEmail()
  @Field()
  email: string;

  @Field()
  displayName: string;

  @Field({ nullable: true })
  photoURL: string;

  @Field({ nullable: true })
  intro: string;

  @Field()
  password1: string;

  @Field()
  password2: string;
}

@ArgsType()
@InputType()
export class UserLoginInputType {
  @IsEmail()
  @Field()
  email: string;

  @Field()
  password: string;
}

@ArgsType()
@InputType()
export class UserUpdateInputType {
  @Field({ nullable: true })
  displayName: string;

  @Field({ nullable: true })
  photoURL: string;

  @Field({ nullable: true })
  intro: string;

  @Field({ nullable: true })
  password1: string;

  @Field({ nullable: true })
  password2: string;

  @Field({ nullable: true })
  password: string;
}
