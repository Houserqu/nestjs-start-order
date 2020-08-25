import { Injectable } from '@nestjs/common';
import { ErrorException, err } from '@src/common/error.exception';
import { CreateUserDto } from '@modules/user/dto/CreateUserDto.dto';
import { User } from '@modules/user/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Logger } from '@modules/logger/logger.service';
import { RedisService } from '@modules/cache/redis.service';
import * as _ from 'lodash';

@Injectable()
export class ConsumerService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly logger: Logger,
    private readonly redisService: RedisService
  ){}

  /**
   * 用户创建消费者
   * @param msg 
   * @param channel 
   */
  async createUser(msg, channel) {
    let message
    try {
      message = JSON.parse(msg.content.toString())
    } catch (error) {
      throw new ErrorException(err.USER_MQ_MESSAGE_INVALID)
    }

    try {
      await this.create(message)
    } catch (error) {
      this.logger.log(error.message)
    }
    channel.ack(msg)
  }

  /**
   * 消费消息，创建用户
   * @param createUserDto 
   */
  async create(createUserDto: CreateUserDto): Promise<User | undefined> {
    // 创建用户
    try {
      const user = new User();
      user.phone = createUserDto.phone;
      user.nickname = createUserDto.nickname;
      user.password = createUserDto.password;
      user.remark = createUserDto.remark;
      user.type = createUserDto.type;
      user.openid = createUserDto.openid;
      user.unionid = createUserDto.unionid;
      user.avatarUrl = createUserDto.avatarUrl;
      user.country = createUserDto.country;
      user.gender = createUserDto.gender;
      user.province = createUserDto.province;
      user.city = createUserDto.city;
      user.appid = createUserDto.appid;
      
      const createUser = await this.userRepository.save(user)

      // 写入用户信息到 redis
      await this.redisService.command('HMSET', 'USERS_' + createUser.id, _.flatten(_.toPairs(_.omit(user, ['password']))))
      return createUser
    } catch (e) {
      console.log(e.message)
      // throw new ErrorException(err.CREATE_USER_FAILD)
    }
  }
}
