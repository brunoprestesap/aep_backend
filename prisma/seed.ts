import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding AEP database...');

  // ============================================================
  // TENANT + ADMIN USER
  // ============================================================

  const tenant = await prisma.tenant.upsert({
    where: { slug: 'demo' },
    update: {},
    create: {
      name: 'Demo Empresa',
      slug: 'demo',
      plan: 'professional',
    },
  });

  console.log(`Tenant: ${tenant.name} (${tenant.id})`);

  const passwordHash = await bcrypt.hash('Admin@123', 12);

  await prisma.user.upsert({
    where: {
      tenantId_email: { tenantId: tenant.id, email: 'admin@demo.com' },
    },
    update: {},
    create: {
      tenantId: tenant.id,
      name: 'Administrador',
      email: 'admin@demo.com',
      passwordHash,
      role: 'admin',
    },
  });

  await prisma.user.upsert({
    where: {
      tenantId_email: { tenantId: tenant.id, email: 'consultor@demo.com' },
    },
    update: {},
    create: {
      tenantId: tenant.id,
      name: 'Consultor Demo',
      email: 'consultor@demo.com',
      passwordHash: await bcrypt.hash('Consultor@123', 12),
      role: 'consultant',
    },
  });

  console.log('Users seeded.');

  // ============================================================
  // RISK MATRIX – Padrão NR-01 4×3
  // ============================================================

  const matrix = await prisma.riskMatrix.create({
    data: {
      tenantId: tenant.id,
      name: 'Matriz Padrão NR-01 4x3',
      version: '1.0',
      isDefault: true,
      severityLevels: {
        create: [
          { code: 'S1', name: 'Leve',     weight: 1, description: 'Consequências leves e reversíveis' },
          { code: 'S2', name: 'Moderada', weight: 2, description: 'Afastamento curto possível' },
          { code: 'S3', name: 'Alta',     weight: 3, description: 'Consequências graves com potencial de afastamento' },
          { code: 'S4', name: 'Crítica',  weight: 4, description: 'Consequências muito graves ou irreversíveis' },
        ],
      },
      probabilityLevels: {
        create: [
          { code: 'P1', name: 'Baixa', weight: 1, description: 'Exposição eventual com controles eficazes' },
          { code: 'P2', name: 'Média', weight: 2, description: 'Exposição frequente com controles parciais' },
          { code: 'P3', name: 'Alta',  weight: 3, description: 'Exposição frequente sem controles' },
        ],
      },
    },
  });

  console.log(`Risk matrix: ${matrix.name} (${matrix.id})`);

  // ============================================================
  // GLOBAL HAZARD CATALOG
  // ============================================================

  const globalHazards = [
    // Ergonômico – físico
    { category: 'ergonomic' as const, name: 'Postura inadequada prolongada',    description: 'Posturas estáticas mantidas por longos períodos',         possibleConsequences: 'Dor lombar, cervicalgia, DORT',         suggestedControls: 'Ajuste de posto, pausas, adequação ergonômica' },
    { category: 'ergonomic' as const, name: 'Movimentos repetitivos',            description: 'Alta repetição de movimentos em ciclos curtos',           possibleConsequences: 'LER/DORT, fadiga muscular',              suggestedControls: 'Rodízio de tarefas, pausas e automação parcial' },
    { category: 'ergonomic' as const, name: 'Levantamento manual de cargas',     description: 'Movimentação manual de peso com esforço físico',          possibleConsequences: 'Lombalgias, hérnias discais',            suggestedControls: 'Limitar peso, usar equipamentos auxiliares' },
    { category: 'ergonomic' as const, name: 'Mobiliário inadequado',             description: 'Mobiliário sem ajuste ergonômico',                        possibleConsequences: 'Desconforto postural, DORT',             suggestedControls: 'Substituir por mobiliário regulável' },
    // Ergonômico – cognitivo
    { category: 'ergonomic' as const, name: 'Alta exigência cognitiva',          description: 'Alta demanda de atenção e tomada de decisão',            possibleConsequences: 'Fadiga mental, erros, estresse',         suggestedControls: 'Revisão de carga, pausas cognitivas' },
    { category: 'ergonomic' as const, name: 'Interrupções frequentes',           description: 'Quebras constantes de foco na atividade',                possibleConsequences: 'Estresse, erros, retrabalho',            suggestedControls: 'Gestão do ambiente, blocos de trabalho focado' },
    { category: 'ergonomic' as const, name: 'Ritmo excessivo de trabalho',       description: 'Velocidade de execução acima do adequado',               possibleConsequences: 'Fadiga, DORT, estresse',                 suggestedControls: 'Revisão de metas e dimensionamento de equipe' },
    // Psicossocial
    { category: 'psychosocial' as const, name: 'Assédio no trabalho',            description: 'Condutas abusivas ou humilhantes',                       possibleConsequences: 'Transtornos mentais, afastamentos',      suggestedControls: 'Canal de denúncias, treinamento de liderança' },
    { category: 'psychosocial' as const, name: 'Sobrecarga de trabalho',         description: 'Volume de demandas superior à capacidade operacional',   possibleConsequences: 'Esgotamento, burnout, transtornos mentais', suggestedControls: 'Redistribuição de carga, dimensionamento de equipe' },
    { category: 'psychosocial' as const, name: 'Baixa autonomia no trabalho',    description: 'Baixa possibilidade de decisão sobre a tarefa',          possibleConsequences: 'Desmotivação, estresse crônico',         suggestedControls: 'Empoderamento, participação nas decisões' },
    { category: 'psychosocial' as const, name: 'Falta de suporte da liderança',  description: 'Ausência de apoio técnico ou gerencial',                 possibleConsequences: 'Insegurança, estresse, erros',           suggestedControls: 'Capacitação de líderes, feedback regular' },
    { category: 'psychosocial' as const, name: 'Conflitos interpessoais',        description: 'Relações de trabalho conflituosas',                      possibleConsequences: 'Estresse, absenteísmo, clima negativo',  suggestedControls: 'Mediação de conflitos, cultura organizacional' },
    { category: 'psychosocial' as const, name: 'Baixo reconhecimento',           description: 'Falta de valorização do trabalho realizado',             possibleConsequences: 'Desmotivação, rotatividade',             suggestedControls: 'Programas de reconhecimento, feedback positivo' },
    { category: 'psychosocial' as const, name: 'Trabalho remoto isolado',        description: 'Baixa interação social no trabalho remoto',              possibleConsequences: 'Solidão, ansiedade, baixo engajamento',  suggestedControls: 'Rituais de equipe, check-ins regulares' },
  ];

  for (const hazard of globalHazards) {
    await prisma.hazardCatalog.create({
      data: { ...hazard, isGlobal: true },
    });
  }

  console.log(`Hazard catalog seeded: ${globalHazards.length} entries.`);
  console.log('Seed complete.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
