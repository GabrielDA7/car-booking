import { IsNotEmpty, IsInt, IsDate, Validate } from 'class-validator';
import { Transform } from 'class-transformer';
import { DateComparisonValidator } from '../validators/date-comparison.validator';
import { IsAfterNowValidator } from '../validators/date-after-now.validator';
import { MinimumDurationValidator } from '../validators/minimum-duration.validator';

export class CreateBookingDto {
  @IsNotEmpty({ message: 'Car ID is required' })
  @IsInt({ message: 'Car ID must be an integer' })
  carId: number;

  @Transform(({ value }) =>
    value ? new Date(new Date(value).toUTCString()) : undefined,
  )
  @IsNotEmpty({ message: 'Start date is required' })
  @IsDate()
  @Validate(IsAfterNowValidator)
  @Validate(DateComparisonValidator)
  @Validate(MinimumDurationValidator)
  startDate: Date;

  @Transform(({ value }) =>
    value ? new Date(new Date(value).toUTCString()) : undefined,
  )
  @IsNotEmpty({ message: 'End date is required' })
  @IsDate()
  endDate: Date;
}
