import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const PORT = 9001;
  await app.listen(PORT).then(() => {
    console.log(`http://localhost:9001`);
  });
}

bootstrap();
