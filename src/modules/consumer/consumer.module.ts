import { Module } from '@nestjs/common';
import { ConsumerService } from './consumer.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '@modules/user/user.entity';
import { CacheModule } from '@modules/cache/cache.module';

@Module({
  imports: [TypeOrmModule.forFeature([User]), CacheModule],
  providers: [ConsumerService],
  exports: [ConsumerService]
})
export class ConsumerModule {}
