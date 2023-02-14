import { Module } from '@nestjs/common';
import { ArticlesService } from './articles.service';
import { MulterModule } from '@nestjs/platform-express';

@Module({
  imports: [
    MulterModule.register({
      dest: './upload',
    }),
  ],
  providers: [ArticlesService],
})
export class ArticlesModule {}
