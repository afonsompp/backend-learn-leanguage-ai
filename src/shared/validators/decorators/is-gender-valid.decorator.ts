import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ async: false })
export class IsGenderValidConstraint implements ValidatorConstraintInterface {
  validate(gender: any): boolean {
    return gender === 'male' || gender === 'female';
  }

  defaultMessage(): string {
    return 'Gender must be either "male" or "female"';
  }
}

export function IsGenderValid(validationOptions?: ValidationOptions) {
  return function (object: NonNullable<unknown>, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsGenderValidConstraint,
    });
  };
}
