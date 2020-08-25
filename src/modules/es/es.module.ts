import { Module } from '@nestjs/common';
import { EsService } from './es.service';
import { ElasticsearchModule } from '@nestjs/elasticsearch'

@Module({
  imports: [ElasticsearchModule.register({
    node: 'http://localhost:9201'
  })],
  providers: [EsService]
})
export class EsModule {}
