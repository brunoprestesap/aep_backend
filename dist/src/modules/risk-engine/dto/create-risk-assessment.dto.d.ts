import { RiskSeverity, RiskProbability } from '@prisma/client';
export declare class CreateRiskAssessmentDto {
    assessmentId: string;
    hazardId: string;
    severity: RiskSeverity;
    probability: RiskProbability;
    justification?: string;
}
