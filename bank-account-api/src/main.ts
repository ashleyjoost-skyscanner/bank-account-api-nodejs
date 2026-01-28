import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, BadRequestException } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Enable global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      exceptionFactory: (errors) => {
        const messages = errors.map(
          (error) => Object.values(error.constraints || {}).join(', ')
        );
        return new BadRequestException(messages.join('; '));
      },
    }),
  );
  
  app.enableCors();
  await app.listen(3000);
  console.log('Bank Account API running on http://localhost:3000/api/BankAccount');
}
bootstrap();
