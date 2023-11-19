import { IsNotEmpty, IsString } from 'class-validator';

export class CreateCarDto {
  @IsNotEmpty({ message: 'Model is required' })
  @IsString()
  model: string;
}
