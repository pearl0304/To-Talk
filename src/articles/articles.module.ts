import { Module } from '@nestjs/common';
import { ArticlesService } from './articles.service';
import { MulterModule } from '@nestjs/platform-express';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    UsersModule,
    MulterModule.register({
      dest: './upload',
    }),
  ],
  providers: [ArticlesService],
})
export class ArticlesModule {}
