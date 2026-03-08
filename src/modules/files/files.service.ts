import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { FileContext } from '@prisma/client';
import * as AWS from 'aws-sdk';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class FilesService {
  private readonly s3: AWS.S3;
  private readonly bucket: string;

  constructor(
    private readonly prisma: PrismaService,
    private readonly config: ConfigService,
  ) {
    this.bucket = config.get<string>('s3.bucket') ?? 'aep-files';
    this.s3 = new AWS.S3({
      endpoint: config.get('s3.endpoint'),
      accessKeyId: config.get('s3.accessKey'),
      secretAccessKey: config.get('s3.secretKey'),
      region: config.get('s3.region'),
      s3ForcePathStyle: true,
    });
  }

  async upload(file: Express.Multer.File, referenceId: string, context: FileContext, uploadedBy: string, tenantId: string) {
    const storageKey = `${tenantId}/${context}/${referenceId}/${Date.now()}-${file.originalname}`;

    await this.s3.putObject({
      Bucket: this.bucket,
      Key: storageKey,
      Body: file.buffer,
      ContentType: file.mimetype,
    }).promise();

    return this.prisma.fileRecord.create({
      data: { uploadedBy, referenceId, context, originalName: file.originalname, mimeType: file.mimetype, sizeBytes: file.size, storageKey, tenantId },
    });
  }

  async list(referenceId: string, tenantId: string) {
    return this.prisma.fileRecord.findMany({ where: { referenceId, tenantId } });
  }

  async getSignedUrl(id: string, tenantId: string) {
    const file = await this.prisma.fileRecord.findFirst({ where: { id, tenantId } });
    if (!file) throw new NotFoundException('File not found');

    const url = this.s3.getSignedUrl('getObject', { Bucket: this.bucket, Key: file.storageKey, Expires: 3600 });
    return { url };
  }
}
