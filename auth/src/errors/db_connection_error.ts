import { CustomError } from "./custom_error";

export class DBConnectionError extends CustomError {
  public reason = 'Error connecting to database';
  public statusCode = 500;

  constructor() {
    super('Error connecting to database');

    // Only because we are extending a built in class
    Object.setPrototypeOf(this, DBConnectionError.prototype);
  }

  public serializeErrors() {
    return [{ message: this.reason }];
  }
}