import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Car } from '../../cars/entities/car.entity';

@Entity('bookings')
export class Booking {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'start_date', type: 'datetime', nullable: false })
  startDate: Date;

  @Column({ name: 'end_date', type: 'datetime', nullable: false })
  endDate: Date;

  @ManyToOne(() => Car, (car) => car.bookings, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'car_id' })
  car: Car;
}
