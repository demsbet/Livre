/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BookChapter, BookBenefit, Testimonial, FAQItem } from "./types";
import authorPortrait from "./assets/images/author_portrait_exact_v2_1780143348819.png";
import bookCover from "./assets/images/book_cover_1780131365477.png";
import financialCharts from "./assets/images/financial_charts_africa_1780131404194.png";

export const AUTHOR_INFO = {
  name: "Steeves SIEWE DE KALAMBAK",
  role: "Auteur Financier & Analyste en Investissements",
  bio: "Steeves SIEWE DE KALAMBAK est un expert en finance de marché et ingénierie financière, passionné par la démocratisation de l'investissement en Afrique. Fort d'une expérience solide au cœur des écosystèmes d'Afrique francophone et internationale, il a conçu 'La Bourse en Afrique' pour offrir aux cadres, entrepreneurs et particuliers un guide pratique, pragmatique et décomplexé pour investir avec sérénité et succès.",
  extendedBio: "Après avoir constaté le déficit d'éducation financière et le manque de publications adaptées à notre contexte économique d'Afrique Centrale (la BVMAC), Steeves a concentré ses efforts pour traduire des concepts complexes en stratégies actionnables. Il accompagne aujourd'hui des centaines d'investisseurs de la zone CEMAC et de la diaspora à travers ses écrits, conférences et programmes d'accompagnement d'élite.",
  whatsappNumber: "+33 6 25 25 31 43", 
  whatsappMessage: "Bonjour M. Steeves SIEWE DE KALAMBAK, je souhaite commander votre livre 'La Bourse en Afrique'.",
  email: "kalambaksteeves@yahoo.fr",
};

export const BOOK_DETAILS = {
  title: "La Bourse en Afrique",
  subtitle: "Guide méthodologique et pratique pour bâtir votre liberté financière sur les marchés boursiers africains",
  pricePaper: "35 €",
  originalPricePaper: "45 €",
  pages: 316,
  language: "Français",
  format: "Papier Relié Premium",
  releaseYear: "2026",
};

