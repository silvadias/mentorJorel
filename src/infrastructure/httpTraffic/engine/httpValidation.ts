export interface HttpTrafficSchemaValidator {
  validate(
    data: unknown, 
    schema: unknown

    ):{ 
      success: boolean;
      errors?: string[]; 
      data?: any

    };
  }

export class ValidationException extends Error {
  public readonly errors: string[];

  constructor(
      errors: string[]

    ){
    super('HTTP Request validation failed at infrastructure border.');
    this.name = 'ValidationException';
    this.errors = errors;
    Object.setPrototypeOf(this, ValidationException.prototype);

  }
}
