import { Module } from '@nestjs/common';
import { ArticlesService } from './articles.service';

@Module({
  providers: [ArticlesService],
})
export class ArticlesModule {}