export const BOOK_CHAPTERS: BookChapter[] = [
  {
    id: "chap-1",
    number: "01",
    title: "Généralités sur la bourse",
    description: "Les notions fondamentales pour s'initier aux mécanismes boursiers : comment fonctionne le marché, le rôle des actions et des obligations, et les principes de l'épargne active dans l'écosystème financier de la zone CEMAC.",
    highlights: [
      "Démystifier le fonctionnement d'un marché boursier moderne",
      "La distinction essentielle entre actions (titres de propriété) et obligations (titres de créance)",
      "Comment transformer l'épargne passive en investissement créateur de richesse durable"
    ]
  },
  {
    id: "chap-2",
    number: "02",
    title: "Évolution de la règlementation boursière en Afrique centrale",
    description: "L'histoire, les grandes étapes et l'importance de l'unification de l'encadrement juridique du marché boursier d'Afrique Centrale pour sécuriser les épargnants.",
    highlights: [
      "Les réformes boursières majeures ayant conduit à l'unification du marché financier régional",
      "Le cadre légal protecteur mis en place pour sécuriser les placements des souscripteurs et particuliers",
      "Les évolutions règlementaires encourageant la participation active de l'actionnariat populaire"
    ]
  },
  {
    id: "chap-3",
    number: "03",
    title: "Les institutions et les acteurs boursiers en Afrique centrale",
    description: "Une cartographie claire de l'architecture institutionnelle : le rôle protecteur de la COSUMAF, la BVMAC comme plateforme de transaction, et les Sociétés de Bourse.",
    highlights: [
      "Le rôle de surveillance, de visa et de contrôle opéré par la COSUMAF",
      "Le fonctionnement opérationnel de la BVMAC et le rôle pivot du Dépositaire Central unique",
      "Comment identifier et solliciter les Sociétés de Bourse habilitées dans la sous-région"
    ]
  },
  {
    id: "chap-4",
    number: "04",
    title: "Rôle des autorités publiques dans le développement de la bourse",
    description: "Pourquoi et comment les États d'Afrique Centrale dynamisent le marché financier par le biais d'incitations fiscales, d'emprunts obligataires et de privatisations d'entreprises clés.",
    highlights: [
      "Le cadre stimulant mis en place par les autorités publiques de la CEMAC pour doper les marchés",
      "Le mécanisme d'émission des emprunts obligataires souverains et leur attractivité",
      "L'impact des privatisations d'entreprises d'État structurantes sur le dynamisme boursier"
    ]
  },
  {
    id: "chap-5",
    number: "05",
    title: "État des lieux du marché des valeurs mobilières en Afrique centrale",
    description: "Une analyse lucide et approfondie du marché régional : volumes d'échanges, capitalisation boursière, et opportunités de valorisation encore inexploitées.",
    highlights: [
      "La capitalisation boursière globale et la composition sectorielle de la BVMAC actuelle",
      "Évaluation des forces, des opportunités de liquidité et d'arbitrage sur des titres d'élite",
      "Pourquoi l'Afrique Centrale constitue l'une des frontières d'investissement les plus attractives"
    ]
  },
  {
    id: "chap-6",
    number: "06",
    title: "Les instruments financiers sur la BVMAC",
    description: "Tout sur les outils négociables disponibles en zone CEMAC : de l'investissement dans des actions d'élite (Socapalm, Safacam, Bange, etc.) aux obligations d'États.",
    highlights: [
      "Focus détaillé sur les actions phares cotées et leur historique régulier de dividendes",
      "Les obligations d'États et leur profil de risque/performance optimal pour les épargnants",
      "Méthodologie concrète pour analyser un instrument financier avant son achat"
    ]
  },
  {
    id: "chap-7",
    number: "07",
    title: "Les défis du développement de la bourse en Afrique centrale",
    description: "Un décryptage lucide des obstacles structurels à lever : culture financière de masse, intégration des PME d'excellence, et intégration du grand public.",
    highlights: [
      "Combler le déficit de culture financière et démystifier l'investissement boursier auprès de la population",
      "Développer la liquidité en facilitant l'accès des comptes-titres au grand public",
      "L'enjeu de l'introduction boursière des fleurons du secteur privé régional et des PME d'élite"
    ]
  },
  {
    id: "chap-8",
    number: "08",
    title: "Les opportunités de croissance et de diversification de la BVMAC",
    description: "Stratégies d'expansion pour le marché : captation de l'épargne de la diaspora, émergence des fonds de placement collectifs (OPCVM), et diversification sectorielle.",
    highlights: [
      "Canaliser l'épargne de la diaspora vers des projets créateurs de richesse via le marché boursier",
      "Favoriser la création d'OPCVM (FCP et SICAV) pour permettre une gestion diversifiée simplifiée",
      "Perspectives de cotations croisées et de partenariats stratégiques régionaux"
    ]
  },
  {
    id: "chap-9",
    number: "09",
    title: "Le rôle de la technologie dans le développement de la BVMAC",
    description: "Comment la révolution technologique, le mobile money et le courtage par smartphone transforment l'accès à la bourse, le rendant instantané et grand public.",
    highlights: [
      "Démocratisation boursière grâce à l'intégration du Mobile Money et des canaux digitaux mobiles",
      "L'accès sécurisé en temps réel aux informations de marché par les investisseurs individuels",
      "Les innovations Fintech qui redéfinissent l'intermédiation financière en Afrique Centrale"
    ]
  }
];

