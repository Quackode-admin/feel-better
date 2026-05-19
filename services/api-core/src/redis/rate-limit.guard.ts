import {
  Injectable,
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
} from '@nestjs/common'
import { Ratelimit } from '@upstash/ratelimit'
import { RedisService } from './redis.service'

@Injectable()
export class RateLimitGuard implements CanActivate {
  private ratelimit: Ratelimit

  constructor(private readonly redis: RedisService) {
    this.ratelimit = new Ratelimit({
      redis: this.redis.client,
      limiter: Ratelimit.slidingWindow(60, '1 m'), // 60 requests por minuto
      analytics: true,
    })
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest()
    const ip = request.ip ?? request.headers['x-forwarded-for'] ?? 'unknown'

    const { success, limit, remaining, reset } = await this.ratelimit.limit(ip)

    if (!success) {
      throw new HttpException(
        {
          statusCode: HttpStatus.TOO_MANY_REQUESTS,
          message: 'Demasiadas solicitudes — intenta de nuevo en un momento',
          limit,
          remaining,
          reset,
        },
        HttpStatus.TOO_MANY_REQUESTS,
      )
    }

    return true
  }
}
