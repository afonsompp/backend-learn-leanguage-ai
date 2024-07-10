import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

@Injectable()
export class HttpRequestInterceptor implements NestMiddleware {
  private logger = new Logger(HttpRequestInterceptor.name);
  use(req: Request, res: Response, next: NextFunction) {
    const startTime = Date.now();
    const { method, originalUrl } = req;

    this.logger.log(`[${method} ${originalUrl}] Request received`);

    next();

    res.on('finish', () => {
      const duration = Date.now() - startTime;

      this.logger.log(
        `[${method} ${originalUrl}] Request completed in ${duration}ms`,
      );
    });
  }
}
