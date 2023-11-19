import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Booking } from './entities/booking.entity';
import { LessThanOrEqual, MoreThanOrEqual, Repository } from 'typeorm';
import { CarsService } from '../cars/cars.service';
import { Car } from '../cars/entities/car.entity';

@Injectable()
export class BookingsService {
  constructor(
    @InjectRepository(Booking)
    private readonly bookingRepository: Repository<Booking>,
    private readonly carsService: CarsService,
  ) {}

  private async checkCarAvailability(
    car: Car,
    startDate: Date,
    endDate: Date,
  ): Promise<void> {
    const existingBookings = await this.bookingRepository.find({
      where: {
        car: {
          id: car.id,
        },
        endDate: MoreThanOrEqual(startDate),
        startDate: LessThanOrEqual(endDate),
      },
    });

    if (existingBookings.length !== 0) {
      throw new ConflictException('Unavailable car');
    }
  }

  async create(createBookingDto: CreateBookingDto) {
    const car = await this.carsService.findOne(createBookingDto.carId);
    await this.checkCarAvailability(
      car,
      createBookingDto.startDate,
      createBookingDto.endDate,
    );
    const booking = this.bookingRepository.create({ ...createBookingDto, car });
    return await this.bookingRepository.save(booking);
  }

  async findOne(id: number) {
    const booking = await this.bookingRepository.findOne({
      where: { id },
    });
    if (!booking) {
      throw new NotFoundException(`Booking with ID ${id} not found`);
    }
    return booking;
  }

  update(id: number, updateBookingDto: UpdateBookingDto) {
    return `This action updates a #${id} booking`;
  }

  cancel(id: number) {
    return `This action removes a #${id} booking`;
  }
}
