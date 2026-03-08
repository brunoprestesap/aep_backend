import { RiskSeverity, RiskProbability } from '@prisma/client';
export declare class UpdateRiskAssessmentDto {
    severity?: RiskSeverity;
    probability?: RiskProbability;
    justification?: string;
}
