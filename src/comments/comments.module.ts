import { Module } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CommentsResolver } from './comments.resolver';
import { CommentSchema } from '../schemas/comment.schema';
import { UsersModule } from '../users/users.module';
import { ArticlesModule } from '../articles/articles.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ReplySchema } from '../schemas/reply.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Comment', schema: CommentSchema },
      { name: 'Reply', schema: ReplySchema },
    ]),
    UsersModule,
    ArticlesModule,
  ],
  providers: [CommentsService, CommentsResolver],
  exports: [CommentsService],
})
export class CommentsModule {}
