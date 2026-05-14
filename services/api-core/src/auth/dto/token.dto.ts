import { ApiProperty } from '@nestjs/swagger'

export class TokenResponseDto {
  @ApiProperty()
  declare accessToken: string

  @ApiProperty()
  declare refreshToken: string
}

export class RefreshDto {
  @ApiProperty()
  declare refreshToken: string
}
