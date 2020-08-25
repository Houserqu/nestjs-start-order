import { Module } from '@nestjs/common';
import { User } from '@entity/User';
import { UserService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserController } from './user.controller';
import { MQModule } from '@modules/mq/mq.module';
import { CacheModule } from '@modules/cache/cache.module';

@Module({
  imports: [TypeOrmModule.forFeature([User]), MQModule, CacheModule],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
