import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as express from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
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

// 1) ავტორიზაცია რეგისტრაცია ისევე როგორც ლექციაზე ვქენით
// 2) isAuthGuard ის გაკეთება,
// 3) რელაცია კოლექციებს შორის, ვგულისხმობ სანამ სისტემაში არ შეხვალ ანუ ტოკენი არ გექნება მანამდე არ უნდა გქონდეს ხარჯების კოლექციაზე ქრადის ტიპის ოპერაციების ჩატარება
