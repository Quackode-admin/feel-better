import { Module } from '@nestjs/common'
import { InvitationsService } from './invitations.service'
import { SharedModule } from '../shared/shared.module'

@Module({
  imports: [SharedModule],
  providers: [InvitationsService],
  exports: [InvitationsService],
})
export class InvitationsModule {}
