"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FilesService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const AWS = require("aws-sdk");
const prisma_service_1 = require("../../prisma/prisma.service");
let FilesService = class FilesService {
    constructor(prisma, config) {
        this.prisma = prisma;
        this.config = config;
        this.bucket = config.get('s3.bucket') ?? 'aep-files';
        this.s3 = new AWS.S3({
            endpoint: config.get('s3.endpoint'),
            accessKeyId: config.get('s3.accessKey'),
            secretAccessKey: config.get('s3.secretKey'),
            region: config.get('s3.region'),
            s3ForcePathStyle: true,
        });
    }
    async upload(file, referenceId, context, uploadedBy, tenantId) {
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
    async list(referenceId, tenantId) {
        return this.prisma.fileRecord.findMany({ where: { referenceId, tenantId } });
    }
    async getSignedUrl(id, tenantId) {
        const file = await this.prisma.fileRecord.findFirst({ where: { id, tenantId } });
        if (!file)
            throw new common_1.NotFoundException('File not found');
        const url = this.s3.getSignedUrl('getObject', { Bucket: this.bucket, Key: file.storageKey, Expires: 3600 });
        return { url };
    }
};
exports.FilesService = FilesService;
exports.FilesService = FilesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        config_1.ConfigService])
], FilesService);
//# sourceMappingURL=files.service.js.map