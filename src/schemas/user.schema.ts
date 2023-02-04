import { Field, ID, ObjectType, ArgsType, InputType } from '@nestjs/graphql';
import * as mongoose from 'mongoose';
import { Document } from 'mongoose';

export const UserSchema = new mongoose.Schema({
  _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
  email: String,
  password: String,
  displayName: String,
  photoURL: String,
  intro: String,
  access_token: String,
  date_created: String,
  date_updated: String,
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

  @Field(() => String, { nullable: true })
  date_created: string;

  @Field(() => String, { nullable: true })
  date_updated: string;

  @Field(() => String, { nullable: true })
  access_token: string;
  password: string;
}

@ArgsType()
@InputType()
export class UserInputType {
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
  @Field()
  email: string;

  @Field()
  password: string;
}
