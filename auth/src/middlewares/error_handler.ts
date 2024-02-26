import { Request, Response, NextFunction } from 'express';
import { CustomError } from '../errors/custom_error';

export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
  console.log('Something went wrong', err);
  if (err instanceof CustomError) {
    return res.status(err.statusCode).send({
      errors: err.serializeErrors()
    });
  } 
  
  return res.status(500).send({
    errors: [
      {
        message: 'Something went wrong'
      }
    ]
  });
};