import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common'
import { createClerkClient } from '@clerk/backend'

const clerk = createClerkClient({
  secretKey: process.env['CLERK_SECRET_KEY'],
})

@Injectable()
export class ClerkAuthGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest()

    const token = this.extractToken(request)
    if (!token) throw new UnauthorizedException('Token no encontrado')

    try {
      const payload = await clerk.verifyToken(token)
      request.auth = payload
      request.userId = payload.sub
      return true
    } catch {
      throw new UnauthorizedException('Token inválido o expirado')
    }
  }

  private extractToken(request: any): string | null {
    const authHeader = request.headers['authorization']
    if (!authHeader) return null
    const [type, token] = authHeader.split(' ')
    return type === 'Bearer' ? token : null
  }
}
