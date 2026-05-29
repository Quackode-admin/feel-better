import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsEnum,
  MinLength,
  MaxLength,
  IsDateString,
  IsArray,
  IsInt,
  Min,
  Max,
  IsBoolean,
  Matches,
} from 'class-validator'
import { Gender } from '@prisma/client'

export class CompleteOnboardingDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(50)
  firstName!: string

  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(50)
  lastName!: string

  @IsOptional()
  @IsDateString()
  birthDate?: string

  @IsOptional()
  @IsEnum(Gender)
  gender?: Gender

  @IsOptional()
  @IsString()
  @MaxLength(20)
  phone?: string

  @IsOptional()
  @IsString()
  @MaxLength(200)
  address?: string

  @IsOptional()
  @IsString()
  @MaxLength(50)
  idDocument?: string

  @IsOptional()
  @IsString()
  @MaxLength(100)
  country?: string

  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  licenseNumber!: string

  @IsArray()
  @IsString({ each: true })
  specialties!: string[]

  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(60)
  yearsExp?: number

  @IsOptional()
  @IsString()
  @MaxLength(100)
  clinic?: string

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  certifications?: string[]

  @IsOptional()
  @IsString()
  @MaxLength(500)
  bio?: string

  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  @MaxLength(100)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'La contraseña debe tener al menos una mayúscula, una minúscula y un número',
  })
  password!: string

  @IsString()
  @IsNotEmpty()
  confirmPassword!: string

  @IsBoolean()
  acceptTerms!: boolean

  @IsOptional()
  @IsBoolean()
  acceptHipaa?: boolean
}
