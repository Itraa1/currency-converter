import { Request } from 'express';

declare global {
  namespace Express {
    interface Request {
      userIdCookie?: string;
      user?: User;
    }
  }
}