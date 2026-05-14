import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common'
import { verifyToken } from '@clerk/backend'

@Injectable()
export class ClerkAuthGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest()

    const token = this.extractToken(request)
    if (!token) throw new UnauthorizedException('Token no encontrado')

    try {
      const payload = await verifyToken(token, {
        secretKey: process.env['CLERK_SECRET_KEY'] as string,
      })
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
