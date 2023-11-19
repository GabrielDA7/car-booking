import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';

@ValidatorConstraint({ name: 'MinimumDurationValidator', async: false })
export class MinimumDurationValidator implements ValidatorConstraintInterface {
  validate(startDate: Date | undefined, args: ValidationArguments) {
    const endDate = args.object['endDate'];
    if (!startDate || !endDate) return true;
    const minimumDuration = 60 * 60 * 1000;
    return endDate.getTime() - startDate.getTime() >= minimumDuration;
  }

  defaultMessage() {
    return 'There must be at least 1 hour of duration between start date and end date';
  }
}
