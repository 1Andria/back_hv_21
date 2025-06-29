import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

@Injectable()
export class InfoMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const reqTime = Date.now();

    res.on(`finish`, () => {
      const timeForServer = Date.now() - reqTime;
      console.log(
        `method:${req.method},url:${req.url}, statusCode:${res.statusCode} timeForResponse:${timeForServer}`,
      );
    });
    next();
  }
}

// 1) დაამატეთ გლობალური მიდლვიარი რომელიც დალოგავს რომელ ენდფოინთზე დაარექუესთა, რა მეთოდით დაარექუესთა, სერვერს რა დრო დასჭირდა პასუხის გასაცემად და რა სტატუს კოდით დაუბრუნა პასუხი.
// მინიშნება გამოიყენეთ res.on('finish', () => {}) - ეს ფუნქცია გაეშვება მაშინ როცა რექუესთი დასრულდება სწორედ ეგ გჭირდებათ.
