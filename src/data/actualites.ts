export interface Actualite {
  id: string;
  slug: string;
  titre: string;
  resume: string;
  contenu: string;
  image: string;
  categorie: 'telecommunications' | 'numerique' | 'gouvernance' | 'formation' | 'international' | 'officiel';
  date: string;
  auteur: string;
  tags: string[];
  vedette: boolean;
}

export const categories = {
  telecommunications: { label: 'Telecommunications', color: 'bg-bleu' },
  numerique: { label: 'Economie Numerique', color: 'bg-jaune' },
  gouvernance: { label: 'E-Gouvernance', color: 'bg-rouge' },
  formation: { label: 'Formation', color: 'bg-bleu-light' },
  international: { label: 'International', color: 'bg-gris-700' },
  officiel: { label: 'Communique Officiel', color: 'bg-rouge-dark' },
};

export const actualites: Actualite[] = [
  {
    id: '1',
    slug: 'lancement-programme-tchad-numerique-2030',
    titre: 'Lancement du Programme Tchad Numerique 2030',
    resume: 'Le Ministre des Telecommunications a officiellement lance le programme ambitieux Tchad Numerique 2030, visant a transformer le paysage numerique du pays et a connecter l\'ensemble du territoire national.',
    contenu: `Le Ministere des Telecommunications, de l'Economie Numerique et de la Digitalisation de l'Administration a officiellement lance le programme "Tchad Numerique 2030", une initiative majeure visant a accelerer la transformation numerique du pays.

Ce programme ambitieux s'articule autour de plusieurs axes strategiques :

**1. Infrastructure Numerique**
Deploiement de la fibre optique sur l'ensemble du territoire national, avec un objectif de couverture de 80% des zones urbaines d'ici 2028 et 50% des zones rurales d'ici 2030.

**2. E-Gouvernance**
Digitalisation de 100% des services administratifs prioritaires, permettant aux citoyens d'acceder aux services publics en ligne, reduisant ainsi les delais et les couts.

**3. Formation et Capital Humain**
Formation de 50 000 jeunes Tchadiens aux metiers du numerique, en partenariat avec l'ENASTIC et les universites nationales.

**4. Economie Numerique**
Creation d'un ecosysteme favorable a l'innovation et a l'entrepreneuriat numerique, avec la mise en place d'incubateurs et de fonds d'investissement dedies.

Le Ministre a souligne que "ce programme est une priorite nationale qui permettra au Tchad de prendre sa place dans l'economie numerique mondiale".`,
    image: '/images/tchad-numerique.jpg',
    categorie: 'numerique',
    date: '2026-04-08',
    auteur: 'Direction de la Communication',
    tags: ['Tchad Numerique', 'Transformation Digitale', 'Programme National'],
    vedette: true,
  },
  {
    id: '2',
    slug: 'deploiement-fibre-optique-ndjamena',
    titre: 'Deploiement de la Fibre Optique a N\'Djamena : Phase 2 Achevee',
    resume: 'La deuxieme phase du deploiement de la fibre optique dans la capitale tchadienne est desormais achevee, connectant plus de 500 000 foyers au haut debit.',
    contenu: `La SAFITEL, en partenariat avec le MTENDA, annonce l'achevement de la deuxieme phase du deploiement de la fibre optique a N'Djamena. Cette etape majeure permet desormais a plus de 500 000 foyers de beneficier d'une connexion internet haut debit.

Les travaux, qui ont dure 18 mois, ont permis de poser plus de 2 000 kilometres de cables en fibre optique a travers la capitale. Cette infrastructure moderne garantit des debits allant jusqu'a 100 Mbps pour les particuliers et 1 Gbps pour les entreprises.

Le projet s'inscrit dans la strategie nationale de connectivite et vise a positionner N'Djamena comme un hub numerique regional.`,
    image: '/images/fibre-optique.jpg',
    categorie: 'telecommunications',
    date: '2026-04-05',
    auteur: 'SAFITEL',
    tags: ['Fibre Optique', 'Infrastructure', 'N\'Djamena', 'Connectivite'],
    vedette: true,
  },
  {
    id: '3',
    slug: 'formation-5000-jeunes-metiers-numerique',
    titre: 'L\'ENASTIC Lance la Formation de 5 000 Jeunes aux Metiers du Numerique',
    resume: 'L\'Ecole Nationale Superieure des TIC ouvre ses portes a 5 000 nouveaux etudiants dans le cadre du programme de formation aux metiers du numerique.',
    contenu: `L'ENASTIC, sous la tutelle du MTENDA, lance un programme de formation ambitieux destine a 5 000 jeunes Tchadiens. Cette initiative vise a combler le deficit de competences numeriques dans le pays et a former la prochaine generation de professionnels du secteur.

Les formations proposees couvrent un large spectre de competences :
- Developpement web et mobile
- Cybersecurite
- Administration de reseaux
- Intelligence artificielle et data science
- Marketing digital

Le programme beneficie du soutien financier de partenaires internationaux et offre des bourses d'etudes a hauteur de 60% des effectifs.`,
    image: '/images/formation-enastic.jpg',
    categorie: 'formation',
    date: '2026-04-02',
    auteur: 'ENASTIC',
    tags: ['Formation', 'Jeunesse', 'Competences Numeriques', 'ENASTIC'],
    vedette: false,
  },
  {
    id: '4',
    slug: 'nouveau-cadre-reglementaire-telecoms',
    titre: 'L\'ARCEP Adopte un Nouveau Cadre Reglementaire pour les Telecoms',
    resume: 'L\'Autorite de Regulation adopte de nouvelles dispositions visant a renforcer la concurrence et proteger les consommateurs dans le secteur des telecommunications.',
    contenu: `L'ARCEP du Tchad a adopte un nouveau cadre reglementaire visant a moderniser le secteur des telecommunications. Ce cadre introduit plusieurs innovations majeures :

- Renforcement de la protection des consommateurs avec de nouvelles obligations pour les operateurs
- Mise en place d'un mecanisme de portabilite des numeros mobiles
- Introduction de normes de qualite de service plus strictes
- Simplification des procedures d'attribution des licences

Cette reforme s'inscrit dans la volonte du gouvernement de creer un environnement competitif et favorable aux investissements dans le secteur des telecoms.`,
    image: '/images/arcep-regulation.jpg',
    categorie: 'telecommunications',
    date: '2026-03-28',
    auteur: 'ARCEP',
    tags: ['Regulation', 'ARCEP', 'Telecommunications', 'Reforme'],
    vedette: false,
  },
  {
    id: '5',
    slug: 'signature-accord-cooperation-numerique-ua',
    titre: 'Signature d\'un Accord de Cooperation Numerique avec l\'Union Africaine',
    resume: 'Le Tchad renforce sa cooperation numerique avec l\'Union Africaine par la signature d\'un accord strategique pour le developpement de l\'economie numerique en Afrique centrale.',
    contenu: `Le Ministre des Telecommunications a signe un accord de cooperation numerique avec l'Union Africaine lors du sommet de l'innovation technologique a Addis-Abeba. Cet accord prevoit :

- Le partage d'expertise en matiere de cybersecurite
- La mise en place d'un programme d'echanges entre les agences numeriques africaines
- Le financement conjoint de projets d'infrastructure numerique
- La creation d'un centre regional d'excellence en technologies emergentes

Ce partenariat strategique positionne le Tchad comme un acteur majeur de la transformation numerique en Afrique centrale.`,
    image: '/images/cooperation-ua.jpg',
    categorie: 'international',
    date: '2026-03-22',
    auteur: 'Direction de la Communication',
    tags: ['Union Africaine', 'Cooperation', 'Diplomatie Numerique'],
    vedette: true,
  },
  {
    id: '6',
    slug: 'digitalisation-services-etat-civil',
    titre: 'Digitalisation des Services d\'Etat Civil : Une Revolution Administrative',
    resume: 'Le MTENDA lance la plateforme numerique de gestion des actes d\'etat civil, permettant aux citoyens de faire leurs demarches en ligne.',
    contenu: `Le Ministere des Telecommunications lance la plateforme de digitalisation des services d'etat civil, une etape majeure dans la modernisation de l'administration publique tchadienne.

Cette plateforme permet desormais aux citoyens de :
- Demander des actes de naissance en ligne
- Obtenir des certificats de mariage numeriques
- Suivre l'etat de leurs demarches administratives
- Prendre rendez-vous dans les services d'etat civil

La plateforme, developpee par l'ADETIC, est accessible via un site web et une application mobile, et sera deployee progressivement dans les 23 provinces du Tchad.`,
    image: '/images/etat-civil-digital.jpg',
    categorie: 'gouvernance',
    date: '2026-03-18',
    auteur: 'ADETIC',
    tags: ['E-Gouvernance', 'Etat Civil', 'Services Publics', 'Digitalisation'],
    vedette: false,
  },
  {
    id: '7',
    slug: 'la-poste-modernise-services-postaux',
    titre: 'La Poste du Tchad Modernise ses Services avec le Numerique',
    resume: 'La Societe Tchadienne des Postes lance une plateforme de suivi de colis en temps reel et des services de paiement mobile.',
    contenu: `La Poste du Tchad, sous la tutelle du MTENDA, a lance une plateforme numerique innovante integrant le suivi de colis en temps reel et les services de paiement mobile.

Cette modernisation comprend :
- Un systeme de tracking GPS pour tous les envois
- L'integration des paiements mobiles (Mobile Money)
- Des bornes interactives dans les bureaux de poste
- Une application mobile pour les clients

Cette initiative vise a repositionner La Poste comme un acteur cle de la logistique numerique au Tchad.`,
    image: '/images/poste-moderne.jpg',
    categorie: 'numerique',
    date: '2026-03-12',
    auteur: 'La Poste du Tchad',
    tags: ['La Poste', 'Services Postaux', 'Modernisation', 'Mobile Money'],
    vedette: false,
  },
  {
    id: '8',
    slug: 'communique-conseil-ministres-tic',
    titre: 'Communique du Conseil des Ministres : Validation du Plan Strategique TIC 2026-2030',
    resume: 'Le Conseil des Ministres a valide le Plan Strategique de Developpement des Technologies de l\'Information et de la Communication pour la periode 2026-2030.',
    contenu: `Lors de sa session ordinaire, le Conseil des Ministres a valide le Plan Strategique de Developpement des TIC pour la periode 2026-2030, presente par le Ministre des Telecommunications.

Ce plan prevoit un investissement total de 500 milliards de FCFA sur cinq ans, repartis entre :
- Infrastructure de connectivite (40%)
- E-gouvernance et services numeriques (25%)
- Formation et capital humain (20%)
- Innovation et ecosysteme entrepreneurial (15%)

Le Conseil des Ministres a souligne l'importance strategique de ce plan pour le developpement economique et social du Tchad.`,
    image: '/images/conseil-ministres.jpg',
    categorie: 'officiel',
    date: '2026-03-08',
    auteur: 'Secretariat General du Gouvernement',
    tags: ['Conseil des Ministres', 'Plan Strategique', 'TIC', 'Budget'],
    vedette: false,
  },
];

export function getActualiteBySlug(slug: string): Actualite | undefined {
  return actualites.find(a => a.slug === slug);
}

export function getActualitesByCategorie(categorie: string): Actualite[] {
  return actualites.filter(a => a.categorie === categorie);
}

export function getActualitesVedette(): Actualite[] {
  return actualites.filter(a => a.vedette);
}
