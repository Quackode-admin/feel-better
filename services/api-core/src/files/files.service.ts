import { Injectable, Logger } from '@nestjs/common'
import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
  GetObjectCommand,
} from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { randomUUID } from 'crypto'

@Injectable()
export class FilesService {
  private readonly logger = new Logger(FilesService.name)
  private readonly s3: S3Client
  private readonly bucket: string

  constructor() {
    this.bucket = process.env['R2_BUCKET_NAME'] as string

    this.s3 = new S3Client({
      region: 'auto',
      endpoint: process.env['R2_ENDPOINT'] as string,
      credentials: {
        accessKeyId: process.env['R2_ACCESS_KEY_ID'] as string,
        secretAccessKey: process.env['R2_SECRET_ACCESS_KEY'] as string,
      },
    })
  }

  // Genera una URL firmada para subir un archivo directamente desde el browser
  async getUploadUrl(
    fileName: string,
    mimeType: string,
    folder: string = 'documents',
  ): Promise<{ uploadUrl: string; fileKey: string }> {
    const ext = fileName.split('.').pop()
    const fileKey = `${folder}/${randomUUID()}.${ext}`

    const command = new PutObjectCommand({
      Bucket: this.bucket,
      Key: fileKey,
      ContentType: mimeType,
    })

    const uploadUrl = await getSignedUrl(this.s3, command, { expiresIn: 300 }) // 5 minutos

    return { uploadUrl, fileKey }
  }

  // Genera una URL firmada para descargar/ver un archivo
  async getDownloadUrl(fileKey: string): Promise<string> {
    const command = new GetObjectCommand({
      Bucket: this.bucket,
      Key: fileKey,
    })

    return getSignedUrl(this.s3, command, { expiresIn: 3600 }) // 1 hora
  }

  // Elimina un archivo del bucket
  async deleteFile(fileKey: string): Promise<void> {
    const command = new DeleteObjectCommand({
      Bucket: this.bucket,
      Key: fileKey,
    })

    await this.s3.send(command)
    this.logger.log(`Archivo eliminado: ${fileKey}`)
  }
}
