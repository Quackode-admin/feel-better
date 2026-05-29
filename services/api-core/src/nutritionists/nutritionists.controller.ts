import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  Query,
  UseGuards,
  Req,
  HttpCode,
  HttpStatus,
} from '@nestjs/common'
import { NutritionistsService } from './nutritionists.service'
import { ClerkAuthGuard } from '../auth/clerk.guard'
import { RolesGuard } from '../auth/guards/roles.guard'
import { Roles } from '../auth/decorators/roles.decorator'
import { CreateInvitationDto } from './dto/create-invitation.dto'
import { UpdateNutritionistDto } from './dto/update-nutritionist.dto'
import { ListNutritionistsDto } from './dto/list-nutritionists.dto'
import { ReassignPatientDto } from './dto/reassign-patient.dto'

@Controller('admin/nutritionists')
@UseGuards(ClerkAuthGuard, RolesGuard)
@Roles('admin')
export class NutritionistsController {
  constructor(private readonly service: NutritionistsService) {}

  @Get()
  findAll(@Query() query: ListNutritionistsDto) {
    return this.service.findAll(query)
  }

  @Get('unassigned-patients')
  getUnassignedPatients(
    @Query('page') page = '1',
    @Query('limit') limit = '20',
    @Query('search') search?: string,
  ) {
    const params: { page: number; limit: number; search?: string } = {
      page: parseInt(page),
      limit: parseInt(limit),
    }
    if (search) params.search = search
    return this.service.getUnassignedPatients(params)
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findById(id)
  }

  @Post('invite')
  @HttpCode(HttpStatus.CREATED)
  invite(@Body() dto: CreateInvitationDto, @Req() req: any) {
    return this.service.invite(dto, req.auth.dbId)
  }

  @Post(':id/resend-invitation')
  @HttpCode(HttpStatus.OK)
  resendInvitation(@Param('id') id: string, @Req() req: any) {
    return this.service.resendInvitation(id, req.auth.dbId)
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateNutritionistDto, @Req() req: any) {
    return this.service.update(id, dto, req.auth.dbId)
  }

  @Patch(':id/disable')
  disable(@Param('id') id: string, @Req() req: any) {
    return this.service.disable(id, req.auth.dbId)
  }

  @Patch('patients/:patientId/assign')
  reassignPatient(@Param('patientId') patientId: string, @Body() dto: ReassignPatientDto, @Req() req: any) {
    return this.service.reassignPatient(patientId, dto, req.auth.dbId)
  }

  @Delete(':id')
  softDelete(@Param('id') id: string, @Req() req: any) {
    return this.service.softDelete(id, req.auth.dbId)
  }
}
