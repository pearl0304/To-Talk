import { Module } from '@nestjs/common';
import { ArticlesService } from './articles.service';
import { MulterModule } from '@nestjs/platform-express';
import { UsersModule } from '../users/users.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ArticleSchema } from '../schemas/article.schema';
import { CommentSchema } from '../schemas/comment.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Article', schema: ArticleSchema },
      { name: 'Comment', schema: CommentSchema },
    ]),
    UsersModule,
    MulterModule.register({
      dest: './upload',
    }),
  ],
  providers: [ArticlesService],
  exports: [ArticlesService],
})
export class ArticlesModule {}
