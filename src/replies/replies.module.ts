import { Module } from '@nestjs/common';
import { RepliesResolver } from './replies.resolver';
import { UsersModule } from '../users/users.module';
import { CommentsModule } from '../comments/comments.module';
import { RepliesService } from './replies.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ReplySchema } from '../schemas/reply.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Reply', schema: ReplySchema }]),
    UsersModule,
    CommentsModule,
  ],
  providers: [RepliesResolver, RepliesService],
  exports: [RepliesService],
})
export class RepliesModule {}
