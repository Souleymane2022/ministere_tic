export interface Organisme {
  id: string;
  sigle: string;
  nom: string;
  description: string;
  missions: string[];
  couleur: string;
  icon: string;
  logo: string;
  siteWeb?: string;
}

export const organismes: Organisme[] = [
  {
    id: 'adetic',
    sigle: 'ADETIC',
    nom: 'Agence de Developpement des Technologies de l\'Information et de la Communication',
    description: 'L\'ADETIC est l\'agence gouvernementale chargee de promouvoir, developper et coordonner les initiatives liees aux technologies de l\'information et de la communication au Tchad. Elle joue un role central dans la mise en oeuvre de la strategie numerique nationale.',
    missions: [
      'Promouvoir le developpement des TIC au Tchad',
      'Coordonner les projets de transformation numerique',
      'Developper les infrastructures numeriques nationales',
      'Accompagner la digitalisation de l\'administration publique',
      'Favoriser l\'innovation technologique',
    ],
    couleur: '#002664',
    icon: 'Monitor',
    logo: '/images/logos/adetic.svg',
  },
  {
    id: 'arcep',
    sigle: 'ARCEP',
    nom: 'Autorite de Regulation des Communications Electroniques et des Postes',
    description: 'L\'ARCEP est l\'autorite independante chargee de reguler le secteur des communications electroniques et des services postaux au Tchad. Elle veille a la concurrence loyale, a la qualite des services et a la protection des consommateurs.',
    missions: [
      'Reguler le marche des telecommunications',
      'Proteger les droits des consommateurs',
      'Attribuer les licences et frequences',
      'Controler la qualite des services',
      'Promouvoir la concurrence loyale',
    ],
    couleur: '#C60C30',
    icon: 'Shield',
    logo: '/images/logos/arcep.svg',
  },
  {
    id: 'la-poste',
    sigle: 'La Poste',
    nom: 'Societe Tchadienne des Postes',
    description: 'La Poste du Tchad assure le service postal universel sur l\'ensemble du territoire national. Elle offre des services de courrier, de colis, de transfert d\'argent et de services financiers postaux.',
    missions: [
      'Assurer le service postal universel',
      'Distribuer le courrier et les colis',
      'Offrir des services financiers postaux',
      'Moderniser les infrastructures postales',
      'Developper les services numeriques postaux',
    ],
    couleur: '#FECB00',
    icon: 'Mail',
    logo: '/images/logos/la-poste.svg',
  },
  {
    id: 'enastic',
    sigle: 'ENASTIC',
    nom: 'Ecole Nationale Superieure des Technologies de l\'Information et de la Communication',
    description: 'L\'ENASTIC est l\'etablissement d\'enseignement superieur public specialise dans la formation aux metiers des TIC. Elle forme les ingenieurs et techniciens qui constituent le capital humain necessaire a la transformation numerique du Tchad.',
    missions: [
      'Former les ingenieurs et techniciens en TIC',
      'Conduire des recherches en technologies numeriques',
      'Delivrer des diplomes reconnus par l\'Etat',
      'Developper des partenariats academiques internationaux',
      'Contribuer a l\'innovation technologique nationale',
    ],
    couleur: '#003a94',
    icon: 'GraduationCap',
    logo: '/images/logos/enastic.svg',
  },
  {
    id: 'patn',
    sigle: 'PATN',
    nom: 'Projet d\'Acces aux Technologies Numeriques',
    description: 'Le PATN est un projet strategique visant a democratiser l\'acces aux technologies numeriques pour l\'ensemble de la population tchadienne, en particulier dans les zones rurales et les communautes defavorisees.',
    missions: [
      'Democratiser l\'acces au numerique',
      'Deployer des centres communautaires numeriques',
      'Reduire la fracture numerique',
      'Former les populations aux outils numeriques',
      'Connecter les zones rurales',
    ],
    couleur: '#0066CC',
    icon: 'Globe',
    logo: '/images/logos/patn.svg',
  },
  {
    id: 'safitel',
    sigle: 'SAFITEL',
    nom: 'Societe Africaine de Fibre et de Telecommunications',
    description: 'SAFITEL est l\'operateur d\'infrastructure charge du deploiement et de la gestion du reseau de fibre optique au Tchad. La societe joue un role cle dans la connectivite nationale et l\'integration numerique regionale.',
    missions: [
      'Deployer le reseau national de fibre optique',
      'Gerer l\'infrastructure de telecommunications',
      'Assurer la connectivite internationale',
      'Maintenir les reseaux de transmission',
      'Developper les interconnexions regionales',
    ],
    couleur: '#1a8a3f',
    icon: 'Cable',
    logo: '/images/logos/safitel.svg',
  },
  {
    id: 'atpe',
    sigle: 'ATPE',
    nom: 'Agence Tchadienne de Presse et d\'Edition',
    description: 'L\'ATPE est l\'agence nationale chargee de la collecte, du traitement et de la diffusion de l\'information officielle. Elle contribue a la communication gouvernementale et a la promotion de la presse numerique.',
    missions: [
      'Collecter et diffuser l\'information officielle',
      'Promouvoir la presse numerique',
      'Accompagner la transition vers les medias digitaux',
      'Former les journalistes aux outils numeriques',
      'Archiver le patrimoine mediatique national',
    ],
    couleur: '#8B4513',
    icon: 'Newspaper',
    logo: '/images/logos/atpe.svg',
  },
];
