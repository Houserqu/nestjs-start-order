import { Module } from '@nestjs/common';
import { ConsumerService } from './consumer.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '@modules/user/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [ConsumerService],
  exports: [ConsumerService]
})
export class ConsumerModule {}
