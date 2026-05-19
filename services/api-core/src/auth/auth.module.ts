import { Module, Global } from '@nestjs/common'
import { ClerkAuthGuard } from './clerk.guard'

@Global()
@Module({
  providers: [ClerkAuthGuard],
  exports: [ClerkAuthGuard],
})
export class AuthModule {}
