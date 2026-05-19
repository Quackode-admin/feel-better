import {
  Controller,
  Get,
  Patch,
  Param,
  Body,
  UseGuards,
  Req,
} from '@nestjs/common'
import { UsersService } from './users.service'
import { ClerkAuthGuard } from '../auth/clerk.guard'

@Controller('users')
@UseGuards(ClerkAuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // Obtener el perfil del usuario autenticado
  @Get('me')
  async getMe(@Req() req: any) {
    return this.usersService.findByClerkId(req.userId)
  }

  // Actualizar el perfil del usuario autenticado
  @Patch('me')
  async updateMe(@Req() req: any, @Body() body: any) {
    return this.usersService.updateProfile(req.userId, body)
  }

  // Obtener un usuario por ID (admin)
  @Get(':id')
  async getUser(@Param('id') id: string) {
    return this.usersService.findById(id)
  }
}
