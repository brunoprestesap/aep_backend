import { RiskSeverity, RiskProbability, RiskLevel } from '@prisma/client';

const SEVERITY_WEIGHT: Record<RiskSeverity, number> = {
  low: 1,
  moderate: 2,
  high: 3,
  critical: 4,
};

const PROBABILITY_WEIGHT: Record<RiskProbability, number> = {
  unlikely: 1,
  possible: 2,
  likely: 3,
  almost_certain: 4,
};

export function classifyRisk(severity: RiskSeverity, probability: RiskProbability): { score: number; level: RiskLevel } {
  const score = SEVERITY_WEIGHT[severity] * PROBABILITY_WEIGHT[probability];

  let level: RiskLevel;
  if (score >= 12) level = 'critical';
  else if (score >= 6) level = 'high';
  else if (score >= 3) level = 'medium';
  else level = 'low';

  return { score, level };
}
