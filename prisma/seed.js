/**
 * Seed de la base de données - Portail SHT
 * Crée les comptes de démo, directions, projets et données fictives.
 */
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function hashPwd(pwd) {
  return bcrypt.hash(pwd, 10);
}

async function main() {
  console.log('Demarrage du seed...');

  // Mode idempotent : si l'admin existe déjà, on ne refait rien
  const force = process.env.SEED_FORCE === 'true' || process.argv.includes('--force');
  const existingAdmin = await prisma.user.findUnique({
    where: { email: 'admin@sht-td.com' },
  }).catch(() => null);

  if (existingAdmin && !force) {
    console.log('✓ Base deja peuplee (compte admin trouve). Passez SEED_FORCE=true pour forcer.');
    return;
  }

  if (force) {
    console.log('⚠ SEED_FORCE actif : nettoyage de la base...');
    // Nettoyage (ordre pour respecter les FK)
    await prisma.auditLog.deleteMany();
    await prisma.notification.deleteMany();
    await prisma.widgetConfig.deleteMany();
    await prisma.message.deleteMany();
    await prisma.annonce.deleteMany();
    await prisma.tache.deleteMany();
    await prisma.risque.deleteMany();
    await prisma.projetMembre.deleteMany();
    await prisma.documentValidation.deleteMany();
    await prisma.documentHistorique.deleteMany();
    await prisma.document.deleteMany();
    await prisma.projet.deleteMany();
    await prisma.depense.deleteMany();
    await prisma.contrat.deleteMany();
    await prisma.budget.deleteMany();
    await prisma.evaluation.deleteMany();
    await prisma.presence.deleteMany();
    await prisma.conge.deleteMany();
    await prisma.systemSetting.deleteMany();
    await prisma.user.deleteMany();
    await prisma.direction.deleteMany();
  }

  // === DIRECTIONS ===
  console.log('Creation des directions...');
  const dirDG = await prisma.direction.create({
    data: { nom: 'Direction Générale', code: 'DG', description: 'Direction générale de la SHT' },
  });
  const dirExplo = await prisma.direction.create({
    data: { nom: 'Direction Exploration & Production', code: 'DEP', description: 'Exploration et production des hydrocarbures' },
  });
  const dirFin = await prisma.direction.create({
    data: { nom: 'Direction Financière', code: 'DF', description: 'Finances et comptabilité' },
  });
  const dirRH = await prisma.direction.create({
    data: { nom: 'Direction des Ressources Humaines', code: 'DRH', description: 'Gestion des ressources humaines' },
  });
  const dirIT = await prisma.direction.create({
    data: { nom: 'Direction des Systèmes d\'Information', code: 'DSI', description: 'Informatique et systèmes' },
  });
  const dirJur = await prisma.direction.create({
    data: { nom: 'Direction Juridique', code: 'DJ', description: 'Affaires juridiques et contrats' },
  });

  // === UTILISATEURS ===
  console.log('Creation des utilisateurs...');
  const admin = await prisma.user.create({
    data: {
      email: 'admin@sht-td.com',
      password: await hashPwd('Admin@SHT2025'),
      nom: 'ADMIN',
      prenom: 'Super',
      poste: 'Administrateur Système',
      role: 'SUPER_ADMIN',
      directionId: dirIT.id,
      telephone: '+235 66 00 00 01',
    },
  });

  const dg = await prisma.user.create({
    data: {
      email: 'dg@sht-td.com',
      password: await hashPwd('DG@SHT2025'),
      nom: 'DJASNABAYE',
      prenom: 'Mahamat',
      poste: 'Directeur Général',
      role: 'DIRECTEUR',
      directionId: dirDG.id,
      telephone: '+235 66 00 00 02',
    },
  });

  const agent = await prisma.user.create({
    data: {
      email: 'agent@sht-td.com',
      password: await hashPwd('Agent@SHT2025'),
      nom: 'NGARBAYE',
      prenom: 'Pierre',
      poste: 'Ingénieur Production',
      role: 'AGENT',
      directionId: dirExplo.id,
      telephone: '+235 66 00 00 03',
    },
  });

  // Directeurs de chaque direction
  const directeurFin = await prisma.user.create({
    data: {
      email: 'directeur.finance@sht-td.com',
      password: await hashPwd('Directeur@SHT2025'),
      nom: 'HASSAN',
      prenom: 'Abdoulaye',
      poste: 'Directeur Financier',
      role: 'DIRECTEUR',
      directionId: dirFin.id,
      telephone: '+235 66 00 00 10',
    },
  });

  const directeurRH = await prisma.user.create({
    data: {
      email: 'directeur.rh@sht-td.com',
      password: await hashPwd('Directeur@SHT2025'),
      nom: 'MBAÏHADJIM',
      prenom: 'Léa',
      poste: 'Directrice RH',
      role: 'DIRECTEUR',
      directionId: dirRH.id,
      telephone: '+235 66 00 00 11',
    },
  });

  const directeurExplo = await prisma.user.create({
    data: {
      email: 'directeur.exploration@sht-td.com',
      password: await hashPwd('Directeur@SHT2025'),
      nom: 'DOUBRAGNE',
      prenom: 'Jonas',
      poste: 'Directeur E&P',
      role: 'DIRECTEUR',
      directionId: dirExplo.id,
      telephone: '+235 66 00 00 12',
    },
  });

  // Met à jour les directions avec leurs responsables
  await prisma.direction.update({ where: { id: dirDG.id }, data: { responsableId: dg.id } });
  await prisma.direction.update({ where: { id: dirFin.id }, data: { responsableId: directeurFin.id } });
  await prisma.direction.update({ where: { id: dirRH.id }, data: { responsableId: directeurRH.id } });
  await prisma.direction.update({ where: { id: dirExplo.id }, data: { responsableId: directeurExplo.id } });

  // Quelques agents supplémentaires
  const agents = [];
  const agentNames = [
    { nom: 'DJIMET', prenom: 'Fatimé', poste: 'Comptable', dir: dirFin.id },
    { nom: 'OUSMAN', prenom: 'Brahim', poste: 'Géologue', dir: dirExplo.id },
    { nom: 'KOSSOUMNA', prenom: 'Marie', poste: 'Assistante RH', dir: dirRH.id },
    { nom: 'NDILBE', prenom: 'David', poste: 'Développeur', dir: dirIT.id },
    { nom: 'MAHAMAT', prenom: 'Aïssa', poste: 'Juriste', dir: dirJur.id },
    { nom: 'BEASSOUM', prenom: 'Pascal', poste: 'Analyste Financier', dir: dirFin.id },
    { nom: 'TOUROUMGAYE', prenom: 'Sarah', poste: 'Technicien Production', dir: dirExplo.id },
  ];

  for (const a of agentNames) {
    const u = await prisma.user.create({
      data: {
        email: `${a.prenom.toLowerCase()}.${a.nom.toLowerCase()}@sht-td.com`,
        password: await hashPwd('Agent@SHT2025'),
        nom: a.nom,
        prenom: a.prenom,
        poste: a.poste,
        role: 'AGENT',
        directionId: a.dir,
        telephone: '+235 66 00 0' + Math.floor(10 + Math.random() * 90),
      },
    });
    agents.push(u);
  }

  // === BUDGETS ===
  console.log('Creation des budgets...');
  const annee = new Date().getFullYear();
  const directions = [dirDG, dirExplo, dirFin, dirRH, dirIT, dirJur];
  for (const d of directions) {
    await prisma.budget.create({
      data: {
        directionId: d.id,
        annee,
        montantAlloue: Math.floor(Math.random() * 500000000) + 100000000,
        montantConsomme: Math.floor(Math.random() * 80000000),
        description: `Budget annuel ${annee} - ${d.nom}`,
      },
    });
  }

  // === PROJETS ===
  console.log('Creation des projets...');
  const projetSedigui = await prisma.projet.create({
    data: {
      titre: 'Projet Sédigui',
      code: 'SDG-2025',
      description: 'Développement du champ pétrolier de Sédigui',
      statut: 'EN_COURS',
      dateDebut: new Date('2025-01-15'),
      dateFin: new Date('2026-12-31'),
      budget: 1500000000,
      avancement: 35,
      chefProjetId: directeurExplo.id,
      directionId: dirExplo.id,
    },
  });

  const projetDjarmaya = await prisma.projet.create({
    data: {
      titre: 'Projet Djarmaya',
      code: 'DJM-2025',
      description: 'Extension de la raffinerie de Djarmaya',
      statut: 'EN_COURS',
      dateDebut: new Date('2025-03-01'),
      dateFin: new Date('2027-06-30'),
      budget: 2800000000,
      avancement: 20,
      chefProjetId: dg.id,
      directionId: dirDG.id,
    },
  });

  const projetModernisation = await prisma.projet.create({
    data: {
      titre: 'Modernisation du SI',
      code: 'SI-2025',
      description: 'Modernisation du système d\'information de la SHT',
      statut: 'PLANIFIE',
      dateDebut: new Date('2025-06-01'),
      dateFin: new Date('2026-05-31'),
      budget: 350000000,
      avancement: 10,
      chefProjetId: admin.id,
      directionId: dirIT.id,
    },
  });

  // === TÂCHES ===
  console.log('Creation des taches...');
  await prisma.tache.createMany({
    data: [
      { projetId: projetSedigui.id, titre: 'Étude sismique zone A', statut: 'TERMINEE', priorite: 'HAUTE', assigneId: agent.id, dateDebut: new Date('2025-01-20'), deadline: new Date('2025-04-30'), avancement: 100 },
      { projetId: projetSedigui.id, titre: 'Forage puits SDG-01', statut: 'EN_COURS', priorite: 'URGENTE', assigneId: agents[1].id, dateDebut: new Date('2025-05-01'), deadline: new Date('2025-09-30'), avancement: 60 },
      { projetId: projetSedigui.id, titre: 'Analyse des carottes', statut: 'A_FAIRE', priorite: 'NORMALE', assigneId: agents[6].id, deadline: new Date('2025-11-30'), avancement: 0 },
      { projetId: projetDjarmaya.id, titre: 'Étude d\'impact environnemental', statut: 'EN_COURS', priorite: 'HAUTE', assigneId: agents[4].id, dateDebut: new Date('2025-03-15'), deadline: new Date('2025-08-15'), avancement: 70 },
      { projetId: projetDjarmaya.id, titre: 'Négociation contrats fournisseurs', statut: 'A_FAIRE', priorite: 'HAUTE', assigneId: directeurFin.id, deadline: new Date('2025-10-30'), avancement: 0 },
      { projetId: projetModernisation.id, titre: 'Cahier des charges', statut: 'EN_COURS', priorite: 'NORMALE', assigneId: agents[3].id, dateDebut: new Date('2025-06-01'), deadline: new Date('2025-07-30'), avancement: 50 },
    ],
  });

  // === ANNONCES ===
  console.log('Creation des annonces...');
  await prisma.annonce.createMany({
    data: [
      {
        titre: 'Bienvenue sur le nouveau portail SHT',
        contenu: 'Chers collaborateurs, nous avons le plaisir de vous présenter le nouveau portail de gestion interne de la SHT. Cette plateforme centralise tous nos outils de travail.',
        categorie: 'GENERALE',
        epingle: true,
        auteurId: dg.id,
      },
      {
        titre: 'Mise à jour de la politique de congés',
        contenu: 'La politique de congés a été mise à jour. Veuillez consulter le document officiel dans la GED.',
        categorie: 'RH',
        auteurId: directeurRH.id,
      },
      {
        titre: 'Projet Sédigui : avancement à 35%',
        contenu: 'Le projet Sédigui atteint un jalon majeur avec 35% d\'avancement. Félicitations à toute l\'équipe !',
        categorie: 'PROJET',
        auteurId: directeurExplo.id,
      },
      {
        titre: 'Maintenance programmée du système',
        contenu: 'Une maintenance du système aura lieu samedi prochain de 22h à 02h.',
        categorie: 'URGENT',
        auteurId: admin.id,
      },
    ],
  });

  // === CONGÉS ===
  console.log('Creation des conges...');
  await prisma.conge.create({
    data: {
      agentId: agent.id,
      dateDebut: new Date('2025-07-01'),
      dateFin: new Date('2025-07-15'),
      nbJours: 15,
      type: 'ANNUEL',
      motif: 'Vacances d\'été',
      statut: 'APPROUVE',
      approbateurId: directeurExplo.id,
      dateDecision: new Date('2025-06-15'),
    },
  });
  await prisma.conge.create({
    data: {
      agentId: agents[0].id,
      dateDebut: new Date('2025-08-10'),
      dateFin: new Date('2025-08-20'),
      nbJours: 11,
      type: 'ANNUEL',
      statut: 'EN_ATTENTE',
    },
  });

  // === DEPENSES ===
  console.log('Creation des depenses...');
  await prisma.depense.createMany({
    data: [
      {
        reference: 'DEP-2025-0001',
        libelle: 'Achat matériel informatique',
        description: 'Ordinateurs portables pour nouveaux agents',
        montant: 4500000,
        categorie: 'IT',
        statut: 'APPROUVEE',
        demandeurId: admin.id,
        validateurId: directeurFin.id,
        directionId: dirIT.id,
        dateValidation: new Date(),
      },
      {
        reference: 'DEP-2025-0002',
        libelle: 'Mission terrain Sédigui',
        description: 'Frais de mission pour l\'équipe technique',
        montant: 1200000,
        categorie: 'Mission',
        statut: 'SOUMISE',
        demandeurId: agent.id,
        directionId: dirExplo.id,
      },
    ],
  });

  // === NOTIFICATIONS ===
  console.log('Creation des notifications...');
  await prisma.notification.createMany({
    data: [
      { userId: dg.id, titre: 'Nouveau document à valider', message: 'Le rapport mensuel est en attente de validation', type: 'DOCUMENT' },
      { userId: agent.id, titre: 'Congé approuvé', message: 'Votre demande de congé a été approuvée', type: 'CONGE' },
      { userId: admin.id, titre: 'Bienvenue', message: 'Bienvenue sur le portail SHT', type: 'INFO' },
    ],
  });

  // === PARAMETRES SYSTEME ===
  console.log('Creation des parametres systeme...');
  await prisma.systemSetting.createMany({
    data: [
      { cle: 'SITE_NAME', valeur: 'Portail SHT', description: 'Nom du site' },
      { cle: 'SITE_TAGLINE', valeur: 'Société des Hydrocarbures du Tchad', description: 'Slogan' },
      { cle: 'MAINTENANCE_MODE', valeur: 'false', description: 'Mode maintenance' },
      { cle: 'PRODUCTION_OBJECTIF_JOUR', valeur: '120000', description: 'Objectif production barils/jour' },
    ],
  });

  console.log('\n✓ Seed termine avec succes !\n');
  console.log('=== Comptes de demonstration ===');
  console.log('Super Admin : admin@sht-td.com / Admin@SHT2025');
  console.log('Directeur   : dg@sht-td.com / DG@SHT2025');
  console.log('Agent       : agent@sht-td.com / Agent@SHT2025');
  console.log('================================\n');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
