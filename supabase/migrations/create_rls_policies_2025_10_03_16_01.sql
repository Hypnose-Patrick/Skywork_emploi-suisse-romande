-- Politiques RLS pour l'application SaaS Recherche d'Emploi Suisse Romande
-- Créé le 2025-10-03 16:01 UTC

-- Activation de RLS sur toutes les tables sensibles
ALTER TABLE public.user_profiles_2025_10_03_16_01 ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.applications_2025_10_03_16_01 ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_documents_2025_10_03_16_01 ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.riasec_results_2025_10_03_16_01 ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.enneagram_results_2025_10_03_16_01 ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications_2025_10_03_16_01 ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_log_2025_10_03_16_01 ENABLE ROW LEVEL SECURITY;

-- Politiques pour user_profiles_2025_10_03_16_01
CREATE POLICY "Users can view own profile" ON public.user_profiles_2025_10_03_16_01
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.user_profiles_2025_10_03_16_01
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON public.user_profiles_2025_10_03_16_01
    FOR INSERT WITH CHECK (auth.uid() = id);

-- Politiques pour applications_2025_10_03_16_01
CREATE POLICY "Users can view own applications" ON public.applications_2025_10_03_16_01
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own applications" ON public.applications_2025_10_03_16_01
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own applications" ON public.applications_2025_10_03_16_01
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own applications" ON public.applications_2025_10_03_16_01
    FOR DELETE USING (auth.uid() = user_id);

-- Politiques pour user_documents_2025_10_03_16_01
CREATE POLICY "Users can view own documents" ON public.user_documents_2025_10_03_16_01
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own documents" ON public.user_documents_2025_10_03_16_01
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own documents" ON public.user_documents_2025_10_03_16_01
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own documents" ON public.user_documents_2025_10_03_16_01
    FOR DELETE USING (auth.uid() = user_id);

-- Politiques pour riasec_results_2025_10_03_16_01
CREATE POLICY "Users can view own RIASEC results" ON public.riasec_results_2025_10_03_16_01
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own RIASEC results" ON public.riasec_results_2025_10_03_16_01
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own RIASEC results" ON public.riasec_results_2025_10_03_16_01
    FOR UPDATE USING (auth.uid() = user_id);

-- Politiques pour enneagram_results_2025_10_03_16_01
CREATE POLICY "Users can view own Enneagram results" ON public.enneagram_results_2025_10_03_16_01
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own Enneagram results" ON public.enneagram_results_2025_10_03_16_01
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own Enneagram results" ON public.enneagram_results_2025_10_03_16_01
    FOR UPDATE USING (auth.uid() = user_id);

-- Politiques pour notifications_2025_10_03_16_01
CREATE POLICY "Users can view own notifications" ON public.notifications_2025_10_03_16_01
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own notifications" ON public.notifications_2025_10_03_16_01
    FOR UPDATE USING (auth.uid() = user_id);

-- Politiques pour activity_log_2025_10_03_16_01
CREATE POLICY "Users can view own activity log" ON public.activity_log_2025_10_03_16_01
    FOR SELECT USING (auth.uid() = user_id);

-- Politiques pour les tables de référence (lecture publique pour les utilisateurs authentifiés)
CREATE POLICY "Authenticated users can view cantons" ON public.cantons_2025_10_03_16_01
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can view communes" ON public.communes_2025_10_03_16_01
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can view sectors" ON public.sectors_2025_10_03_16_01
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can view job offers" ON public.job_offers_2025_10_03_16_01
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can view RIASEC tests" ON public.riasec_tests_2025_10_03_16_01
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can view Enneagram tests" ON public.enneagram_tests_2025_10_03_16_01
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can view interview resources" ON public.interview_resources_2025_10_03_16_01
    FOR SELECT USING (auth.role() = 'authenticated');

-- Activation de RLS sur les tables de référence
ALTER TABLE public.cantons_2025_10_03_16_01 ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.communes_2025_10_03_16_01 ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sectors_2025_10_03_16_01 ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.job_offers_2025_10_03_16_01 ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.riasec_tests_2025_10_03_16_01 ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.enneagram_tests_2025_10_03_16_01 ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.interview_resources_2025_10_03_16_01 ENABLE ROW LEVEL SECURITY;