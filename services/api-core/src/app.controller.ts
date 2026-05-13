import { Controller, Get } from '@nestjs/common'

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
}
