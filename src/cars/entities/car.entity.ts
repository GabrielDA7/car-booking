import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('cars')
export class Car {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'name', length: 255, nullable: false })
  model: string;
}
