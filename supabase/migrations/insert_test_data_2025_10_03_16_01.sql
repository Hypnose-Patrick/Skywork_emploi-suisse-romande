-- Données de test pour les questionnaires RIASEC et Ennéagramme
-- Créé le 2025-10-03 16:01 UTC

-- Questions RIASEC (Holland Code)
INSERT INTO public.riasec_tests_2025_10_03_16_01 (question_number, question_text, category) VALUES
-- Questions Réaliste (R)
(1, 'J''aime travailler avec mes mains et utiliser des outils', 'R'),
(2, 'Je préfère les activités pratiques aux activités théoriques', 'R'),
(3, 'J''aime réparer des objets ou des machines', 'R'),
(4, 'Je me sens à l''aise dans un environnement de travail physique', 'R'),
(5, 'J''aime construire ou assembler des choses', 'R'),

-- Questions Investigateur (I)
(6, 'J''aime résoudre des problèmes complexes', 'I'),
(7, 'Je suis curieux et j''aime comprendre comment les choses fonctionnent', 'I'),
(8, 'J''aime analyser des données et des informations', 'I'),
(9, 'Je préfère travailler de manière indépendante', 'I'),
(10, 'J''aime faire des recherches approfondies sur des sujets qui m''intéressent', 'I'),

-- Questions Artistique (A)
(11, 'J''aime créer des choses originales et uniques', 'A'),
(12, 'Je m''exprime facilement par l''art, la musique ou l''écriture', 'A'),
(13, 'J''aime travailler dans un environnement créatif et flexible', 'A'),
(14, 'Je préfère les projets qui me permettent d''être imaginatif', 'A'),
(15, 'J''aime présenter mes idées de manière créative', 'A'),

-- Questions Social (S)
(16, 'J''aime aider les autres et contribuer à leur bien-être', 'S'),
(17, 'Je me sens énergisé quand je travaille en équipe', 'S'),
(18, 'J''aime enseigner ou former d''autres personnes', 'S'),
(19, 'Je suis doué pour comprendre les émotions des autres', 'S'),
(20, 'J''aime résoudre les conflits et faciliter la communication', 'S'),

-- Questions Entreprenant (E)
(21, 'J''aime diriger et influencer les autres', 'E'),
(22, 'Je suis motivé par les défis et la compétition', 'E'),
(23, 'J''aime prendre des risques calculés', 'E'),
(24, 'Je me sens à l''aise pour présenter et vendre des idées', 'E'),
(25, 'J''aime organiser et coordonner des projets', 'E'),

-- Questions Conventionnel (C)
(26, 'J''aime travailler avec des données précises et des détails', 'C'),
(27, 'Je préfère suivre des procédures établies', 'C'),
(28, 'J''aime organiser et classer des informations', 'C'),
(29, 'Je me sens à l''aise avec les tâches administratives', 'C'),
(30, 'J''aime travailler dans un environnement structuré et prévisible', 'C');

-- Questions Ennéagramme
INSERT INTO public.enneagram_tests_2025_10_03_16_01 (question_number, question_text, type_1_weight, type_2_weight, type_3_weight, type_4_weight, type_5_weight, type_6_weight, type_7_weight, type_8_weight, type_9_weight) VALUES
(1, 'Je me considère comme quelqu''un de perfectionniste qui s''efforce toujours de bien faire les choses', 3, 0, 1, 0, 0, 0, 0, 0, 0),
(2, 'J''ai tendance à me préoccuper des besoins des autres avant les miens', 0, 3, 0, 0, 0, 0, 0, 0, 1),
(3, 'Je suis très orienté vers les objectifs et j''aime réussir dans ce que j''entreprends', 1, 0, 3, 0, 0, 0, 1, 1, 0),
(4, 'Je ressens les émotions de manière intense et j''ai besoin d''authenticité dans mes relations', 0, 1, 0, 3, 0, 0, 0, 0, 0),
(5, 'J''aime observer et comprendre avant d''agir, je valorise ma vie privée', 0, 0, 0, 1, 3, 1, 0, 0, 1),
(6, 'Je cherche la sécurité et j''ai tendance à anticiper les problèmes potentiels', 1, 0, 0, 0, 1, 3, 0, 0, 0),
(7, 'J''aime explorer de nouvelles possibilités et j''ai du mal avec la routine', 0, 0, 1, 1, 0, 0, 3, 0, 0),
(8, 'Je suis direct dans mes communications et j''aime prendre le contrôle des situations', 1, 0, 2, 0, 0, 0, 1, 3, 0),
(9, 'Je préfère maintenir l''harmonie et éviter les conflits', 0, 2, 0, 0, 0, 1, 0, 0, 3),
(10, 'Je me critique souvent et j''ai des standards élevés pour moi-même et les autres', 3, 0, 1, 1, 0, 0, 0, 0, 0),
(11, 'J''ai du mal à dire non quand quelqu''un a besoin d''aide', 0, 3, 0, 0, 0, 1, 0, 0, 2),
(12, 'Je m''adapte facilement aux attentes des autres et je sais comment impressionner', 0, 1, 3, 0, 0, 0, 1, 0, 0),
(13, 'Je me sens différent des autres et j''ai parfois l''impression qu''il me manque quelque chose', 0, 0, 0, 3, 1, 0, 0, 0, 0),
(14, 'Je préfère réfléchir longuement avant de prendre des décisions importantes', 1, 0, 0, 0, 3, 2, 0, 0, 1),
(15, 'Je remets souvent en question l''autorité et je teste la loyauté des autres', 0, 0, 0, 0, 0, 3, 0, 2, 0),
(16, 'J''ai tendance à voir le côté positif des choses et à éviter les émotions négatives', 0, 1, 1, 0, 0, 0, 3, 0, 1),
(17, 'Je n''aime pas qu''on me dise quoi faire et je défends les plus faibles', 1, 0, 0, 0, 0, 0, 0, 3, 0),
(18, 'Je procrastine souvent et j''ai du mal à prendre des décisions importantes', 0, 0, 0, 0, 1, 1, 0, 0, 3),
(19, 'Je remarque immédiatement ce qui ne va pas dans une situation', 3, 0, 0, 1, 1, 1, 0, 0, 0),
(20, 'Je donne beaucoup de moi-même aux autres, parfois au détriment de mes propres besoins', 0, 3, 0, 1, 0, 0, 0, 0, 1);

