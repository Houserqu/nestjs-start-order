import { Injectable, Inject, forwardRef } from '@nestjs/common';
import * as amqp from 'amqplib'
import { ConfigService } from '@modules/config/config.service';
import { CreateUserDto } from '@modules/user/dto/CreateUserDto.dto';
import { ConsumerService } from '@modules/consumer/consumer.service';

/**
 * Rabbitmq 基本示例，连接和创建发布者、消费者
 */
@Injectable()
export class RabbitService {
  private channel: amqp.Channel
  
  constructor(
    private readonly configService: ConfigService,
    private readonly consumerService: ConsumerService
  ){
    const that = this
    amqp.connect({
      protocol: this.configService.get('RABBIT_MQ_PROTOCOL'),
      hostname: this.configService.get('RABBIT_MQ_HOST_NAME'),
      port: parseInt(this.configService.get('RABBIT_MQ_PORT')),
      username: this.configService.get('RABBIT_MQ_USER_NAME'),
      password: this.configService.get('RABBIT_MQ_PASSWORD'),
    }).then((conn) => {
      // 创建通道
      conn.createChannel().then(channel => {
        this.channel = channel
        channel.assertQueue('user', {durable: false})
        // 创建消费者（一般在不同的程序里）
        channel.consume('user', async (msg) => {   
          that.consumerService.createUser(msg, channel)
        })
      })
    })
  }

  async publishHello() {
    // 创建发布者
    await this.channel.assertQueue('hello', {durable: false})
    // 发送消息
    const res = await this.channel.sendToQueue('hello', Buffer.from('hello'))
    return res
  }

  async publishWorld() {
    // 创建发布者
    await this.channel.assertQueue('world', {durable: false})
    // 发送消息
    const res = await this.channel.sendToQueue('world', Buffer.from('world'))
    return res
  }
  
  async publishUser(user: CreateUserDto) {
    // 创建发布者
    await this.channel.assertQueue('user', {durable: false})
    // 发送消息
    const res = await this.channel.sendToQueue('user', Buffer.from(JSON.stringify(user)))
    return res
  }
}
