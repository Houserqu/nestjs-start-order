import { ApiProperty } from '@nestjs/swagger';
import { Allow, IsString, IsNumber } from 'class-validator';

export class CreateUserDto {
  @ApiProperty()
  @IsString()
  phone: string;

  @ApiProperty()
  @IsString()
  nickname: string;

  @ApiProperty({default: '123456'})
  @IsString()
  msgCode: string;

  @ApiProperty({default: 'U2FsdGVkX18yHjKX2XTC1JfJUZTFjEiSzOwmRxwYgxgVxrdKkPdd2g=='})
  @IsString()
  msgStr: string;

  @ApiProperty()
  @IsString()
  password: string;

  @ApiProperty()
  @IsString()
  remark: string;

  @ApiProperty()
  @IsNumber()
  type: number

  @ApiProperty()
  @IsString()
  openid: string;

  @ApiProperty()
  @IsString()
  unionid: string;

  @ApiProperty()
  @IsString()
  country: string;

  @ApiProperty()
  @IsString()
  province: string;

  @ApiProperty()
  @IsString()
  city: string;

  @ApiProperty()
  @IsNumber()
  gender: number

  @ApiProperty()
  @IsString()
  avatarUrl: string;

  @ApiProperty()
  @IsString()
  appid: string;
}