-- Insertion de quelques offres d''emploi de test
INSERT INTO public.job_offers_2025_10_03_16_01 (title, company_name, description, requirements, salary_min, salary_max, contract_type, location, source_platform, application_email, deadline, matching_score) VALUES
('Développeur Full-Stack React/Node.js', 'TechStart SA', 'Nous recherchons un développeur passionné pour rejoindre notre équipe dynamique. Vous travaillerez sur des projets innovants utilisant les dernières technologies.', 'Expérience en React, Node.js, TypeScript. Maîtrise de Git. Esprit d''équipe.', 80000, 120000, 'cdi', 'Lausanne, VD', 'jobup', 'recrutement@techstart.ch', '2025-11-15', 0.85),
('Consultant en Ressources Humaines', 'RH Solutions Genève', 'Poste de consultant RH pour accompagner nos clients dans leurs projets de transformation organisationnelle.', 'Formation en RH, expérience en conseil, excellentes compétences relationnelles.', 70000, 95000, 'cdi', 'Genève, GE', 'indeed', 'jobs@rhsolutions.ch', '2025-10-30', 0.72),
('Infirmier/ère diplômé(e)', 'Hôpital du Valais', 'Rejoignez notre équipe soignante dans un environnement moderne et bienveillant.', 'Diplôme d''infirmier reconnu, expérience souhaitée, empathie et professionnalisme.', 65000, 85000, 'cdi', 'Sion, VS', 'orp', 'recrutement@hopitalvs.ch', '2025-11-01', 0.90),
('Chef de Projet Marketing Digital', 'Digital Agency Neuchâtel', 'Pilotage de projets marketing digital pour des clients variés. Poste créatif et stratégique.', 'Expérience en marketing digital, maîtrise des outils analytics, créativité.', 75000, 100000, 'cdi', 'Neuchâtel, NE', 'linkedin', 'careers@digitalagency.ch', '2025-11-20', 0.78),
('Comptable Senior', 'Fiduciaire Fribourg', 'Gestion complète de portefeuilles clients, établissement de comptes annuels.', 'Formation comptable, expérience en fiduciaire, maîtrise des logiciels comptables.', 60000, 80000, 'cdi', 'Fribourg, FR', 'jobup', 'admin@fiduciaire-fr.ch', '2025-10-25', 0.68);

-- Insertion de quelques ressources d''entretien
INSERT INTO public.interview_resources_2025_10_03_16_01 (title, description, resource_type, category, tags) VALUES
('Comment se présenter en 2 minutes', 'Guide complet pour réussir sa présentation personnelle lors d''un entretien d''embauche', 'document', 'preparation', ARRAY['presentation', 'elevator-pitch', 'communication']),
('Questions fréquentes en entretien RH', 'Liste des 50 questions les plus posées par les recruteurs avec des conseils de réponse', 'document', 'questions', ARRAY['questions', 'rh', 'preparation']),
('Négocier son salaire efficacement', 'Techniques et stratégies pour négocier sa rémunération', 'document', 'negociation', ARRAY['salaire', 'negociation', 'strategie']),
('Gérer le stress avant un entretien', 'Méthodes de relaxation et de préparation mentale', 'document', 'preparation', ARRAY['stress', 'relaxation', 'mental']),
('Entretien vidéo : bonnes pratiques', 'Guide pour réussir ses entretiens en visioconférence', 'document', 'techniques', ARRAY['video', 'visio', 'technologie']);