import { Job } from 'bull';
export declare class ReportProcessor {
    private readonly logger;
    handleGenerate(job: Job<{
        reportId: string;
        tenantId: string;
    }>): Promise<void>;
}
