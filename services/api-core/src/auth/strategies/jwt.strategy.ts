import { Injectable, UnauthorizedException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt'
import { passportJwtSecret } from 'jwks-rsa'
import { UsersService } from '../../users/users.service'

export interface ClerkJwtPayload {
  sub: string        // Clerk user ID (user_xxx)
  email?: string
  azp?: string       // Authorized party (client app)
  iss: string
  iat: number
  exp: number
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    config: ConfigService,
    private readonly users: UsersService,
  ) {
    const clerkDomain = config.getOrThrow<string>('CLERK_DOMAIN')
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKeyProvider: passportJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 10,
        jwksUri: `https://${clerkDomain}/.well-known/jwks.json`,
      }),
      algorithms: ['RS256'],
    })
  }

  async validate(payload: ClerkJwtPayload) {
    const user = await this.users.findByClerkId(payload.sub)
    if (!user || !user.isActive) throw new UnauthorizedException()
    return user
  }
}
