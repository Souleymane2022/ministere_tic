export interface Service {
  id: string;
  titre: string;
  description: string;
  icon: string;
  details: string[];
  lien?: string;
}

export const services: Service[] = [
  {
    id: 'telecommunications',
    titre: 'Telecommunications',
    description: 'Regulation et developpement des infrastructures de telecommunications sur l\'ensemble du territoire national, incluant les reseaux mobiles, la fibre optique et les services satellitaires.',
    icon: 'Radio',
    details: [
      'Regulation du secteur des telecoms',
      'Attribution des licences et frequences',
      'Supervision de la qualite de service',
      'Developpement de l\'infrastructure reseau',
      'Promotion de la couverture nationale',
    ],
  },
  {
    id: 'economie-numerique',
    titre: 'Economie Numerique',
    description: 'Promotion de l\'ecosysteme numerique tchadien, soutien a l\'entrepreneuriat digital et developpement des services numeriques innovants pour stimuler la croissance economique.',
    icon: 'TrendingUp',
    details: [
      'Soutien aux startups et PME numeriques',
      'Developpement du commerce electronique',
      'Promotion des paiements mobiles',
      'Incubation et acceleration d\'entreprises',
      'Financement de l\'innovation',
    ],
  },
  {
    id: 'e-gouvernance',
    titre: 'E-Gouvernance',
    description: 'Digitalisation de l\'administration publique pour offrir des services plus efficaces, transparents et accessibles aux citoyens tchadiens.',
    icon: 'Building2',
    details: [
      'Digitalisation des services publics',
      'Plateforme de demarches en ligne',
      'Identite numerique nationale',
      'Interoperabilite des systemes publics',
      'Transparence et gouvernance ouverte',
    ],
  },
  {
    id: 'services-postaux',
    titre: 'Services Postaux',
    description: 'Modernisation et regulation des services postaux nationaux, incluant la distribution du courrier, les services de colis et les services financiers postaux.',
    icon: 'Mail',
    details: [
      'Service postal universel',
      'Distribution du courrier et colis',
      'Services financiers postaux',
      'Modernisation des bureaux de poste',
      'Integration des services numeriques',
    ],
  },
  {
    id: 'formation-numerique',
    titre: 'Formation Numerique',
    description: 'Programmes de formation et de renforcement des capacites pour developper les competences numeriques de la population tchadienne et former les professionnels du secteur.',
    icon: 'BookOpen',
    details: [
      'Formation professionnelle en TIC',
      'Programmes universitaires specialises',
      'Alphabetisation numerique',
      'Certifications professionnelles',
      'Echanges et bourses internationales',
    ],
  },
  {
    id: 'cybersecurite',
    titre: 'Cybersecurite',
    description: 'Protection de l\'espace cybernetique national, lutte contre la cybercriminalite et sensibilisation des citoyens et des entreprises aux bonnes pratiques de securite numerique.',
    icon: 'ShieldCheck',
    details: [
      'Protection des infrastructures critiques',
      'Lutte contre la cybercriminalite',
      'Sensibilisation a la securite numerique',
      'Cadre juridique de la cybersecurite',
      'Centre national de reponse aux incidents',
    ],
  },
];

export const statistiques = [
  { label: 'Abonnes Mobiles', valeur: 8500000, suffix: '+', icon: 'Smartphone' },
  { label: 'Km de Fibre Optique', valeur: 7200, suffix: 'km', icon: 'Cable' },
  { label: 'Services Digitalises', valeur: 45, suffix: '+', icon: 'Monitor' },
  { label: 'Jeunes Formes en TIC', valeur: 25000, suffix: '+', icon: 'Users' },
];
