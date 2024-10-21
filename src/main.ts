import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Enable global validation pipe
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,  // Strips any properties that are not defined in the DTO
    forbidNonWhitelisted: true,  // Throws error if non-whitelisted properties are passed
    transform: true,  // Automatically transform payloads to be objects typed according to their DTOs
  }));

  await app.listen(process.env.PORT ?? 8080);
}
bootstrap();