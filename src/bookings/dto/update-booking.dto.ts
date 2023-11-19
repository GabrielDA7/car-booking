import { OmitType } from '@nestjs/mapped-types';
import { CreateBookingDto } from './create-booking.dto';

export class UpdateBookingDto extends OmitType(CreateBookingDto, ['carId']) {}
