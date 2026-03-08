"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.classifyRisk = classifyRisk;
const SEVERITY_WEIGHT = {
    low: 1,
    moderate: 2,
    high: 3,
    critical: 4,
};
const PROBABILITY_WEIGHT = {
    unlikely: 1,
    possible: 2,
    likely: 3,
    almost_certain: 4,
};
function classifyRisk(severity, probability) {
    const score = SEVERITY_WEIGHT[severity] * PROBABILITY_WEIGHT[probability];
    let level;
    if (score >= 12)
        level = 'critical';
    else if (score >= 6)
        level = 'high';
    else if (score >= 3)
        level = 'medium';
    else
        level = 'low';
    return { score, level };
}
//# sourceMappingURL=risk-classifier.js.map