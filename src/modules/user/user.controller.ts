import { Controller, Post, Body, Query } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/CreateUserDto.dto';
import { ApiOperation } from '@nestjs/swagger';
import { FindUserDto } from './dto/findUserDto';

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

  @Post('/one')
  @ApiOperation({summary: '查找用户(缓存)', tags: ['用户']})
  async getOneUser(@Body() body: FindUserDto) {
    return await this.userService.findUserByID(body.userId)
  }

  @Post('/oneNoCache')
  @ApiOperation({summary: '查找用户', tags: ['用户']})
  async getOneUserNoChache(@Body() body: FindUserDto) {
    return await this.userService.findUserByIDNoChache(body.userId)
  }
}
