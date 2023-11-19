import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ name: 'DateAfterNow' })
export class IsAfterNowValidator implements ValidatorConstraintInterface {
  validate(date?: Date) {
    if (!date) return true;
    return Date.now() < date.getTime();
  }

  defaultMessage(args: ValidationArguments) {
    return `Date ${args.property} can not before now.`;
  }
}
