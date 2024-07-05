import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

@Injectable()
export class LoggingMiddleware implements NestMiddleware {
  private logger = new Logger('HttpRequestInterceptor');
  use(req: Request, res: Response, next: NextFunction) {
    const startTime = Date.now();
    const { method, originalUrl } = req;

    this.logger.log(`[${method} ${originalUrl}] Request received`);

    next();

    res.on('close', () => {
      const duration = Date.now() - startTime;

      this.logger.log(
        `[${method} ${originalUrl}] Request completed in ${duration}ms`,
      );
    });
  }
}
