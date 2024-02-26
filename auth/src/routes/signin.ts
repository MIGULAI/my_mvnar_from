import express, { Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import { RequestValidationError } from '../errors/request_validation_error';
import { validationRequest } from '../middlewares/validation_middleware';

const router = express.Router();

router.post('/api/users/signin', [
  body('email')
    .isEmail()
    .withMessage('Email must be valid'),
  body('password')
    .trim()
    .notEmpty()
    .withMessage('You must supply a password')
], validationRequest, (req: Request, res: Response) => {

  return res.send('Hi there!');
});

export { router as signInRouter };
