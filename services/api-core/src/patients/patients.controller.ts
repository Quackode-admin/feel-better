import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  UseGuards,
  Req,
} from '@nestjs/common'
import { PatientsService } from './patients.service'
import { ClerkAuthGuard } from '../auth/clerk.guard'

@Controller('patients')
@UseGuards(ClerkAuthGuard)
export class PatientsController {
  constructor(private readonly patientsService: PatientsService) {}

  @Get()
  findAll(@Req() req: any) {
    return this.patientsService.findAll(req.auth)
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Req() req: any) {
    return this.patientsService.findById(id, req.auth)
  }

  @Post()
  create(@Body() body: any, @Req() req: any) {
    return this.patientsService.create(body, req.auth)
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() body: any, @Req() req: any) {
    return this.patientsService.update(id, body, req.auth)
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Req() req: any) {
    return this.patientsService.softDelete(id, req.auth)
  }
}
