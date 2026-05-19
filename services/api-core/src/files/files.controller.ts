import { Controller, Post, Body, Get, Query, UseGuards } from '@nestjs/common'
import { FilesService } from './files.service'
import { ClerkAuthGuard } from '../auth/clerk.guard'

@Controller('files')
@UseGuards(ClerkAuthGuard)
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Post('upload-url')
  async getUploadUrl(
    @Body() body: { fileName: string; mimeType: string; folder?: string },
  ) {
    return this.filesService.getUploadUrl(
      body.fileName,
      body.mimeType,
      body.folder ?? 'documents',
    )
  }

  @Get('download-url')
  async getDownloadUrl(@Query('key') fileKey: string) {
    const url = await this.filesService.getDownloadUrl(fileKey)
    return { url }
  }
}
