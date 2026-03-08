import { RiskSeverity, RiskProbability, RiskLevel } from '@prisma/client';
export declare function classifyRisk(severity: RiskSeverity, probability: RiskProbability): {
    score: number;
    level: RiskLevel;
};
