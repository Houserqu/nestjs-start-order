import { Controller, Post, Body } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/CreateUserDto.dto';
import { ApiOperation } from '@nestjs/swagger';

@Controller('user')
export class UserController {
  constructor(
    private userService: UserService
  ){}

  @Post('/create')
  @ApiOperation({summary: '创建用户', tags: ['用户']})
  async createUser(@Body() body: CreateUserDto) {
    return await this.userService.createMessage(body)
  }
}
