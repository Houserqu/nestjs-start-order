import { ApiProperty } from '@nestjs/swagger';
import { Allow, IsString, IsNumber, IsBoolean } from 'class-validator';

export class FindUserDto {
  @ApiProperty()
  @IsNumber()
  userId: number;
}