import { CustomError } from "./custom_error";

export class BadRequestError extends CustomError {
  public statusCode = 400;

  constructor(public error: string) {
    super(error);

    // Only because we are extending a built in class
    Object.setPrototypeOf(this, BadRequestError.prototype);
  }

  public serializeErrors() {
    return [{ message: this.error }];
  }
}