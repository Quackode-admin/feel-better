import { Injectable } from '@nestjs/common'
import { Redis } from '@upstash/redis'

@Injectable()
export class RedisService {
  readonly client: Redis

  constructor() {
    this.client = new Redis({
      url: process.env['UPSTASH_REDIS_REST_URL'] as string,
      token: process.env['UPSTASH_REDIS_REST_TOKEN'] as string,
    })
  }
}
