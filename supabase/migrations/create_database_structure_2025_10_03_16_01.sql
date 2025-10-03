-- Structure de base de données pour l'application SaaS Recherche d'Emploi Suisse Romande
-- Créé le 2025-10-03 16:01 UTC

-- Extension pour UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Table des cantons romands
CREATE TABLE public.cantons_2025_10_03_16_01 (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    code VARCHAR(2) NOT NULL UNIQUE,
    name VARCHAR(50) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table des communes par canton
CREATE TABLE public.communes_2025_10_03_16_01 (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    canton_id UUID REFERENCES public.cantons_2025_10_03_16_01(id),
    name VARCHAR(100) NOT NULL,
    postal_code VARCHAR(10),
    bfs_number INTEGER UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table taxonomie secteurs NOGA
CREATE TABLE public.sectors_2025_10_03_16_01 (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    parent_id UUID REFERENCES public.sectors_2025_10_03_16_01(id),
    noga_code VARCHAR(10),
    name VARCHAR(200) NOT NULL,
    level INTEGER NOT NULL, -- 1=Section, 2=Division, 3=Groupe, 4=Classe
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table des profils utilisateurs étendus
CREATE TABLE public.user_profiles_2025_10_03_16_01 (
    id UUID REFERENCES auth.users(id) PRIMARY KEY,
    email VARCHAR(255) NOT NULL,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    phone VARCHAR(20),
    address TEXT,
    canton_id UUID REFERENCES public.cantons_2025_10_03_16_01(id),
    commune_id UUID REFERENCES public.communes_2025_10_03_16_01(id),
    preferred_sectors UUID[] DEFAULT '{}',
    experience_level VARCHAR(20) DEFAULT 'junior', -- junior, intermediate, senior, expert
    availability VARCHAR(20) DEFAULT 'immediate', -- immediate, 1month, 3months, 6months
    contract_types VARCHAR[] DEFAULT '{"cdi"}', -- cdi, cdd, stage, freelance, temps_partiel
    salary_min INTEGER,
    salary_max INTEGER,
    profile_photo_url TEXT,
    cv_url TEXT,
    cover_letter_template TEXT,
    subscription_type VARCHAR(20) DEFAULT 'free', -- free, premium, enterprise
    subscription_expires_at TIMESTAMP WITH TIME ZONE,
    automation_level VARCHAR(20) DEFAULT 'semi', -- semi, auto, manual
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table des offres d'emploi
CREATE TABLE public.job_offers_2025_10_03_16_01 (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    company_name VARCHAR(100) NOT NULL,
    description TEXT,
    requirements TEXT,
    salary_min INTEGER,
    salary_max INTEGER,
    contract_type VARCHAR(20) NOT NULL,
    location VARCHAR(100),
    canton_id UUID REFERENCES public.cantons_2025_10_03_16_01(id),
    commune_id UUID REFERENCES public.communes_2025_10_03_16_01(id),
    sector_id UUID REFERENCES public.sectors_2025_10_03_16_01(id),
    source_url TEXT,
    source_platform VARCHAR(50), -- jobup, indeed, orp, linkedin, etc.
    application_url TEXT,
    application_email VARCHAR(255),
    contact_person VARCHAR(100),
    deadline DATE,
    is_active BOOLEAN DEFAULT true,
    matching_score DECIMAL(3,2), -- Score de matching avec le profil utilisateur
    extracted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table des candidatures
CREATE TABLE public.applications_2025_10_03_16_01 (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.user_profiles_2025_10_03_16_01(id),
    job_offer_id UUID REFERENCES public.job_offers_2025_10_03_16_01(id),
    status VARCHAR(20) DEFAULT 'draft', -- draft, applied, interview_scheduled, interview_done, rejected, accepted, withdrawn
    kanban_position INTEGER DEFAULT 0,
    generated_cv_url TEXT,
    generated_cover_letter_url TEXT,
    custom_cv_url TEXT,
    custom_cover_letter_url TEXT,
    additional_documents TEXT[], -- URLs des documents supplémentaires
    application_sent_at TIMESTAMP WITH TIME ZONE,
    interview_date TIMESTAMP WITH TIME ZONE,
    interview_notes TEXT,
    feedback TEXT,
    follow_up_date DATE,
    auto_generated BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table des documents utilisateur
CREATE TABLE public.user_documents_2025_10_03_16_01 (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.user_profiles_2025_10_03_16_01(id),
    document_type VARCHAR(50) NOT NULL, -- cv, cover_letter, diploma, certificate, photo, other
    file_name VARCHAR(255) NOT NULL,
    file_url TEXT NOT NULL,
    file_size INTEGER,
    mime_type VARCHAR(100),
    is_primary BOOLEAN DEFAULT false, -- Pour marquer le CV/photo principal
    tags VARCHAR[] DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table des tests RIASEC
CREATE TABLE public.riasec_tests_2025_10_03_16_01 (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    question_number INTEGER NOT NULL,
    question_text TEXT NOT NULL,
    category VARCHAR(1) NOT NULL, -- R, I, A, S, E, C
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table des résultats RIASEC
CREATE TABLE public.riasec_results_2025_10_03_16_01 (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.user_profiles_2025_10_03_16_01(id),
    realistic_score INTEGER DEFAULT 0,
    investigative_score INTEGER DEFAULT 0,
    artistic_score INTEGER DEFAULT 0,
    social_score INTEGER DEFAULT 0,
    enterprising_score INTEGER DEFAULT 0,
    conventional_score INTEGER DEFAULT 0,
    dominant_type VARCHAR(1),
    recommended_sectors UUID[],
    report_url TEXT,
    completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table des tests Ennéagramme
CREATE TABLE public.enneagram_tests_2025_10_03_16_01 (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    question_number INTEGER NOT NULL,
    question_text TEXT NOT NULL,
    type_1_weight INTEGER DEFAULT 0,
    type_2_weight INTEGER DEFAULT 0,
    type_3_weight INTEGER DEFAULT 0,
    type_4_weight INTEGER DEFAULT 0,
    type_5_weight INTEGER DEFAULT 0,
    type_6_weight INTEGER DEFAULT 0,
    type_7_weight INTEGER DEFAULT 0,
    type_8_weight INTEGER DEFAULT 0,
    type_9_weight INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table des résultats Ennéagramme
CREATE TABLE public.enneagram_results_2025_10_03_16_01 (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.user_profiles_2025_10_03_16_01(id),
    type_1_score INTEGER DEFAULT 0,
    type_2_score INTEGER DEFAULT 0,
    type_3_score INTEGER DEFAULT 0,
    type_4_score INTEGER DEFAULT 0,
    type_5_score INTEGER DEFAULT 0,
    type_6_score INTEGER DEFAULT 0,
    type_7_score INTEGER DEFAULT 0,
    type_8_score INTEGER DEFAULT 0,
    type_9_score INTEGER DEFAULT 0,
    dominant_type INTEGER,
    wing_type INTEGER,
    description TEXT,
    career_recommendations TEXT,
    report_url TEXT,
    completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table des ressources d'entretien
CREATE TABLE public.interview_resources_2025_10_03_16_01 (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    resource_type VARCHAR(20) NOT NULL, -- video, audio, document, link
    file_url TEXT,
    thumbnail_url TEXT,
    duration INTEGER, -- en secondes pour vidéo/audio
    category VARCHAR(50), -- preparation, questions, techniques, etc.
    tags VARCHAR[] DEFAULT '{}',
    is_public BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table des notifications
CREATE TABLE public.notifications_2025_10_03_16_01 (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.user_profiles_2025_10_03_16_01(id),
    title VARCHAR(200) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(20) NOT NULL, -- info, success, warning, error
    category VARCHAR(50), -- application, interview, deadline, system
    is_read BOOLEAN DEFAULT false,
    action_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table de l'historique des actions
CREATE TABLE public.activity_log_2025_10_03_16_01 (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.user_profiles_2025_10_03_16_01(id),
    action VARCHAR(100) NOT NULL,
    entity_type VARCHAR(50), -- application, job_offer, document, etc.
    entity_id UUID,
    details JSONB,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insertion des données de référence pour les cantons romands
INSERT INTO public.cantons_2025_10_03_16_01 (code, name) VALUES
('GE', 'Genève'),
('VD', 'Vaud'),
('VS', 'Valais'),
('FR', 'Fribourg'),
('NE', 'Neuchâtel'),
('JU', 'Jura');

-- Insertion de quelques communes principales par canton
INSERT INTO public.communes_2025_10_03_16_01 (canton_id, name, postal_code, bfs_number) 
SELECT c.id, commune_data.name, commune_data.postal_code, commune_data.bfs_number
FROM public.cantons_2025_10_03_16_01 c
CROSS JOIN (
    SELECT 'Genève' as name, '1200' as postal_code, 6621 as bfs_number, 'GE' as canton_code
    UNION ALL SELECT 'Carouge', '1227', 6622, 'GE'
    UNION ALL SELECT 'Lausanne', '1000', 5586, 'VD'
    UNION ALL SELECT 'Montreux', '1820', 5886, 'VD'
    UNION ALL SELECT 'Sion', '1950', 6266, 'VS'
    UNION ALL SELECT 'Martigny', '1920', 6136, 'VS'
    UNION ALL SELECT 'Fribourg', '1700', 2196, 'FR'
    UNION ALL SELECT 'Bulle', '1630', 2125, 'FR'
    UNION ALL SELECT 'Neuchâtel', '2000', 6458, 'NE'
    UNION ALL SELECT 'La Chaux-de-Fonds', '2300', 6421, 'NE'
    UNION ALL SELECT 'Delémont', '2800', 6711, 'JU'
    UNION ALL SELECT 'Porrentruy', '2900', 6770, 'JU'
) commune_data
WHERE c.code = commune_data.canton_code;

-- Insertion de la taxonomie NOGA simplifiée
INSERT INTO public.sectors_2025_10_03_16_01 (noga_code, name, level) VALUES
-- Sections principales
('A', 'Agriculture, sylviculture et pêche', 1),
('B', 'Industries extractives', 1),
('C', 'Activités de fabrication', 1),
('D', 'Production et distribution d''électricité, de gaz, de vapeur et d''air conditionné', 1),
('E', 'Production et distribution d''eau; assainissement, gestion des déchets et dépollution', 1),
('F', 'Construction', 1),
('G', 'Commerce; réparation d''automobiles et de motocycles', 1),
('H', 'Transports et entreposage', 1),
('I', 'Hébergement et restauration', 1),
('J', 'Information et communication', 1),
('K', 'Activités financières et d''assurance', 1),
('L', 'Activités immobilières', 1),
('M', 'Activités spécialisées, scientifiques et techniques', 1),
('N', 'Activités de services administratifs et de soutien', 1),
('O', 'Administration publique', 1),
('P', 'Enseignement', 1),
('Q', 'Santé humaine et action sociale', 1),
('R', 'Arts, spectacles et activités récréatives', 1),
('S', 'Autres activités de services', 1),
('T', 'Activités des ménages en tant qu''employeurs', 1),
('U', 'Activités des organisations et organismes extraterritoriaux', 1);

-- Quelques divisions importantes pour les secteurs clés
INSERT INTO public.sectors_2025_10_03_16_01 (parent_id, noga_code, name, level) 
SELECT s.id, division_data.noga_code, division_data.name, 2
FROM public.sectors_2025_10_03_16_01 s
CROSS JOIN (
    SELECT '62' as noga_code, 'Programmation, conseil et autres activités informatiques' as name, 'J' as parent_code
    UNION ALL SELECT '63', 'Services d''information', 'J'
    UNION ALL SELECT '64', 'Services financiers, hors assurance et caisses de retraite', 'K'
    UNION ALL SELECT '65', 'Assurance', 'K'
    UNION ALL SELECT '69', 'Activités juridiques et comptables', 'M'
    UNION ALL SELECT '70', 'Activités des sièges sociaux; conseil de gestion', 'M'
    UNION ALL SELECT '71', 'Activités d''architecture et d''ingénierie', 'M'
    UNION ALL SELECT '72', 'Recherche-développement scientifique', 'M'
    UNION ALL SELECT '85', 'Enseignement', 'P'
    UNION ALL SELECT '86', 'Activités pour la santé humaine', 'Q'
    UNION ALL SELECT '87', 'Hébergement médico-social et social', 'Q'
) division_data
WHERE s.noga_code = division_data.parent_code AND s.level = 1;