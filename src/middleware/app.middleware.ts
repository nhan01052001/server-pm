import { Injectable, NestMiddleware } from '@nestjs/common';
import express, { Request, Response, NextFunction } from 'express';

@Injectable()
export class AppMiddleware implements NestMiddleware {
  use(_req: Request, _res: Response, next: NextFunction) {
    console.log('Request...');
    next();
  }
}