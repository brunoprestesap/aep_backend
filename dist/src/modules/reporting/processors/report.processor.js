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
var ReportProcessor_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReportProcessor = void 0;
const fs = require("fs");
const path = require("path");
const bull_1 = require("@nestjs/bull");
const common_1 = require("@nestjs/common");
const ExcelJS = require("exceljs");
const PDFDocument = require("pdfkit");
const docx_1 = require("docx");
const prisma_service_1 = require("../../../prisma/prisma.service");
const reporting_service_1 = require("../reporting.service");
const UPLOADS_DIR = path.resolve(process.cwd(), 'uploads', 'reports');
const C = {
    navy: '#0F172A',
    blue: '#2563EB',
    blueHdr: '#1E3A5F',
    slate50: '#F8FAFC',
    slate100: '#F1F5F9',
    slate200: '#E2E8F0',
    slate400: '#94A3B8',
    slate500: '#64748B',
    slate600: '#475569',
    slate700: '#334155',
    slate900: '#0F172A',
    white: '#FFFFFF',
    riskLow: '#16A34A',
    riskMedium: '#D97706',
    riskHigh: '#EA580C',
    riskCritical: '#DC2626',
    riskLowBg: '#DCFCE7',
    riskMediumBg: '#FEF9C3',
    riskHighBg: '#FFEDD5',
    riskCritBg: '#FEE2E2',
};
const DC = {
    navy: '0F172A',
    blue: '2563EB',
    blueHdr: '1E3A5F',
    slate50: 'F8FAFC',
    slate100: 'F1F5F9',
    slate200: 'E2E8F0',
    white: 'FFFFFF',
    riskLow: '16A34A',
    riskMedium: 'D97706',
    riskHigh: 'EA580C',
    riskCritical: 'DC2626',
    riskLowBg: 'DCFCE7',
    riskMedBg: 'FEF9C3',
    riskHighBg: 'FFEDD5',
    riskCritBg: 'FEE2E2',
};
const XC = {
    navy: 'FF0F172A',
    blue: 'FF2563EB',
    blueHdr: 'FF1E3A5F',
    slate50: 'FFF8FAFC',
    slate100: 'FFF1F5F9',
    slate200: 'FFE2E8F0',
    white: 'FFFFFFFF',
    riskLow: 'FFDCFCE7',
    riskMedium: 'FFFEF9C3',
    riskHigh: 'FFFFEDD5',
    riskCritical: 'FFFEE2E2',
    statusPending: 'FFFEF9C3',
    statusInProgress: 'FFDBEAFE',
    statusCompleted: 'FFDCFCE7',
    statusOverdue: 'FFFEE2E2',
    statusCancelled: 'FFF1F5F9',
};
const SEVERITY_LABELS = {
    low: 'Baixa', moderate: 'Moderada', high: 'Alta', critical: 'Crítica',
};
const PROBABILITY_LABELS = {
    unlikely: 'Improvável', possible: 'Possível', likely: 'Provável', almost_certain: 'Quase Certa',
};
const RISK_LEVEL_LABELS = {
    low: 'Baixo', medium: 'Médio', high: 'Alto', critical: 'Crítico',
};
const STATUS_LABELS = {
    pending: 'Pendente', in_progress: 'Em Andamento', completed: 'Concluído',
    overdue: 'Atrasado', cancelled: 'Cancelado',
};
const CATEGORY_COLORS = {
    ergonomic: '#7C3AED', psychosocial: '#DB2777', physical: '#2563EB',
    chemical: '#EA580C', biological: '#16A34A', mechanical: '#D97706',
};
let ReportProcessor = ReportProcessor_1 = class ReportProcessor {
    constructor(prisma, reportingService) {
        this.prisma = prisma;
        this.reportingService = reportingService;
        this.logger = new common_1.Logger(ReportProcessor_1.name);
    }
    async handleGenerate(job) {
        const { reportId, tenantId } = job.data;
        this.logger.log(`Starting generation for report ${reportId}`);
        await this.prisma.report.update({ where: { id: reportId }, data: { status: 'processing' } });
        try {
            const report = await this.prisma.report.findFirst({ where: { id: reportId, tenantId } });
            if (!report)
                throw new Error('Report record not found');
            const assessment = await this.loadAssessmentData(report.assessmentId, tenantId);
            fs.mkdirSync(UPLOADS_DIR, { recursive: true });
            const ext = report.format;
            const filePath = path.join(UPLOADS_DIR, `${reportId}.${ext}`);
            if (report.format === 'xlsx')
                await this.generateXlsx(report.type, assessment, filePath);
            else if (report.format === 'pdf')
                await this.generatePdf(report.type, assessment, filePath);
            else if (report.format === 'docx')
                await this.generateDocx(report.type, assessment, filePath);
            await this.reportingService.markCompleted(reportId, `reports/${reportId}.${ext}`, `/api/v1/reports/${reportId}/download`);
            this.logger.log(`Report ${reportId} completed`);
        }
        catch (err) {
            const msg = err instanceof Error ? err.message : String(err);
            this.logger.error(`Report ${reportId} failed: ${msg}`);
            await this.reportingService.markFailed(reportId, msg);
        }
    }
    async loadAssessmentData(assessmentId, tenantId) {
        return this.prisma.assessment.findFirst({
            where: { id: assessmentId, tenantId },
            include: {
                organization: true,
                activities: true,
                hazards: { include: { riskAssessments: true, activity: { select: { name: true } } } },
                riskAssessments: { include: { hazard: { select: { name: true, category: true } } } },
                actionPlans: { include: { items: true } },
            },
        });
    }
    generatePdf(type, assessment, filePath) {
        return new Promise((resolve, reject) => {
            const doc = new PDFDocument({ margin: 50, size: 'A4', bufferPages: true });
            const stream = fs.createWriteStream(filePath);
            doc.pipe(stream);
            const W = doc.page.width;
            const MARGIN = 50;
            const COVER_H = 260;
            doc.rect(0, 0, W, COVER_H).fill(C.navy);
            doc.rect(0, COVER_H - 4, W, 4).fill(C.blue);
            doc.fillColor(C.slate400).fontSize(9).font('Helvetica')
                .text('AEP SAAS PLATFORM', MARGIN, 42, { characterSpacing: 3, lineBreak: false });
            doc.fillColor(C.white).fontSize(30).font('Helvetica-Bold')
                .text(this.reportTypeLabel(type), MARGIN, 68, { width: W - MARGIN * 2 });
            const orgName = assessment?.organization?.name ?? '';
            if (orgName) {
                const orgY = Math.max(doc.y + 8, 110);
                doc.fillColor('#93C5FD').fontSize(15).font('Helvetica')
                    .text(orgName, MARGIN, orgY, { width: W - MARGIN * 2 });
            }
            if (assessment?.title) {
                const titleY = Math.max(doc.y + 6, 148);
                doc.fillColor(C.slate400).fontSize(10).font('Helvetica')
                    .text(assessment.title, MARGIN, Math.min(titleY, 190), { width: W - MARGIN * 2 });
            }
            doc.fillColor(C.slate500).fontSize(9).font('Helvetica')
                .text(new Date().toLocaleDateString('pt-BR', { year: 'numeric', month: 'long', day: 'numeric' }), MARGIN, 228, { align: 'right', width: W - MARGIN * 2, lineBreak: false });
            const critCount = assessment?.riskAssessments?.filter((r) => r.riskLevel === 'critical').length ?? 0;
            const stats = [
                { label: 'Atividades', value: String(assessment?.activities?.length ?? 0), color: C.blue },
                { label: 'Perigos', value: String(assessment?.hazards?.length ?? 0), color: '#7C3AED' },
                { label: 'Riscos', value: String(assessment?.riskAssessments?.length ?? 0), color: '#DB2777' },
                { label: 'Críticos', value: String(critCount), color: C.riskCritical },
                { label: 'Planos de Ação', value: String(assessment?.actionPlans?.length ?? 0), color: C.riskLow },
            ];
            const STRIP_Y = COVER_H + 24;
            const CARD_W = (W - MARGIN * 2 - 16) / stats.length;
            for (let i = 0; i < stats.length; i++) {
                const s = stats[i];
                const cx = MARGIN + i * (CARD_W + 4);
                doc.rect(cx, STRIP_Y, CARD_W, 72).fill(C.slate50);
                doc.rect(cx, STRIP_Y, 4, 72).fill(s.color);
                doc.fillColor(s.color).fontSize(24).font('Helvetica-Bold')
                    .text(s.value, cx + 12, STRIP_Y + 10, { width: CARD_W - 16, lineBreak: false });
                doc.fillColor(C.slate600).fontSize(8).font('Helvetica')
                    .text(s.label, cx + 12, STRIP_Y + 42, { width: CARD_W - 16, lineBreak: false });
            }
            doc.text('', MARGIN, STRIP_Y + 88);
            this.pdfSectionHeader(doc, MARGIN, 'IDENTIFICAÇÃO DA AVALIAÇÃO');
            const infoRows = [
                ['Título', assessment?.title ?? '—'],
                ['Organização', assessment?.organization?.name ?? '—'],
                ['Escopo', assessment?.scope ?? '—'],
                ['Metodologia', assessment?.methodology ?? '—'],
                ['Status', assessment?.status ?? '—'],
                ['Gerado em', new Date().toLocaleString('pt-BR')],
            ];
            this.pdfInfoGrid(doc, MARGIN, infoRows);
            if (type === 'aep' || type === 'risk_inventory') {
                this.pdfSectionHeader(doc, MARGIN, 'PERIGOS IDENTIFICADOS');
                const hazards = assessment?.hazards ?? [];
                if (hazards.length === 0) {
                    this.pdfEmpty(doc, MARGIN, 'Nenhum perigo identificado.');
                }
                else {
                    this.pdfTable(doc, MARGIN, [
                        { header: 'Perigo', width: 150 },
                        { header: 'Categoria', width: 80 },
                        { header: 'Atividade', width: 100 },
                        { header: 'Trab. Expostos', width: 60 },
                        { header: 'Controles Existentes', width: 105 },
                    ], hazards.map((h) => [
                        { text: h.name },
                        { text: h.category, badge: this.categoryBadge(h.category) },
                        { text: h.activity?.name ?? '—' },
                        { text: String(h.exposedWorkerCount ?? '—') },
                        { text: h.existingControls ?? '—' },
                    ]));
                }
                this.pdfSectionHeader(doc, MARGIN, 'INVENTÁRIO DE RISCOS');
                const risks = assessment?.riskAssessments ?? [];
                if (risks.length === 0) {
                    this.pdfEmpty(doc, MARGIN, 'Nenhuma avaliação de risco registrada.');
                }
                else {
                    this.pdfTable(doc, MARGIN, [
                        { header: 'Perigo', width: 155 },
                        { header: 'Severidade', width: 75 },
                        { header: 'Probabilidade', width: 85 },
                        { header: 'Score', width: 45 },
                        { header: 'Nível de Risco', width: 75 },
                        { header: 'Risco Residual', width: 60 },
                    ], risks.map((r) => [
                        { text: r.hazard.name },
                        { text: SEVERITY_LABELS[r.severity] ?? r.severity },
                        { text: PROBABILITY_LABELS[r.probability] ?? r.probability },
                        { text: String(r.riskScore) },
                        { text: RISK_LEVEL_LABELS[r.riskLevel] ?? r.riskLevel, badge: this.riskBadge(r.riskLevel) },
                        {
                            text: r.residualLevel ? RISK_LEVEL_LABELS[r.residualLevel] ?? r.residualLevel : '—',
                            badge: r.residualLevel ? this.riskBadge(r.residualLevel) : undefined,
                        },
                    ]));
                }
            }
            if (type === 'action_plan' || type === 'aep') {
                this.pdfSectionHeader(doc, MARGIN, 'PLANOS DE AÇÃO');
                const plans = assessment?.actionPlans ?? [];
                if (plans.length === 0) {
                    this.pdfEmpty(doc, MARGIN, 'Nenhum plano de ação registrado.');
                }
                else {
                    for (const plan of plans) {
                        const cardTextW = W - MARGIN * 2 - 20;
                        doc.font('Helvetica-Bold').fontSize(11);
                        const titleH = doc.heightOfString(plan.title, { width: cardTextW });
                        let objH = 0;
                        if (plan.objective) {
                            doc.font('Helvetica').fontSize(8.5);
                            objH = doc.heightOfString(plan.objective, { width: cardTextW });
                        }
                        const cardH = Math.max(36, titleH + objH + 14);
                        this.pdfCheckPage(doc, cardH + 12);
                        const planY = doc.y;
                        doc.rect(MARGIN, planY, W - MARGIN * 2, cardH).fill(C.slate100);
                        doc.rect(MARGIN, planY, 4, cardH).fill(C.blue);
                        doc.fillColor(C.navy).fontSize(11).font('Helvetica-Bold')
                            .text(plan.title, MARGIN + 12, planY + 6, { width: cardTextW });
                        if (plan.objective) {
                            doc.fillColor(C.slate600).fontSize(8.5).font('Helvetica')
                                .text(plan.objective, MARGIN + 12, doc.y + 2, { width: cardTextW });
                        }
                        doc.text('', MARGIN, planY + cardH + 8);
                        if (plan.items.length > 0) {
                            this.pdfTable(doc, MARGIN, [
                                { header: 'Ação', width: 160 },
                                { header: 'Responsável', width: 100 },
                                { header: 'Prazo', width: 65 },
                                { header: 'Status', width: 80 },
                                { header: 'Indicadores de Sucesso', width: 90 },
                            ], plan.items.map((item) => [
                                { text: item.action },
                                { text: item.responsibleName },
                                { text: new Date(item.dueDate).toLocaleDateString('pt-BR') },
                                { text: STATUS_LABELS[item.status] ?? item.status, badge: this.statusBadge(item.status) },
                                { text: item.successIndicators ?? '—' },
                            ]));
                        }
                        doc.moveDown(0.8);
                    }
                }
            }
            const pageRange = doc.bufferedPageRange();
            for (let i = pageRange.start; i < pageRange.start + pageRange.count; i++) {
                doc.switchToPage(i);
                const isFirstPage = i === pageRange.start;
                if (!isFirstPage) {
                    doc.rect(0, 0, W, 32).fill(C.navy);
                    doc.fillColor(C.slate400).fontSize(8).font('Helvetica')
                        .text('AEP SAAS PLATFORM', MARGIN, 12, { continued: true })
                        .fillColor(C.slate500)
                        .text(`  ·  ${this.reportTypeLabel(type)}`, { continued: true })
                        .fillColor(C.slate600)
                        .text(`  ·  ${orgName}`);
                }
                doc.fillColor(C.slate400).fontSize(7.5).font('Helvetica')
                    .text(`Página ${i + 1} de ${pageRange.count}  ·  AEP SaaS Platform  ·  Gerado em ${new Date().toLocaleDateString('pt-BR')}`, MARGIN, doc.page.height - 28, { align: 'center', width: W - MARGIN * 2, lineBreak: false });
            }
            doc.flushPages();
            doc.end();
            stream.on('finish', resolve);
            stream.on('error', reject);
        });
    }
    pdfSectionHeader(doc, margin, title) {
        doc.moveDown(0.6);
        this.pdfCheckPage(doc, 40);
        const y = doc.y;
        doc.rect(margin, y, 4, 20).fill(C.blue);
        doc.fillColor(C.navy).fontSize(11).font('Helvetica-Bold')
            .text(title, margin + 12, y + 3, { lineBreak: false });
        doc.text('', margin, y + 28);
    }
    pdfInfoGrid(doc, margin, rows) {
        const W = doc.page.width;
        const COL_W = (W - margin * 2) / 2;
        const LABEL_W = 80;
        const VALUE_W = COL_W - LABEL_W - 16;
        const CELL_PAD_V = 6;
        const MIN_ROW_H = 26;
        for (let i = 0; i < rows.length; i += 2) {
            let rowH = MIN_ROW_H;
            for (let col = 0; col < 2; col++) {
                const idx = i + col;
                if (idx >= rows.length)
                    break;
                const [, value] = rows[idx];
                doc.font('Helvetica').fontSize(9);
                const h = doc.heightOfString(value, { width: VALUE_W });
                rowH = Math.max(rowH, h + CELL_PAD_V * 2);
            }
            this.pdfCheckPage(doc, rowH + 4);
            const y = doc.y;
            const isEven = Math.floor(i / 2) % 2 === 1;
            const bg = isEven ? C.slate50 : C.white;
            doc.rect(margin, y, W - margin * 2, rowH).fill(bg);
            doc.rect(margin, y, W - margin * 2, rowH).stroke(C.slate200).lineWidth(0.5);
            for (let col = 0; col < 2; col++) {
                const idx = i + col;
                if (idx >= rows.length)
                    break;
                const [label, value] = rows[idx];
                const cx = margin + col * COL_W;
                doc.fillColor(C.slate500).fontSize(8).font('Helvetica-Bold')
                    .text(label, cx + 8, y + CELL_PAD_V, { width: LABEL_W, lineBreak: false });
                doc.fillColor(C.slate700).fontSize(9).font('Helvetica')
                    .text(value, cx + LABEL_W + 8, y + CELL_PAD_V, { width: VALUE_W });
            }
            doc.text('', margin, y + rowH + 2);
        }
        doc.moveDown(0.5);
    }
    pdfTable(doc, margin, columns, rows) {
        const totalW = columns.reduce((s, c) => s + c.width, 0);
        const HEADER_H = 26;
        const MIN_ROW_H = 22;
        const CELL_PAD = 6;
        const pageBottom = doc.page.height - (doc.page.margins?.bottom ?? 50) - 20;
        const drawHeader = (yPos) => {
            doc.rect(margin, yPos, totalW, HEADER_H).fill(C.blueHdr);
            doc.moveTo(margin, yPos + HEADER_H).lineTo(margin + totalW, yPos + HEADER_H)
                .strokeColor(C.blue).lineWidth(1).stroke();
            let cx = margin;
            for (const col of columns) {
                doc.fillColor(C.white).fontSize(8.5).font('Helvetica-Bold')
                    .text(col.header, cx + CELL_PAD, yPos + 9, { width: col.width - CELL_PAD * 2, lineBreak: false });
                cx += col.width;
            }
            return yPos + HEADER_H;
        };
        this.pdfCheckPage(doc, HEADER_H + MIN_ROW_H);
        let y = drawHeader(doc.y);
        for (let i = 0; i < rows.length; i++) {
            let rowH = MIN_ROW_H;
            for (let j = 0; j < rows[i].length && j < columns.length; j++) {
                const cell = rows[i][j];
                const col = columns[j];
                if (!cell.badge && cell.text) {
                    doc.font('Helvetica').fontSize(8.5);
                    const textH = doc.heightOfString(cell.text, { width: col.width - CELL_PAD * 2 });
                    rowH = Math.max(rowH, textH + CELL_PAD * 2);
                }
            }
            if (y + rowH > pageBottom) {
                doc.addPage();
                y = (doc.page.margins?.top ?? 50) + 32;
                y = drawHeader(y);
            }
            const rowBg = i % 2 === 0 ? C.white : C.slate50;
            doc.rect(margin, y, totalW, rowH).fill(rowBg);
            doc.moveTo(margin, y + rowH - 0.5).lineTo(margin + totalW, y + rowH - 0.5)
                .strokeColor(C.slate200).lineWidth(0.5).stroke();
            let cellX = margin;
            for (let j = 0; j < rows[i].length && j < columns.length; j++) {
                const cell = rows[i][j];
                const col = columns[j];
                if (cell.badge) {
                    const bw = Math.min(col.width - 10, 68);
                    const bh = 14;
                    const bx = cellX + (col.width - bw) / 2;
                    const by = y + (rowH - bh) / 2;
                    doc.roundedRect(bx, by, bw, bh, 7).fill(cell.badge.bg);
                    doc.fillColor(cell.badge.fg).fontSize(7.5).font('Helvetica-Bold')
                        .text(cell.text, bx, by + 4, { width: bw, align: 'center', lineBreak: false });
                }
                else {
                    doc.fillColor(C.slate700).fontSize(8.5).font('Helvetica')
                        .text(cell.text, cellX + CELL_PAD, y + CELL_PAD, { width: col.width - CELL_PAD * 2 });
                }
                cellX += col.width;
            }
            y += rowH;
        }
        doc.text('', margin, y + 12);
    }
    pdfCheckPage(doc, neededH) {
        const pageBottom = doc.page.height - (doc.page.margins?.bottom ?? 50) - 20;
        if (doc.y + neededH > pageBottom) {
            doc.addPage();
            doc.text('', doc.page.margins?.left ?? 50, (doc.page.margins?.top ?? 50) + 36);
        }
    }
    pdfEmpty(doc, margin, msg) {
        const y = doc.y;
        doc.rect(margin, y, doc.page.width - margin * 2, 30).fill(C.slate50);
        doc.fillColor(C.slate400).fontSize(9).font('Helvetica')
            .text(msg, margin + 10, y + 9, { width: doc.page.width - margin * 2 - 20, lineBreak: false });
        doc.text('', margin, y + 38);
    }
    riskBadge(level) {
        const map = {
            low: { bg: C.riskLowBg, fg: C.riskLow },
            medium: { bg: C.riskMediumBg, fg: C.riskMedium },
            high: { bg: C.riskHighBg, fg: C.riskHigh },
            critical: { bg: C.riskCritBg, fg: C.riskCritical },
        };
        return map[level] ?? { bg: C.slate100, fg: C.slate700 };
    }
    statusBadge(status) {
        const map = {
            pending: { bg: '#FEF9C3', fg: '#B45309' },
            in_progress: { bg: '#DBEAFE', fg: '#1D4ED8' },
            completed: { bg: '#DCFCE7', fg: '#15803D' },
            overdue: { bg: '#FEE2E2', fg: '#B91C1C' },
            cancelled: { bg: C.slate100, fg: C.slate600 },
        };
        return map[status] ?? { bg: C.slate100, fg: C.slate700 };
    }
    categoryBadge(category) {
        const color = CATEGORY_COLORS[category] ?? C.slate500;
        return { bg: color + '22', fg: color };
    }
    async generateDocx(type, assessment, filePath) {
        const SPACING = { after: 120 };
        const children = [];
        children.push(new docx_1.Paragraph({
            children: [new docx_1.TextRun({ text: 'AEP SAAS PLATFORM', color: DC.navy, size: 16, characterSpacing: 80 })],
            spacing: { before: 0, after: 60 },
        }));
        children.push(new docx_1.Paragraph({
            children: [new docx_1.TextRun({ text: this.reportTypeLabel(type), color: DC.blue, size: 52, bold: true })],
            spacing: { after: 120 },
        }));
        children.push(new docx_1.Paragraph({
            children: [new docx_1.TextRun({ text: assessment?.organization?.name ?? '', color: DC.navy, size: 28, bold: true })],
            spacing: { after: 60 },
        }));
        children.push(new docx_1.Paragraph({
            children: [new docx_1.TextRun({ text: assessment?.title ?? '', color: '475569', size: 22 })],
            spacing: { after: 60 },
        }));
        children.push(new docx_1.Paragraph({
            children: [new docx_1.TextRun({ text: `Gerado em ${new Date().toLocaleString('pt-BR')}`, color: '64748B', size: 18 })],
            spacing: { after: 400 },
        }));
        const critCount = assessment?.riskAssessments?.filter((r) => r.riskLevel === 'critical').length ?? 0;
        children.push(this.docxStatsTable([
            { label: 'Atividades', value: String(assessment?.activities?.length ?? 0), color: DC.blue },
            { label: 'Perigos', value: String(assessment?.hazards?.length ?? 0), color: '7C3AED' },
            { label: 'Riscos', value: String(assessment?.riskAssessments?.length ?? 0), color: 'DB2777' },
            { label: 'Críticos', value: String(critCount), color: DC.riskCritical },
            { label: 'Planos de Ação', value: String(assessment?.actionPlans?.length ?? 0), color: DC.riskLow },
        ]));
        children.push(new docx_1.Paragraph({ text: '', spacing: { after: 300 } }));
        children.push(this.docxSectionHeading('IDENTIFICAÇÃO DA AVALIAÇÃO'));
        const infoRows = [
            ['Título', assessment?.title ?? '—'],
            ['Organização', assessment?.organization?.name ?? '—'],
            ['Escopo', assessment?.scope ?? '—'],
            ['Metodologia', assessment?.methodology ?? '—'],
            ['Status', assessment?.status ?? '—'],
        ];
        children.push(this.docxInfoTable(infoRows));
        children.push(new docx_1.Paragraph({ text: '', spacing: SPACING }));
        if (type === 'aep' || type === 'risk_inventory') {
            children.push(this.docxSectionHeading('PERIGOS IDENTIFICADOS'));
            const hazards = assessment?.hazards ?? [];
            if (hazards.length > 0) {
                children.push(this.docxDataTable(['Perigo', 'Categoria', 'Atividade', 'Trab. Expostos', 'Controles'], hazards.map((h) => [
                    { text: h.name },
                    { text: h.category, color: DC.blue },
                    { text: h.activity?.name ?? '—' },
                    { text: String(h.exposedWorkerCount ?? '—') },
                    { text: h.existingControls ?? '—' },
                ])));
            }
            children.push(new docx_1.Paragraph({ text: '', spacing: SPACING }));
            children.push(this.docxSectionHeading('INVENTÁRIO DE RISCOS'));
            const risks = assessment?.riskAssessments ?? [];
            if (risks.length > 0) {
                children.push(this.docxDataTable(['Perigo', 'Severidade', 'Probabilidade', 'Score', 'Nível de Risco', 'Risco Residual'], risks.map((r) => [
                    { text: r.hazard.name },
                    { text: SEVERITY_LABELS[r.severity] ?? r.severity },
                    { text: PROBABILITY_LABELS[r.probability] ?? r.probability },
                    { text: String(r.riskScore) },
                    { text: RISK_LEVEL_LABELS[r.riskLevel] ?? r.riskLevel, riskLevel: r.riskLevel },
                    {
                        text: r.residualLevel ? RISK_LEVEL_LABELS[r.residualLevel] ?? r.residualLevel : '—',
                        riskLevel: r.residualLevel ?? undefined,
                    },
                ])));
            }
            children.push(new docx_1.Paragraph({ text: '', spacing: SPACING }));
        }
        if (type === 'action_plan' || type === 'aep') {
            children.push(this.docxSectionHeading('PLANOS DE AÇÃO'));
            for (const plan of assessment?.actionPlans ?? []) {
                children.push(new docx_1.Paragraph({
                    children: [new docx_1.TextRun({ text: plan.title, bold: true, color: DC.blue, size: 24 })],
                    spacing: { before: 240, after: 80 },
                }));
                if (plan.objective) {
                    children.push(new docx_1.Paragraph({
                        children: [
                            new docx_1.TextRun({ text: 'Objetivo: ', bold: true, color: '334155', size: 20 }),
                            new docx_1.TextRun({ text: plan.objective, color: '475569', size: 20 }),
                        ],
                        spacing: { after: 120 },
                    }));
                }
                if (plan.items.length > 0) {
                    children.push(this.docxDataTable(['Ação', 'Responsável', 'Prazo', 'Status', 'Indicadores'], plan.items.map((item) => [
                        { text: item.action },
                        { text: item.responsibleName },
                        { text: new Date(item.dueDate).toLocaleDateString('pt-BR') },
                        { text: STATUS_LABELS[item.status] ?? item.status, actionStatus: item.status },
                        { text: item.successIndicators ?? '—' },
                    ])));
                }
                children.push(new docx_1.Paragraph({ text: '', spacing: SPACING }));
            }
        }
        const doc = new docx_1.Document({
            styles: {
                paragraphStyles: [
                    {
                        id: 'Normal',
                        name: 'Normal',
                        run: { font: 'Calibri', size: 22, color: '1E293B' },
                    },
                ],
            },
            sections: [{ children }],
        });
        const buffer = await docx_1.Packer.toBuffer(doc);
        fs.writeFileSync(filePath, buffer);
    }
    docxSectionHeading(title) {
        return new docx_1.Paragraph({
            children: [new docx_1.TextRun({ text: title, bold: true, color: DC.navy, size: 26 })],
            heading: docx_1.HeadingLevel.HEADING_1,
            spacing: { before: 320, after: 160 },
            border: {
                bottom: { style: docx_1.BorderStyle.SINGLE, size: 6, color: DC.blue, space: 4 },
            },
        });
    }
    docxInfoTable(rows) {
        return new docx_1.Table({
            width: { size: 100, type: docx_1.WidthType.PERCENTAGE },
            rows: rows.map((row, i) => new docx_1.TableRow({
                children: [
                    new docx_1.TableCell({
                        width: { size: 20, type: docx_1.WidthType.PERCENTAGE },
                        children: [new docx_1.Paragraph({
                                children: [new docx_1.TextRun({ text: row[0], bold: true, color: DC.navy, size: 20 })],
                                spacing: { before: 60, after: 60 },
                            })],
                        shading: i % 2 === 0
                            ? { type: docx_1.ShadingType.SOLID, color: DC.slate100, fill: DC.slate100 }
                            : { type: docx_1.ShadingType.SOLID, color: DC.white, fill: DC.white },
                        borders: this.docxThinBorder(),
                    }),
                    new docx_1.TableCell({
                        width: { size: 80, type: docx_1.WidthType.PERCENTAGE },
                        children: [new docx_1.Paragraph({
                                children: [new docx_1.TextRun({ text: row[1], color: '334155', size: 20 })],
                                spacing: { before: 60, after: 60 },
                            })],
                        shading: i % 2 === 0
                            ? { type: docx_1.ShadingType.SOLID, color: DC.slate100, fill: DC.slate100 }
                            : { type: docx_1.ShadingType.SOLID, color: DC.white, fill: DC.white },
                        borders: this.docxThinBorder(),
                    }),
                ],
            })),
        });
    }
    docxStatsTable(stats) {
        return new docx_1.Table({
            width: { size: 100, type: docx_1.WidthType.PERCENTAGE },
            rows: [
                new docx_1.TableRow({
                    children: stats.map((s) => new docx_1.TableCell({
                        children: [
                            new docx_1.Paragraph({
                                children: [new docx_1.TextRun({ text: s.value, bold: true, color: s.color, size: 48 })],
                                alignment: docx_1.AlignmentType.CENTER,
                                spacing: { before: 80, after: 40 },
                            }),
                            new docx_1.Paragraph({
                                children: [new docx_1.TextRun({ text: s.label, color: '64748B', size: 16 })],
                                alignment: docx_1.AlignmentType.CENTER,
                                spacing: { after: 80 },
                            }),
                        ],
                        shading: { type: docx_1.ShadingType.SOLID, color: DC.slate50, fill: DC.slate50 },
                        borders: this.docxThinBorder(),
                    })),
                }),
            ],
        });
    }
    docxDataTable(headers, rows) {
        const colWidths = this.distributeWidths(headers.length);
        return new docx_1.Table({
            width: { size: 100, type: docx_1.WidthType.PERCENTAGE },
            rows: [
                new docx_1.TableRow({
                    tableHeader: true,
                    children: headers.map((h, i) => new docx_1.TableCell({
                        width: { size: colWidths[i], type: docx_1.WidthType.PERCENTAGE },
                        children: [new docx_1.Paragraph({
                                children: [new docx_1.TextRun({ text: h, bold: true, color: DC.white, size: 18 })],
                                spacing: { before: 80, after: 80 },
                            })],
                        shading: { type: docx_1.ShadingType.SOLID, color: DC.blueHdr, fill: DC.blueHdr },
                        borders: this.docxThinBorderWhite(),
                    })),
                }),
                ...rows.map((row, i) => new docx_1.TableRow({
                    children: row.map((cell, j) => {
                        const riskBg = cell.riskLevel ? this.docxRiskBg(cell.riskLevel) : null;
                        const riskFg = cell.riskLevel ? this.docxRiskFg(cell.riskLevel) : null;
                        const statusBg = cell.actionStatus ? this.docxStatusBg(cell.actionStatus) : null;
                        const statusFg = cell.actionStatus ? this.docxStatusFg(cell.actionStatus) : null;
                        const rowBg = i % 2 === 0 ? DC.white : DC.slate50;
                        const cellBg = riskBg ?? statusBg ?? rowBg;
                        const textColor = riskFg ?? statusFg ?? (cell.color ?? '1E293B');
                        return new docx_1.TableCell({
                            width: { size: colWidths[j], type: docx_1.WidthType.PERCENTAGE },
                            children: [new docx_1.Paragraph({
                                    children: [new docx_1.TextRun({
                                            text: cell.text,
                                            size: 18,
                                            color: textColor,
                                            bold: !!(riskBg || statusBg),
                                        })],
                                    spacing: { before: 60, after: 60 },
                                    alignment: riskBg || statusBg ? docx_1.AlignmentType.CENTER : docx_1.AlignmentType.LEFT,
                                })],
                            shading: { type: docx_1.ShadingType.SOLID, color: cellBg, fill: cellBg },
                            borders: this.docxThinBorder(),
                        });
                    }),
                })),
            ],
        });
    }
    docxRiskBg(level) {
        const m = {
            low: DC.riskLowBg, medium: DC.riskMedBg, high: DC.riskHighBg, critical: DC.riskCritBg,
        };
        return m[level] ?? DC.white;
    }
    docxRiskFg(level) {
        const m = {
            low: DC.riskLow, medium: DC.riskMedium, high: DC.riskHigh, critical: DC.riskCritical,
        };
        return m[level] ?? '1E293B';
    }
    docxStatusBg(status) {
        const m = {
            pending: 'FEF9C3', in_progress: 'DBEAFE', completed: DC.riskLowBg,
            overdue: DC.riskCritBg, cancelled: DC.slate100,
        };
        return m[status] ?? DC.white;
    }
    docxStatusFg(status) {
        const m = {
            pending: 'B45309', in_progress: '1D4ED8', completed: DC.riskLow,
            overdue: DC.riskCritical, cancelled: '475569',
        };
        return m[status] ?? '1E293B';
    }
    docxThinBorder() {
        const b = { style: docx_1.BorderStyle.SINGLE, size: 4, color: DC.slate200 };
        return { top: b, bottom: b, left: b, right: b };
    }
    docxThinBorderWhite() {
        const b = { style: docx_1.BorderStyle.SINGLE, size: 2, color: '3B5998' };
        return { top: b, bottom: b, left: b, right: b };
    }
    distributeWidths(colCount) {
        const base = Math.floor(100 / colCount);
        const remainder = 100 - base * colCount;
        return Array.from({ length: colCount }, (_, i) => base + (i === 0 ? remainder : 0));
    }
    async generateXlsx(type, assessment, filePath) {
        const wb = new ExcelJS.Workbook();
        wb.creator = 'AEP SaaS Platform';
        wb.created = new Date();
        wb.lastModifiedBy = 'AEP SaaS';
        wb.modified = new Date();
        const summary = wb.addWorksheet('Resumo');
        summary.properties.tabColor = { argb: XC.blue };
        summary.mergeCells('A1:G1');
        const titleCell = summary.getCell('A1');
        titleCell.value = `${this.reportTypeLabel(type)}  —  ${assessment?.organization?.name ?? ''}`;
        titleCell.font = { bold: true, size: 16, color: { argb: XC.white }, name: 'Calibri' };
        titleCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: XC.navy } };
        titleCell.alignment = { vertical: 'middle', horizontal: 'left', indent: 2 };
        summary.getRow(1).height = 44;
        summary.mergeCells('A2:G2');
        const subtitleCell = summary.getCell('A2');
        subtitleCell.value = assessment?.title ?? '';
        subtitleCell.font = { size: 11, color: { argb: 'FF64748B' }, italic: true };
        subtitleCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF0F172A' } };
        subtitleCell.alignment = { vertical: 'middle', horizontal: 'left', indent: 2 };
        summary.getRow(2).height = 26;
        summary.getRow(3).height = 12;
        const critCount = assessment?.riskAssessments?.filter((r) => r.riskLevel === 'critical').length ?? 0;
        const statsData = [
            { label: 'Atividades', value: assessment?.activities?.length ?? 0, color: XC.blue, bg: 'FFDBEAFE' },
            { label: 'Perigos', value: assessment?.hazards?.length ?? 0, color: 'FF7C3AED', bg: 'FFEDE9FE' },
            { label: 'Riscos', value: assessment?.riskAssessments?.length ?? 0, color: 'FFDB2777', bg: 'FFFCE7F3' },
            { label: 'Críticos', value: critCount, color: XC.riskCritical, bg: XC.riskCritical.replace('FF', 'FFFEE2E2').slice(0, 8) },
            { label: 'Planos de Ação', value: assessment?.actionPlans?.length ?? 0, color: 'FF16A34A', bg: 'FFDCFCE7' },
        ];
        const riskCritBg = 'FFFEE2E2';
        const statsColors = [
            { color: XC.blue, bg: 'FFDBEAFE' },
            { color: 'FF7C3AED', bg: 'FFEDE9FE' },
            { color: 'FFDB2777', bg: 'FFFCE7F3' },
            { color: 'FFDC2626', bg: riskCritBg },
            { color: 'FF16A34A', bg: 'FFDCFCE7' },
        ];
        for (let i = 0; i < statsData.length; i++) {
            const col = String.fromCharCode(65 + i * 1 + (i > 0 ? i : 0));
        }
        ['A', 'B', 'C', 'D', 'E'].forEach((col, i) => {
            const st = statsData[i];
            const sc = statsColors[i];
            summary.mergeCells(`${col}4:${col}5`);
            summary.mergeCells(`${col}6:${col}7`);
            const valueCell = summary.getCell(`${col}4`);
            valueCell.value = st.value;
            valueCell.font = { bold: true, size: 24, color: { argb: sc.color }, name: 'Calibri' };
            valueCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: sc.bg } };
            valueCell.alignment = { vertical: 'bottom', horizontal: 'center' };
            summary.getRow(4).height = 24;
            summary.getRow(5).height = 10;
            const labelCell = summary.getCell(`${col}6`);
            labelCell.value = st.label;
            labelCell.font = { size: 9, color: { argb: 'FF64748B' }, name: 'Calibri' };
            labelCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: sc.bg } };
            labelCell.alignment = { vertical: 'top', horizontal: 'center' };
            summary.getRow(6).height = 14;
            summary.getRow(7).height = 10;
            summary.getColumn(col).width = 18;
        });
        summary.getRow(8).height = 14;
        const metaRows = [
            ['Organização', assessment?.organization?.name],
            ['Escopo', assessment?.scope ?? undefined],
            ['Metodologia', assessment?.methodology ?? undefined],
            ['Status', assessment?.status],
            ['Gerado em', new Date().toLocaleString('pt-BR')],
        ];
        metaRows.forEach(([label, value], i) => {
            const r = 9 + i;
            summary.getCell(`A${r}`).value = label;
            summary.getCell(`A${r}`).font = { bold: true, size: 10, color: { argb: XC.navy } };
            summary.getCell(`A${r}`).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: XC.slate100 } };
            summary.mergeCells(`B${r}:E${r}`);
            summary.getCell(`B${r}`).value = value ?? '—';
            summary.getCell(`B${r}`).font = { size: 10, color: { argb: 'FF334155' } };
            summary.getRow(r).height = 20;
        });
        if (type === 'aep' || type === 'risk_inventory') {
            const hazardSheet = wb.addWorksheet('Perigos');
            hazardSheet.properties.tabColor = { argb: 'FF7C3AED' };
            hazardSheet.columns = [
                { header: 'Perigo', key: 'name', width: 40 },
                { header: 'Categoria', key: 'category', width: 20 },
                { header: 'Atividade', key: 'activity', width: 30 },
                { header: 'Trabalhadores Expostos', key: 'workers', width: 22 },
                { header: 'Controles Existentes', key: 'controls', width: 42 },
                { header: 'Descrição de Exposição', key: 'exposure', width: 40 },
            ];
            this.xlsxStyleSheet(hazardSheet);
            (assessment?.hazards ?? []).forEach((h, i) => {
                const row = hazardSheet.addRow({
                    name: h.name,
                    category: h.category,
                    activity: h.activity?.name ?? '',
                    workers: h.exposedWorkerCount ?? '',
                    controls: h.existingControls ?? '',
                    exposure: h.exposureDescription ?? '',
                });
                this.xlsxStyleDataRow(row, i);
            });
            const riskSheet = wb.addWorksheet('Inventário de Riscos');
            riskSheet.properties.tabColor = { argb: 'FFDB2777' };
            riskSheet.columns = [
                { header: 'Perigo', key: 'hazard', width: 40 },
                { header: 'Categoria', key: 'category', width: 20 },
                { header: 'Severidade', key: 'severity', width: 18 },
                { header: 'Probabilidade', key: 'probability', width: 18 },
                { header: 'Score', key: 'score', width: 10 },
                { header: 'Nível de Risco', key: 'level', width: 18 },
                { header: 'Risco Residual', key: 'residual', width: 18 },
                { header: 'Justificativa', key: 'justification', width: 40 },
            ];
            this.xlsxStyleSheet(riskSheet);
            (assessment?.riskAssessments ?? []).forEach((r, i) => {
                const row = riskSheet.addRow({
                    hazard: r.hazard.name,
                    category: r.hazard.category,
                    severity: SEVERITY_LABELS[r.severity] ?? r.severity,
                    probability: PROBABILITY_LABELS[r.probability] ?? r.probability,
                    score: r.riskScore,
                    level: RISK_LEVEL_LABELS[r.riskLevel] ?? r.riskLevel,
                    residual: r.residualLevel ? RISK_LEVEL_LABELS[r.residualLevel] ?? r.residualLevel : '—',
                    justification: r.justification ?? '',
                });
                this.xlsxStyleDataRow(row, i);
                const levelArgb = this.xlsxRiskArgb(r.riskLevel);
                const levelCell = row.getCell('level');
                levelCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: levelArgb } };
                levelCell.font = { bold: true, size: 10, color: { argb: this.xlsxRiskFgArgb(r.riskLevel) } };
                levelCell.alignment = { horizontal: 'center', vertical: 'middle' };
                if (r.residualLevel) {
                    const resArgb = this.xlsxRiskArgb(r.residualLevel);
                    const resCell = row.getCell('residual');
                    resCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: resArgb } };
                    resCell.font = { bold: true, size: 10, color: { argb: this.xlsxRiskFgArgb(r.residualLevel) } };
                    resCell.alignment = { horizontal: 'center', vertical: 'middle' };
                }
                const scoreCell = row.getCell('score');
                scoreCell.alignment = { horizontal: 'center', vertical: 'middle' };
                scoreCell.font = { bold: true, size: 11 };
            });
        }
        if (type === 'action_plan' || type === 'aep') {
            const planSheet = wb.addWorksheet('Planos de Ação');
            planSheet.properties.tabColor = { argb: 'FF16A34A' };
            planSheet.columns = [
                { header: 'Plano', key: 'plan', width: 36 },
                { header: 'Ação', key: 'action', width: 46 },
                { header: 'Responsável', key: 'responsible', width: 26 },
                { header: 'Prazo', key: 'due', width: 14 },
                { header: 'Status', key: 'status', width: 18 },
                { header: 'Indicadores', key: 'indicators', width: 40 },
            ];
            this.xlsxStyleSheet(planSheet);
            let rowIdx = 0;
            for (const plan of assessment?.actionPlans ?? []) {
                for (const item of plan.items) {
                    const row = planSheet.addRow({
                        plan: plan.title,
                        action: item.action,
                        responsible: item.responsibleName,
                        due: new Date(item.dueDate).toLocaleDateString('pt-BR'),
                        status: STATUS_LABELS[item.status] ?? item.status,
                        indicators: item.successIndicators ?? '',
                    });
                    this.xlsxStyleDataRow(row, rowIdx++);
                    const statusArgb = this.xlsxStatusArgb(item.status);
                    const statusFg = this.xlsxStatusFgArgb(item.status);
                    const statusCell = row.getCell('status');
                    statusCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: statusArgb } };
                    statusCell.font = { bold: true, size: 10, color: { argb: statusFg } };
                    statusCell.alignment = { horizontal: 'center', vertical: 'middle' };
                }
            }
        }
        await wb.xlsx.writeFile(filePath);
    }
    xlsxStyleSheet(sheet) {
        const headerRow = sheet.getRow(1);
        headerRow.height = 28;
        headerRow.eachCell((cell) => {
            cell.font = { bold: true, color: { argb: XC.white }, size: 10, name: 'Calibri' };
            cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: XC.blueHdr } };
            cell.alignment = { vertical: 'middle', horizontal: 'left', wrapText: false };
            cell.border = this.xlsxBorder('FF3B5998');
        });
        sheet.views = [{ state: 'frozen', ySplit: 1, showGridLines: true }];
        sheet.autoFilter = { from: { row: 1, column: 1 }, to: { row: 1, column: sheet.columns.length } };
    }
    xlsxStyleDataRow(row, index) {
        const bg = index % 2 === 0 ? XC.white : XC.slate50;
        row.height = 20;
        row.eachCell((cell) => {
            if (!cell.fill || cell.fill.fgColor?.argb === XC.white || cell.fill.fgColor?.argb === XC.slate50) {
                cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: bg } };
            }
            cell.font = cell.font ?? { size: 10, name: 'Calibri', color: { argb: 'FF1E293B' } };
            if (!cell.font.size)
                cell.font = { ...cell.font, size: 10, name: 'Calibri' };
            cell.alignment = { vertical: 'middle', wrapText: true };
            cell.border = this.xlsxBorder(XC.slate200);
        });
    }
    xlsxBorder(color) {
        const side = 'thin';
        const b = { style: side, color: { argb: color } };
        return { top: b, bottom: b, left: b, right: b };
    }
    xlsxRiskArgb(level) {
        const m = {
            low: XC.riskLow, medium: XC.riskMedium, high: XC.riskHigh, critical: XC.riskCritical,
        };
        return m[level] ?? XC.slate50;
    }
    xlsxRiskFgArgb(level) {
        const m = {
            low: 'FF14532D', medium: 'FF78350F', high: 'FF7C2D12', critical: 'FF7F1D1D',
        };
        return m[level] ?? 'FF1E293B';
    }
    xlsxStatusArgb(status) {
        const m = {
            pending: XC.statusPending,
            in_progress: XC.statusInProgress,
            completed: XC.statusCompleted,
            overdue: XC.statusOverdue,
            cancelled: XC.statusCancelled,
        };
        return m[status] ?? XC.white;
    }
    xlsxStatusFgArgb(status) {
        const m = {
            pending: 'FFB45309',
            in_progress: 'FF1D4ED8',
            completed: 'FF15803D',
            overdue: 'FFB91C1C',
            cancelled: 'FF475569',
        };
        return m[status] ?? 'FF1E293B';
    }
    reportTypeLabel(type) {
        const labels = {
            aep: 'Relatório AEP', risk_inventory: 'Inventário de Riscos', action_plan: 'Plano de Ação',
        };
        return labels[type] ?? type;
    }
};
exports.ReportProcessor = ReportProcessor;
__decorate([
    (0, bull_1.Process)('generate'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ReportProcessor.prototype, "handleGenerate", null);
exports.ReportProcessor = ReportProcessor = ReportProcessor_1 = __decorate([
    (0, bull_1.Processor)(reporting_service_1.REPORT_QUEUE),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        reporting_service_1.ReportingService])
], ReportProcessor);
//# sourceMappingURL=report.processor.js.map