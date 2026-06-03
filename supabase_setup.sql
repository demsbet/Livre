-- =========================================================================
-- PROJEKT: "La Bourse en Afrique" - SUPABASE DATABASE CONFIGURATION & SCHEMAS
-- AUTEUR: Siewe de Kalambak Steeves
-- TARGET ENVIRONMENT: Supabase (PostgreSQL 15+)
-- DATE GENEREE: 2026-05-30
-- =========================================================================

-- EXPLICATIONS PRELIMINAIRES :
-- Ce script configure des structures SQL prêtes pour la production,
-- incluant :
--  1. Les tables maîtresses de contenu dynamique (Auteur, Livre, Chapitres, Avantages, Témoignages, FAQ)
--  2. Les tables transactionnelles sécurisées (Commandes clients, Détails du panier d'achat)
--  3. Des triggers automatiques d'actualisation de date (updated_at)
--  4. Des vues analytiques pour suivre les statistiques de commande
--  5. La sécurité intégrée (Row Level Security - RLS) sous format de politiques Supabase

BEGIN;

-- =========================================================================
-- 0. NETTOYAGE ET SECURISATION PRELIMINAIRE (Optionnel)
-- =========================================================================
DROP VIEW IF EXISTS view_sales_summary CASCADE;
DROP VIEW IF EXISTS view_order_details CASCADE;
DROP TABLE IF EXISTS order_items CASCADE;
DROP TABLE IF EXISTS orders CASCADE;
DROP TABLE IF EXISTS faqs CASCADE;
DROP TABLE IF EXISTS testimonials CASCADE;
DROP TABLE IF EXISTS benefits CASCADE;
DROP TABLE IF EXISTS chapters CASCADE;
DROP TABLE IF EXISTS book_details CASCADE;
DROP TABLE IF EXISTS author_info CASCADE;
DROP TABLE IF EXISTS site_images CASCADE;

-- Activation des extensions d'identifiants sécurisés (UUID)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =========================================================================
-- 1. DECRIPYAGE DU SCHEMA TRANSACTIONNEL ET DE CONTENU
-- =========================================================================

-- Table de l'auteur "Siewe de Kalambak Steeves"
CREATE TABLE author_info (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    role VARCHAR(255) NOT NULL,
    bio TEXT NOT NULL,
    extended_bio TEXT NOT NULL,
    whatsapp_number VARCHAR(50) NOT NULL,
    whatsapp_message TEXT NOT NULL,
    email VARCHAR(255) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Table des spécifications du livre
CREATE TABLE book_details (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    subtitle TEXT NOT NULL,
    price_paper NUMERIC(10, 2) NOT NULL DEFAULT 35.00,
    original_price_paper NUMERIC(10, 2) NOT NULL DEFAULT 45.00,
    price_pack NUMERIC(10, 2) NOT NULL DEFAULT 50.00,
    pages INTEGER NOT NULL DEFAULT 316,
    language VARCHAR(100) NOT NULL DEFAULT 'Français',
    format VARCHAR(150) NOT NULL DEFAULT 'Papier Relié Premium',
    release_year VARCHAR(10) NOT NULL DEFAULT '2026',
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Table des chapitres du livre (01 à 09)
CREATE TABLE chapters (
    id VARCHAR(50) PRIMARY KEY, -- ex: 'chap-1'
    number VARCHAR(10) NOT NULL, -- ex: '01'
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    highlights TEXT[] NOT NULL DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Table des avantages majeurs du livre
CREATE TABLE benefits (
    id VARCHAR(50) PRIMARY KEY, -- ex: 'benefit-1'
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    icon VARCHAR(100) NOT NULL, -- Référence d'icônes Lucide-react (Globe, BookOpen, etc.)
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Table des témoignages d'investisseurs (avis réels avec profils)
CREATE TABLE testimonials (
    id VARCHAR(50) PRIMARY KEY, -- ex: 'test-1'
    name VARCHAR(255) NOT NULL,
    role VARCHAR(255) NOT NULL,
    company VARCHAR(255), -- Ville, Pays de résidence
    content TEXT NOT NULL,
    avatar_url TEXT, -- Lien d'image hébergé Unsplash optimisé
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5) DEFAULT 5,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Table de foire aux questions (FAQ active)
CREATE TABLE faqs (
    id VARCHAR(50) PRIMARY KEY, -- ex: 'faq-1'
    question TEXT NOT NULL,
    answer TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Table des images dynamiques du site (images de marque modifiables par l'admin)
CREATE TABLE site_images (
    id VARCHAR(50) PRIMARY KEY DEFAULT 'default',
    author_portrait TEXT NOT NULL,
    book_cover TEXT NOT NULL,
    financial_charts TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Table des commandes de livres enregistrées depuis l'interface sécurisée de validation
CREATE TABLE orders (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    transaction_id VARCHAR(100) UNIQUE NOT NULL, -- ex: 'TXN-BVMAC-XXXXXX-EUR'
    customer_name VARCHAR(255) NOT NULL,
    customer_email VARCHAR(255) NOT NULL,
    customer_phone VARCHAR(100) NOT NULL, -- WhatsApp pour la coordination de la livraison
    delivery_city VARCHAR(255) NOT NULL,
    delivery_country VARCHAR(255) NOT NULL, -- Pays de l'Afrique Centrale CEMAC / Diaspora
    total_amount NUMERIC(10, 2) NOT NULL, -- Montant global TTC calculé
    shipping_fee NUMERIC(10, 2) NOT NULL DEFAULT 0.00, -- Frais d'envoi appliqués
    payment_status VARCHAR(50) NOT NULL DEFAULT 'paid', -- 'pending' (en attente), 'paid' (réglé), 'failed' (échoué)
    card_holder VARCHAR(255) NOT NULL, -- Nom figurant sur la carte
    card_last_four VARCHAR(4) NOT NULL, -- Mesure de protection PCI : on enregistre uniquement les 4 derniers chiffres
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Table de détails de panier ou d'items rattachés à une commande
CREATE TABLE order_items (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    order_id UUID REFERENCES orders(id) ON DELETE CASCADE NOT NULL,
    product_id VARCHAR(50) NOT NULL CHECK (product_id IN ('paper', 'pack')), -- 'paper' (Livre Papier) ou 'pack' (Duo Élite)
    product_name VARCHAR(255) NOT NULL,
    unit_price NUMERIC(10, 2) NOT NULL,
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);


-- =========================================================================
-- 2. INTEGRATION DE TRIGGERS D'AUTOMATISATION DES DATES
-- =========================================================================

-- Fonction globale de mise à jour du champ updated_at
CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc'::text, NOW());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Attribution des triggers d'actualisation de dates aux tables dynamiques
CREATE TRIGGER update_author_info_modtime BEFORE UPDATE ON author_info FOR EACH ROW EXECUTE FUNCTION update_modified_column();
CREATE TRIGGER update_book_details_modtime BEFORE UPDATE ON book_details FOR EACH ROW EXECUTE FUNCTION update_modified_column();
CREATE TRIGGER update_chapters_modtime BEFORE UPDATE ON chapters FOR EACH ROW EXECUTE FUNCTION update_modified_column();
CREATE TRIGGER update_benefits_modtime BEFORE UPDATE ON benefits FOR EACH ROW EXECUTE FUNCTION update_modified_column();
CREATE TRIGGER update_testimonials_modtime BEFORE UPDATE ON testimonials FOR EACH ROW EXECUTE FUNCTION update_modified_column();
CREATE TRIGGER update_faqs_modtime BEFORE UPDATE ON faqs FOR EACH ROW EXECUTE FUNCTION update_modified_column();
CREATE TRIGGER update_site_images_modtime BEFORE UPDATE ON site_images FOR EACH ROW EXECUTE FUNCTION update_modified_column();


-- =========================================================================
-- 3. ATTRIBUTION DES VUES ANALYTIQUES POUR LE BACKOFFICE / DASHBOARD
-- =========================================================================

-- Vue 1 : Détail intégral d'une commande avec sa liste exhaustive de paniers
CREATE VIEW view_order_details AS
SELECT 
    o.id AS order_id,
    o.transaction_id,
    o.customer_name,
    o.customer_email,
    o.customer_phone,
    o.delivery_city,
    o.delivery_country,
    o.total_amount,
    o.shipping_fee,
    o.payment_status,
    o.card_holder,
    o.card_last_four,
    o.created_at AS order_date,
    oi.id AS item_id,
    oi.product_id,
    oi.product_name,
    oi.unit_price,
    oi.quantity,
    (oi.unit_price * oi.quantity) AS item_total
FROM orders o
JOIN order_items oi ON o.id = oi.order_id;

-- Vue 2 : Synthèse agrégée de l'ensemble des ventes et statistiques financières
CREATE VIEW view_sales_summary AS
SELECT 
    COUNT(DISTINCT o.id) AS total_orders,
    COALESCE(SUM(o.total_amount), 0) AS gross_revenue,
    COALESCE(SUM(o.shipping_fee), 0) AS total_shipping_collected,
    (COALESCE(SUM(o.total_amount), 0) - COALESCE(SUM(o.shipping_fee), 0)) AS net_book_sales,
    COALESCE(SUM(CASE WHEN oi.product_id = 'paper' THEN oi.quantity ELSE 0 END), 0) AS total_paper_books_sold,
    COALESCE(SUM(CASE WHEN oi.product_id = 'pack' THEN oi.quantity ELSE 0 END), 0) AS total_packs_sold
FROM orders o
LEFT JOIN order_items oi ON o.id = oi.order_id
WHERE o.payment_status = 'paid';


-- =========================================================================
-- 4. INSERTIONS DE DONNEES INITIALES (SEED DATA EXACT)
-- =========================================================================

-- 4.1 Auteur
INSERT INTO author_info (name, role, bio, extended_bio, whatsapp_number, whatsapp_message, email)
VALUES (
    'Siewe de Kalambak Steeves',
    'Auteur Financier & Analyste en Investissements',
    'Siewe de Kalambak Steeves est un expert en finance de marché et ingénierie financière, passionné par la démocratisation de l''investissement en Afrique. Fort d''une expérience solide au cœur des écosystèmes d''Afrique francophone et internationale, il a conçu ''La Bourse en Afrique'' pour offrir aux cadres, entrepreneurs et particuliers un guide pratique, pragmatique et décomplexé pour investir avec sérénité et succès.',
    'Après avoir constaté le déficit d''éducation financière et le manque de publications adaptées à notre contexte économique d''Afrique Centrale (la BVMAC), Siewe a concentré ses efforts pour traduire des concepts complexes en stratégies actionnables. Il accompagne aujourd''hui des centaines d''investisseurs de la zone CEMAC et de la diaspora à travers ses écrits, conférences et programmes d''accompagnement d''élite.',
    '+33 6 25 25 31 43',
    'Bonjour M. Siewe de Kalambak Steeves, je souhaite commander votre livre ''La Bourse en Afrique''.',
    'kalambaksteeves@yahoo.fr'
);

-- 4.2 Spécifications du Livre
INSERT INTO book_details (title, subtitle, price_paper, original_price_paper, price_pack, pages, language, format, release_year)
VALUES (
    'La Bourse en Afrique',
    'Guide méthodologique et pratique pour bâtir votre liberté financière sur les marchés boursiers africains',
    35.00,
    45.00,
    50.00,
    316,
    'Français',
    'Papier Relié Premium',
    '2026'
);

-- 4.3 Chapitres de l'ouvrage
INSERT INTO chapters (id, number, title, description, highlights)
VALUES 
('chap-1', '01', 'Généralités sur la bourse', 
 'Les notions fondamentales pour s''initier aux mécanismes boursiers : comment fonctionne le marché, le rôle des actions et des obligations, et les principes de l''épargne active dans l''écosystème financier de la zone CEMAC.', 
 ARRAY['Démystifier le fonctionnement d''un marché boursier moderne', 'La distinction essentielle entre actions (titres de propriété) et obligations (titres de créance)', 'Comment transformer l''épargne passive en investissement créateur de richesse durable']),

('chap-2', '02', 'Évolution de la règlementation boursière en Afrique centrale', 
 'L''histoire, les grandes étapes et l''importance de l''unification de l''encadrement juridique du marché boursier d''Afrique Centrale pour sécuriser les épargnants.', 
 ARRAY['Les réformes boursières majeures ayant conduit à l''unification du marché financier régional', 'Le cadre légal protecteur mis en place pour sécuriser les placements des souscripteurs et particuliers', 'Les évolutions règlementaires encourageant la participation active de l''actionnariat populaire']),

('chap-3', '03', 'Les institutions et les acteurs boursiers en Afrique centrale', 
 'Une cartographie claire de l''architecture institutionnelle : le rôle protecteur de la COSUMAF, la BVMAC comme plateforme de transaction, et les Sociétés de Bourse.', 
 ARRAY['Le rôle de surveillance, de visa et de contrôle opéré par la COSUMAF', 'Le fonctionnement opérationnel de la BVMAC et le rôle pivot du Dépositaire Central unique', 'Comment identifier et solliciter les Sociétés de Bourse habilitées dans la sous-région']),

('chap-4', '04', 'Rôle des autorités publiques dans le développement de la bourse', 
 'Pourquoi et comment les États d''Afrique Centrale dynamisent le marché financier par le biais d''incitations fiscales, d''emprunts obligataires et de privatisations d''entreprises clés.', 
 ARRAY['Le cadre stimulant mis en place par les autorités publiques de la CEMAC pour doper les marchés', 'Le mécanisme d''émission des emprunts obligataires souverains et leur attractivité', 'L''impact des privatisations d''entreprises d''État structurantes sur le dynamisme boursier']),

('chap-5', '05', 'État des lieux du marché des valeurs mobilières en Afrique centrale', 
 'Une analyse lucide et approfondie du marché régional : volumes d''échanges, capitalisation boursière, et opportunités de valorisation encore inexploitées.', 
 ARRAY['La capitalisation boursière globale et la composition sectorielle de la BVMAC actuelle', 'Évaluation des forces, des opportunités de liquidité et d''arbitrage sur des titres d''élite', 'Pourquoi l''Afrique Centrale constitue l''une des frontières d''investissement les plus attractives']),

('chap-6', '06', 'Les instruments financiers sur la BVMAC', 
 'Tout sur les outils négociables disponibles en zone CEMAC : de l''investissement dans des actions d''élite (Socapalm, Safacam, Bange, etc.) aux obligations d''États.', 
 ARRAY['Focus détaillé sur les actions phares cotées et leur historique régulier de dividendes', 'Les obligations d''États et leur profil de risque/performance optimal pour les épargnants', 'Méthodologie concrète pour analyser un instrument financier avant son achat']),

('chap-7', '07', 'Les défis du développement de la bourse en Afrique centrale', 
 'Un décryptage lucide des obstacles structurels à lever : culture financière de masse, intégration des PME d''excellence, et intégration du grand public.', 
 ARRAY['Combler le déficit de culture financière et démystifier l''investissement boursier auprès de la population', 'Développer la liquidité en facilitant l''accès des comptes-titres au grand public', 'L''enjeu de l''introduction boursière des fleurons du secteur privé régional et des PME d''élite']),

('chap-8', '08', 'Les opportunités de croissance et de diversification de la BVMAC', 
 'Stratégies d''expansion pour le marché : captation de l''épargne de la diaspora, émergence des fonds de placement collectifs (OPCVM), et diversification sectorielle.', 
 ARRAY['Canaliser l''épargne de la diaspora vers des projets créateurs de richesse via le marché boursier', 'Favoriser la création d''OPCVM (FCP et SICAV) pour permettre une gestion diversifiée simplifiée', 'Perspectives de cotations croisées et de partenariats stratégiques régionaux']),

('chap-9', '09', 'Le rôle de la technologie dans le développement de la BVMAC', 
 'Comment la révolution technologique, le mobile money et le courtage par smartphone transforment l''accès à la bourse, le rendant instantané et grand public.', 
 ARRAY['Démocratisation boursière grâce à l''intégration du Mobile Money et des canaux digitaux mobiles', 'L''accès sécurisé en temps réel aux informations de marché par les investisseurs individuels', 'Les innovations Fintech qui redéfinissent l''intermédiation financière en Afrique Centrale']);

-- 4.4 Bénéfices / Atouts clés
INSERT INTO benefits (id, title, description, icon)
VALUES
('benefit-1', '100% Adapté à l''Afrique Centrale (CEMAC)', 'Contrairement aux manuels américains ou d''Afrique de l''Ouest (BRVM), ce livre se concentre à 100% sur la BVMAC, les Sociétés de Bourse agréées par la COSUMAF et la fiscalité CEMAC.', 'Globe'),
('benefit-2', 'Pédagogie Simple et Ultra-Visuelle', 'Oubliez le jargon académique imbuvable. Chaque concept est illustré par des schémas d''époque, des graphiques réels et des analogies de la vie de tous les jours.', 'BookOpen'),
('benefit-3', 'Études de Cas Réelles (BVMAC)', 'Des analyses pas à pas d''actions phares cotées sur la BVMAC (SOCAPALM, SAFACAM, BANGE, etc.) pour vous apprendre à isoler de vraies opportunités de croissance de valeur.', 'TrendingUp'),
('benefit-4', 'Feuille de Route Actionnable', 'Repartez avec un guide d''étape en étape pour ouvrir votre compte titre, sélectionner vos premières actions et placer des ordres sur smartphone.', 'CheckCircle');

-- 4.5 Témoignages clients (Seeding des 3 avis majeurs avec leurs avatars récemment mis en valeur !)
INSERT INTO testimonials (id, name, role, company, content, avatar_url, rating)
VALUES
('test-1', 'Jean-Paul Ndong', 'Responsable Logistique & Investisseur', 'Libreville, Gabon', 'Pendant des années, je pensais que la BVMAC était réservée aux institutionnels ou aux initiés d''Afrique Centrale. Ce livre a tout changé pour moi. J''ai ouvert mon compte-titres et perçu mes premiers dividendes de la SOCAPALM !', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&h=150&q=80', 5),
('test-2', 'Dr. Sandrine Ngo Mbalke', 'Médecin Généraliste', 'Yaoundé, Cameroun', 'Un ouvrage exceptionnel de clarté sur la bourse d''Afrique Centrale. M. Siewe de Kalambak Steeves allie rigueur scientifique et fluidité d''écriture. Mon seul regret est de ne pas l''avoir lu plus tôt.', 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&h=150&q=80', 5),
('test-3', 'Christian Bekolo', 'Co-fondateur d''une startup technologique', 'Douala, Cameroun', 'Le guide sur les Sociétés de Bourse agréées par la COSUMAF est d''une utilité publique. Tout y est transparent, sans filtre. Un investissement indispensable pour toute personne voulant investir en Afrique Centrale.', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&h=150&q=80', 5);

-- 4.6 Foires Aux Questions
INSERT INTO faqs (id, question, answer)
VALUES
('faq-1', 'Faut-il un gros capital pour commencer à investir grâce à ce livre ?', 'Absolument pas. Le livre vous montre comment vous pouvez commencer à investir en bourse d''Afrique Centrale (BVMAC) avec de petites sommes mensuelles, en tirant parti des actions accessibles comme SOCAPALM, SAFACAM, la Régionale, BANGE, etc.'),
('faq-2', 'Quelle est la qualité de fabrication de l''ouvrage physique ?', 'Le livre est édité avec un niveau d''exigence exceptionnel. Il s''agit d''un livre broché de format premium édité sur un papier bouffant crème antireflet de qualité supérieure de haute facture, doté d''une couverture rigide élégante et durable. Un magnifique ouvrage conçu pour embellir votre bibliothèque de rentier et résister au temps.'),
('faq-3', 'Comment se déroule la livraison ?', 'Nous expédions et livrons principalement au Cameroun, Gabon, Congo, Tchad, RCA, Guinée Équatoriale (zone CEMAC) ainsi que la diaspora via des livraisons express ou points relais sécurisés. La livraison est coordonnée de manière fluide avec l''auteur et ses distributeurs agréés par WhatsApp.'),
('faq-4', 'Le livre explique-t-il comment choisir concrètement sa Société de Bourse ?', 'Oui, un chapitre entier est dédié au comparatif des Sociétés de Bourse de la sous-région CEMAC, leurs frais de tenue de compte, et la procédure exacte pour y ouvrir un compte à distance en toute légalité.');

-- 4.7 Images par défaut du site
INSERT INTO site_images (id, author_portrait, book_cover, financial_charts)
VALUES (
    'default',
    'https://raw.githubusercontent.com/dominiqueeteme237/la-bourse-en-afrique/main/src/assets/images/author_portrait_exact_v2_1780143348819.png',
    'https://raw.githubusercontent.com/dominiqueeteme237/la-bourse-en-afrique/main/src/assets/images/book_cover_1780131365477.png',
    'https://raw.githubusercontent.com/dominiqueeteme237/la-bourse-en-afrique/main/src/assets/images/financial_charts_africa_1780131404194.png'
);


-- =========================================================================
-- 5. SECURITE INTERNE SUPABASE (ROW LEVEL SECURITY - RLS)
-- =========================================================================

-- Activation générale du RLS sur chaque table
ALTER TABLE author_info ENABLE ROW LEVEL SECURITY;
ALTER TABLE book_details ENABLE ROW LEVEL SECURITY;
ALTER TABLE chapters ENABLE ROW LEVEL SECURITY;
ALTER TABLE benefits ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE faqs ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- 5.1 Politiques pour les tables de contenu de la Landing Page (Lecture Anonyme Libre)
-- Lecture libre pour tous (visiteurs anonymes et connectés)
CREATE POLICY "lecture_publique_auteur" ON author_info FOR SELECT USING (true);
CREATE POLICY "lecture_publique_livre" ON book_details FOR SELECT USING (true);
CREATE POLICY "lecture_publique_chapitres" ON chapters FOR SELECT USING (true);
CREATE POLICY "lecture_publique_avantages" ON benefits FOR SELECT USING (true);
CREATE POLICY "lecture_publique_temoignages" ON testimonials FOR SELECT USING (true);
CREATE POLICY "lecture_publique_faqs" ON faqs FOR SELECT USING (true);
CREATE POLICY "lecture_publique_site_images" ON site_images FOR SELECT USING (true);

-- Modification/Création réservée aux administrateurs connectés (authentification Supabase)
CREATE POLICY "admin_all_auteur" ON author_info FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "admin_all_livre" ON book_details FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "admin_all_chapitres" ON chapters FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "admin_all_avantages" ON benefits FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "admin_all_temoignages" ON testimonials FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "admin_all_faqs" ON faqs FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "admin_all_site_images" ON site_images FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- 5.2 Politiques de commandes (Public Inserts pour les achats, restriction de lecture)
-- N'importe quel client anonyme peut valider et insérer une commande ou un item de panier
CREATE POLICY "public_insert_orders" ON orders FOR INSERT WITH CHECK (true);
CREATE POLICY "public_insert_order_items" ON order_items FOR INSERT WITH CHECK (true);

-- Seul le personnel de gestion de commande ou l'auteur connecté peut lire les commandes
CREATE POLICY "admin_read_orders" ON orders FOR SELECT TO authenticated USING (true);
CREATE POLICY "admin_read_order_items" ON order_items FOR SELECT TO authenticated USING (true);

-- Admin peut supprimer ou mettre à jour des statuts de paiement/livraison
CREATE POLICY "admin_all_orders" ON orders FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "admin_all_order_items" ON order_items FOR ALL TO authenticated USING (true) WITH CHECK (true);

COMMIT;
