import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ name: 'DateComparison', async: false })
export class DateComparisonValidator implements ValidatorConstraintInterface {
  validate(startDate: Date | undefined, args: ValidationArguments) {
    const endDate = args.object['endDate'];
    if (!startDate || !endDate) return true;
    return startDate < endDate;
  }

  defaultMessage() {
    return 'Start date must be before end date';
  }
}
