import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common'
import { verifyToken } from '@clerk/backend'
import { PrismaService } from '../shared/prisma.service'

@Injectable()
export class ClerkAuthGuard implements CanActivate {
  constructor(private readonly prisma: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest()

    const token = this.extractToken(request)
    if (!token) throw new UnauthorizedException('Token no encontrado')

    try {
      const payload = await verifyToken(token, {
        secretKey: process.env['CLERK_SECRET_KEY'] as string,
      })

      const user = await this.prisma.user.findUnique({
        where: { clerkId: payload.sub },
        include: { profile: true },
      })

      if (!user) throw new UnauthorizedException('Usuario no encontrado en DB')

      request.auth = {
        clerkId: payload.sub,
        dbId: user.id,
        role: user.role,
        email: user.email,
        fullName: user.profile?.fullName,
      }

      console.warn('ClerkAuthGuard - user loaded:', request.auth.email, request.auth.role)

      return true
    } catch (e: any) {
      throw new UnauthorizedException(e.message ?? 'Token inválido')
    }
  }

  private extractToken(request: any): string | null {
    const authHeader = request.headers['authorization']
    if (!authHeader) return null
    const [type, token] = authHeader.split(' ')
    return type === 'Bearer' ? token : null
  }
}
