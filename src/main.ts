import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as express from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: process.env.FRONT_URL,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );
  app.use('/stripe/webhook', express.raw({ type: 'application/json' }));
  await app.listen(process.env.PORT ?? 3005);
}
bootstrap();

// 2) როლების მიხედვით დაამატეთ ახალი ფეიჯი /analytics რომელზეც მხოლოდ მაშინ შეგეძლება გადასვლა თუ admin როლი აქვს იუზერს
// 3) /analytics ზე გამოაჩნიეთ ლამაზი ჩარტები, ინფორმაცია რათქმაუნდა ბექენდიდან მოგივათ.
// 4) დაამატეთ პოსტების შექმნის ფიჩერი ანუ იუზერს შეეძლოს პოსტების დაწერა

// Shadcn-ს აქვს ლამაზი ჩარტები და ეგ გამოიყენეთ ფრონტში.

// გამოიყენეთ: Nextjs, ShadcsUI, react-hook-form, yup, axios
