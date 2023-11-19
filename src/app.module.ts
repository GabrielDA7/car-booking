import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CarsModule } from './cars/cars.module';
import { Car } from './cars/entities/car.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'db/sql',
      synchronize: true,
      entities: [Car],
    }),
    CarsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
