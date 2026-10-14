import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import { ValidationError } from '../shared/errors/AppError';

export const validate = (req: Request, _res: Response, next: NextFunction): void => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const messages = errors
      .array()
      .map((e) => `${e.type === 'field' ? (e as any).path + ': ' : ''}${e.msg}`)
      .join('; ');
    return next(new ValidationError(messages));
  }
  next();
};
