import { Module } from '@nestjs/common';
import { FollowService } from './follow.service';
import { MongooseModule } from '@nestjs/mongoose';
import { FollowSchema } from '../schemas/follow.schema';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Follow', schema: FollowSchema }]),
    UsersModule,
  ],

  providers: [FollowService],
  exports: [FollowService],
})
export class FollowModule {}
