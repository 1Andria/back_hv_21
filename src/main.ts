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

// თქვენი დავალება შემდეგია,  წინა დავალება სადაც უკვე გაქვთ იუზერების და ხარჯების ქრადები შეეცადეთ დააინტეგრიროთ სტრაიპის გადახდები.

// 1) გააკეთე stripe მოდული თავისი კონტროლერით თავისი სერვისი
// 2) უნდა გქონდეთ /create-payment და /webhook ენდპოინთები
// 3) /create-payment ზე აუცულებელია გადმოსცეთ იუზერის აიდი და
//  შქმენით სტრაიპის ქასთომერი როგორც ვქნით ლექციაზე.
// 4) /webhook ზე უბრალოდ დალოგეთ წარმატებული და წარუმატებელი
//  რექუესთები სამომავლოდ ჩავაშენებთ ბაზას.
// ვინც სტრაპს გამოიყენებს დისქორდზე ნახეთ რესურსებში არის ყველა
//  ის დიფენდენსი რაც გჭირდებათ.
