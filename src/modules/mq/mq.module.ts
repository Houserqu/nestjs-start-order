import { Module, forwardRef } from '@nestjs/common';
import { RabbitService } from './rabbit.service';
import { MQController } from './mq.controller';
import { ConsumerModule } from '@modules/consumer/consumer.module';

/**
 * 消息对列模块，默认是用的是 Rabbitmq
 * 
 * @export
 * @class MQModule
 */
@Module({
  imports: [ConsumerModule],
  providers: [RabbitService],
  controllers: [MQController],
  exports: [RabbitService]
})
export class MQModule {}
