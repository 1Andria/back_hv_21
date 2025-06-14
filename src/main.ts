import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(process.env.PORT ?? 3005);
}
bootstrap();

// 3) უნდა გქონდეთ იქსფენსების მოდული სადაც გააკეთებთ ქრადის ტიპის ოპერაციებს.
// თითეულ იქსფენსს უნდა ქონდეს შემდეგი ტიპის ფროფერთიები:
// id-ეს სისტემამ უნდა მიანიჭოს ავტომატურად როგორც შვებით ხოლმე. category, productName, quantity, price, totalPrice-ეს ავტომატურად უნდა გამოითვალოს რაოდენობის და ფასის ხარჯზე.
// ორივე ინფორმაცია შეინახეთ ცვლადებში როგორც ლექციაზე ვქენით