export const BOOK_BENEFITS: BookBenefit[] = [
  {
    id: "benefit-1",
    title: "100% Adapté à l'Afrique Centrale (CEMAC)",
    description: "Contrairement aux manuels américains ou d'Afrique de l'Ouest (BRVM), ce livre se concentre à 100% sur la BVMAC, les Sociétés de Bourse agréées par la COSUMAF et la fiscalité CEMAC.",
    icon: "Globe"
  },
  {
    id: "benefit-2",
    title: "Pédagogie Simple et Ultra-Visuelle",
    description: "Oubliez le jargon académique imbuvable. Chaque concept est illustré par des schémas d'époque, des graphiques réels et des analogies de la vie de tous les jours.",
    icon: "BookOpen"
  },
  {
    id: "benefit-3",
    title: "Études de Cas Réelles (BVMAC)",
    description: "Des analyses pas à pas d'actions phares cotées sur la BVMAC (SOCAPALM, SAFACAM, BANGE, etc.) pour vous apprendre à isoler de vraies opportunités de croissance de valeur.",
    icon: "TrendingUp"
  },
  {
    id: "benefit-4",
    title: "Feuille de Route Actionnable",
    description: "Repartez avec un guide d'étape en étape pour ouvrir votre compte titre, sélectionner vos premières actions et placer des ordres sur smartphone.",
    icon: "CheckCircle"
  }
];

export const TESTIMONIALS: Testimonial[] = [
  {
    id: "test-1",
    name: "Jean-Paul Ndong",
    role: "Responsable Logistique & Investisseur",
    company: "Libreville, Gabon",
    content: "Pendant des années, je pensais que la BVMAC était réservée aux institutionnels ou aux initiés d'Afrique Centrale. Ce livre a tout changé pour moi. J'ai ouvert mon compte-titres et perçu mes premiers dividendes de la SOCAPALM !",
    avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&h=150&q=80",
    rating: 5
  },
  {
    id: "test-2",
    name: "Dr. Sandrine Ngo Mbalke",
    role: "Médecin Généraliste",
    company: "Yaoundé, Cameroun",
    content: "Un ouvrage exceptionnel de clarté sur la bourse d'Afrique Centrale. M. Steeves SIEWE DE KALAMBAK allie rigueur scientifique et fluidité d'écriture. Mon seul regret est de ne pas l'avoir lu plus tôt.",
    avatarUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&h=150&q=80",
    rating: 5
  },
  {
    id: "test-3",
    name: "Christian Bekolo",
    role: "Co-fondateur d'une startup technologique",
    company: "Douala, Cameroun",
    content: "Le guide sur les Sociétés de Bourse agréées par la COSUMAF est d'une utilité publique. Tout y est transparent, sans filtre. Un investissement indispensable pour toute personne voulant investir en Afrique Centrale.",
    avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&h=150&q=80",
    rating: 5
  }
];

export const FAQ_ITEMS: FAQItem[] = [
  {
    id: "faq-1",
    question: "Faut-il un gros capital pour commencer à investir grâce à ce livre ?",
    answer: "Absolument pas. Le livre vous montre comment vous pouvez commencer à investir en bourse d'Afrique Centrale (BVMAC) avec de petites sommes mensuelles, en tirant parti des actions accessibles comme SOCAPALM, SAFACAM, la Régionale, BANGE, etc."
  },
  {
    id: "faq-2",
    question: "Quelle est la qualité de fabrication de l'ouvrage physique ?",
    answer: "Le livre est édité avec un niveau d'exigence exceptionnel. Il s'agit d'un livre broché de format premium édité sur un papier bouffant crème antireflet de qualité supérieure de haute facture, doté d'une couverture rigide élégante et durable. Un magnifique ouvrage conçu pour embellir votre bibliothèque de rentier et résister au temps."
  },
  {
    id: "faq-3",
    question: "Comment se déroule la livraison ?",
    answer: "Nous expédions et livrons principalement au Cameroun, Gabon, Congo, Tchad, RCA, Guinée Équatoriale (zone CEMAC) ainsi que la diaspora via des livraisons express ou points relais sécurisés. La livraison est coordonnée de manière fluide avec l'auteur et ses distributeurs agréés par WhatsApp."
  },
  {
    id: "faq-4",
    question: "Le livre explique-t-il comment choisir concrètement sa Société de Bourse ?",
    answer: "Oui, un chapitre entier est dédié au comparatif des Sociétés de Bourse de la sous-région CEMAC, leurs frais de tenue de compte, et la procédure exacte pour y ouvrir un compte à distance en toute légalité."
  }
];

export const SITE_IMAGES = {
  authorPortrait,
  bookCover,
  financialCharts,
  bookCoverFront: bookCover,
  bookCoverBack: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=600&q=80",
};

