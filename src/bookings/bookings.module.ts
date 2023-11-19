import { Module } from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { BookingsController } from './bookings.controller';
import { CarsModule } from '../cars/cars.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Booking } from './entities/booking.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Booking]), CarsModule],
  controllers: [BookingsController],
  providers: [BookingsService],
})
export class BookingsModule {}
