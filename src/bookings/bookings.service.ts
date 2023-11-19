import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Booking } from './entities/booking.entity';
import {
  DataSource,
  LessThanOrEqual,
  MoreThanOrEqual,
  Not,
  Repository,
} from 'typeorm';
import { CarsService } from '../cars/cars.service';
import { Car } from '../cars/entities/car.entity';

@Injectable()
export class BookingsService {
  constructor(
    @InjectRepository(Booking)
    private readonly bookingRepository: Repository<Booking>,
    private readonly carsService: CarsService,
    private readonly dataSource: DataSource,
  ) {}

  private async checkCarAvailability(
    car: Car,
    startDate: Date,
    endDate: Date,
    options?: {
      exception?: number;
      transactionalRepository?: Repository<Booking>;
    },
  ): Promise<void> {
    const manager = options?.transactionalRepository
      ? options.transactionalRepository
      : this.bookingRepository;

    const condition = options?.exception
      ? { id: Not(options?.exception) }
      : undefined;

    const existingBookings = await manager.find({
      where: {
        car: {
          id: car.id,
        },
        ...condition,
        endDate: MoreThanOrEqual(startDate),
        startDate: LessThanOrEqual(endDate),
      },
    });

    if (existingBookings.length !== 0) {
      throw new ConflictException('Unavailable car');
    }
  }

  async create(createBookingDto: CreateBookingDto) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    const repository = queryRunner.manager.getRepository(Booking);
    try {
      const car = await this.carsService.findOne(createBookingDto.carId);
      await this.checkCarAvailability(
        car,
        createBookingDto.startDate,
        createBookingDto.endDate,
        { transactionalRepository: repository },
      );
      const booking = this.bookingRepository.create({
        ...createBookingDto,
        car,
      });
      const savedBooking = await repository.save(booking);
      await queryRunner.commitTransaction();
      return savedBooking;
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  async findOne(id: number) {
    const booking = await this.bookingRepository.findOne({
      where: { id },
      relations: {
        car: true,
      },
    });
    if (!booking) {
      throw new NotFoundException(`Booking with ID ${id} not found`);
    }
    return booking;
  }

  async update(id: number, updateBookingDto: UpdateBookingDto) {
    const booking = await this.findOne(id);
    if (booking.hasPassed()) {
      throw new ForbiddenException('Booking has passed');
    }

    await this.checkCarAvailability(
      booking.car,
      updateBookingDto.startDate,
      updateBookingDto.endDate,
      { exception: id },
    );

    Object.assign(booking, updateBookingDto);
    return this.bookingRepository.save(booking);
  }

  async cancel(id: number) {
    const booking = await this.findOne(id);
    if (booking.hasPassed()) {
      throw new ForbiddenException('Booking has passed');
    }

    const result = await this.bookingRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Booking with ID ${id} not found`);
    }

    return { message: 'Booking successfully canceled' };
  }
}
