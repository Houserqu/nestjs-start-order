import { Injectable, Inject, forwardRef } from '@nestjs/common';
import { User } from '@entity/User';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/CreateUserDto.dto';
import { ErrorException, err } from '@common/error.exception';
import { CreateWeAppUserDto } from './dto/CreateWeAppUserDto.dto';
import { RabbitService } from '@modules/mq/rabbit.service';
import { RedisService } from '@modules/cache/redis.service';
import * as _ from 'lodash';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @Inject(forwardRef(() => RabbitService))
    private readonly rabbitService: RabbitService,
    private readonly redisService: RedisService
  ) {}

  async findOne(phone: string): Promise<User | undefined> {
    return await this.userRepository.findOne({
      where: {
        phone,
      },
    });
  }
 
  /**
   * 根据id查用户（经过缓存）
   * @param id 
   */ 
  async findUserByID(id: number): Promise<User | undefined> {
    const cacheUser = await this.redisService.command('HGETALL', 'USERS_' + id)
    if(cacheUser) {
      return cacheUser
    }

    const user = await this.userRepository.findOne({
      where: {
        id,
      },
    });


    if(!user) {
      throw new ErrorException(err.USER_INFO_FAIL)
    } 
    
    // 可以不需要 await，让接口更快的返回数据
    this.redisService.command('HMSET', 'USERS_' + user.id, _.flatten(_.toPairs(_.omit(user, ['password']))))
    return user
  }

  /**
   * 根据id查用户（不经过缓存）
   * @param id 
   */
  async findUserByIDNoChache(id: number): Promise<User | undefined> {
    return await this.userRepository.findOne({
      where: {
        id,
      },
    });
  }

  async findOneByUnionid(unionid: string): Promise<User | undefined> {
    return await this.userRepository.findOne({
      where: {
        unionid,
      },
    });
  }

  /**
   * 写入创建用户的 mq 消息
   * @param createUserDto 
   */
  async createMessage(createUserDto: CreateUserDto): Promise<Boolean> {
    return await this.rabbitService.publishUser(createUserDto)
  }

  /**
   * 消费消息，创建用户
   * @param createUserDto 
   */
  async create(createUserDto: CreateUserDto): Promise<User | undefined> {
    // const findUser = await this.userRepository.findOne({
    //   where: {
    //     phone: createUserDto.phone,
    //   },
    // });

    // if(findUser) {
    //   throw new ErrorException(err.CREATE_PHONE_EXITED)
    // }

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
      throw new ErrorException(err.CREATE_USER_FAILD, e.message)
    }
  }

  async createByWechat(createWeAppUserDto: CreateWeAppUserDto): Promise<User | undefined> {
    const findUser = await this.userRepository.findOne({
      where: {
        unionid: createWeAppUserDto.unionid,
      },
    });

    if(findUser) {
      throw new ErrorException(err.CREATE_PHONE_EXITED)
    }

    try {
      const user = new User();
      user.nickname = createWeAppUserDto.nickname;
      user.openid = createWeAppUserDto.openid;
      user.unionid = createWeAppUserDto.unionid;
      user.avatarUrl = createWeAppUserDto.avatarUrl;
      user.country = createWeAppUserDto.country;
      user.province = createWeAppUserDto.province;
      user.city = createWeAppUserDto.city;
      user.appid = createWeAppUserDto.appid;
      return this.userRepository.save(user)
    } catch (e) {
      throw new ErrorException(err.CREATE_USER_FAILD, e.message)
    }
  }

  async bindPhone(phone: string, userId: number): Promise<User | undefined> {
    let user;
    {
      user = await this.userRepository.findOne({
        where: {
          id: userId,
        },
      });

      // 判断是否已经绑定手机号
      if(user.phone) {
        throw new ErrorException(err.USER_PHONE_EXITED)
      }
    }

    // 判断手机号是否被其他人绑定
    {
      const findPhoneUser = await this.userRepository.findOne({
        where: {
          phone,
        },
      });

      if (findPhoneUser) {
        throw new ErrorException(err.PHONE_EXITED)
      }
    }

    user.phone = phone;
    return this.userRepository.save(user)
  }
}
