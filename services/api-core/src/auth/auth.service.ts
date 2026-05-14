import {
  Injectable,
  ConflictException,
  UnauthorizedException,
} from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { ConfigService } from '@nestjs/config'
import { PrismaService } from '../prisma/prisma.service'
import { UsersService } from '../users/users.service'
import { RegisterDto } from './dto/register.dto'
import { LoginDto } from './dto/login.dto'
import { TokenResponseDto } from './dto/token.dto'
import { JwtPayload } from './strategies/jwt.strategy'
import * as bcrypt from 'bcryptjs'

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly users: UsersService,
    private readonly jwt: JwtService,
    private readonly config: ConfigService,
  ) {}

  async register(dto: RegisterDto): Promise<TokenResponseDto> {
    const existing = await this.users.findByEmail(dto.email)
    if (existing) throw new ConflictException('Email already registered')

    const passwordHash = await bcrypt.hash(dto.password, 12)

    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        passwordHash,
        role: dto.role,
        profile: {
          create: { fullName: dto.fullName },
        },
      },
    })

    return this.issueTokens({ sub: user.id, email: user.email, role: user.role })
  }

  async login(dto: LoginDto): Promise<TokenResponseDto> {
    const user = await this.users.findByEmail(dto.email)
    if (!user || !user.isActive) throw new UnauthorizedException('Invalid credentials')

    const valid = await bcrypt.compare(dto.password, user.passwordHash)
    if (!valid) throw new UnauthorizedException('Invalid credentials')

    return this.issueTokens({ sub: user.id, email: user.email, role: user.role })
  }

  async refresh(refreshToken: string): Promise<TokenResponseDto> {
    let payload: JwtPayload
    try {
      payload = await this.jwt.verifyAsync<JwtPayload>(refreshToken, {
        secret: this.config.getOrThrow<string>('JWT_REFRESH_SECRET'),
      })
    } catch {
      throw new UnauthorizedException('Invalid refresh token')
    }

    const user = await this.users.findById(payload.sub)
    if (!user || !user.isActive) throw new UnauthorizedException()

    return this.issueTokens({ sub: user.id, email: user.email, role: user.role })
  }

  private issueTokens(payload: JwtPayload): TokenResponseDto {
    const accessToken = this.jwt.sign(payload, {
      secret: this.config.getOrThrow<string>('JWT_SECRET'),
      expiresIn: '15m',
    })
    const refreshToken = this.jwt.sign(payload, {
      secret: this.config.getOrThrow<string>('JWT_REFRESH_SECRET'),
      expiresIn: '7d',
    })
    return { accessToken, refreshToken }
  }
}
