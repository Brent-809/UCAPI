import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import * as requestIp from 'request-ip';

@Injectable()
export class RequestIpMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const ipAddress = requestIp.getClientIp(req);
    req['ipAddress'] = ipAddress; // Assign the IP address to a custom property on the request object
    next();
  }
}
