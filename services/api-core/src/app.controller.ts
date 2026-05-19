import { Controller, Get, UseGuards, Req } from '@nestjs/common'
import { ClerkAuthGuard } from './auth/clerk.guard'

@Controller()
export class AppController {
  @Get('health')
  health() {
    return {
      status: 'ok',
      service: 'api-core',
      timestamp: new Date().toISOString(),
      environment: process.env['NODE_ENV'],
    }
  }

  @Get('me')
  @UseGuards(ClerkAuthGuard)
  getMe(@Req() req: any) {
    return {
      userId: req.userId,
      auth: req.auth,
    }
  }
}
