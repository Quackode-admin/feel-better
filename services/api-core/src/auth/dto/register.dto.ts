import { ApiProperty } from '@nestjs/swagger'
import { IsEmail, IsEnum, IsString, MinLength } from 'class-validator'
import { Role } from '@prisma/client'

export class RegisterDto {
  @ApiProperty({ example: 'user@example.com' })
  @IsEmail()
  declare email: string

  @ApiProperty({ minLength: 8 })
  @IsString()
  @MinLength(8)
  declare password: string

  @ApiProperty({ enum: Role })
  @IsEnum(Role)
  declare role: Role

  @ApiProperty({ example: 'Ana García' })
  @IsString()
  declare fullName: string
}
