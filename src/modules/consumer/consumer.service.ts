import { Injectable } from '@nestjs/common';
import { ErrorException, err } from '@src/common/error.exception';
import { CreateUserDto } from '@modules/user/dto/CreateUserDto.dto';
import { User } from '@modules/user/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Logger } from '@modules/logger/logger.service';

@Injectable()
export class ConsumerService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly logger: Logger
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
    const findUser = await this.userRepository.findOne({
      where: [{
        phone: createUserDto.phone,
      }, {
        unionid: createUserDto.unionid
      }],
    });

    if(findUser) {
      throw new ErrorException(err.CREATE_PHONE_EXITED)
    }

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
      return this.userRepository.save(user)
    } catch (e) {
      throw new ErrorException(err.CREATE_USER_FAILD)
    }
  }
}
