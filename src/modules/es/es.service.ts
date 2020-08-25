import { Injectable } from '@nestjs/common';
import { ElasticsearchService } from '@nestjs/elasticsearch'

@Injectable()
export class EsService {
  constructor(
    private readonly elasticsearchService: ElasticsearchService 
  ){}

  async get() {
    this.elasticsearchService
  }

  async addUser() {

  }
}
