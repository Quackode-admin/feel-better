import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { Role } from '@prisma/client'
import { ROLES_KEY } from '../decorators/roles.decorator'

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(ctx: ExecutionContext): boolean {
    const required = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      ctx.getHandler(),
      ctx.getClass(),
    ])

    if (!required?.length) return true

    const request = ctx.switchToHttp().getRequest()
    const auth = request.auth

    if (!auth) throw new ForbiddenException('No autenticado')
    if (!required.includes(auth.role)) throw new ForbiddenException('Acceso denegado')

    return true
  }
}
