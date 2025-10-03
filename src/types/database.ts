// Types de base de données pour l'application SaaS Recherche d'Emploi Suisse Romande

export interface Canton {
  id: string;
  code: string;
  name: string;
  created_at: string;
}

export interface Commune {
  id: string;
  canton_id: string;
  name: string;
  postal_code?: string;
  bfs_number?: number;
  created_at: string;
  canton?: Canton;
}

export interface Sector {
  id: string;
  parent_id?: string;
  noga_code?: string;
  name: string;
  level: number; // 1=Section, 2=Division, 3=Groupe, 4=Classe
  created_at: string;
  parent?: Sector;
  children?: Sector[];
}

export interface UserProfile {
  id: string;
  email: string;
  first_name?: string;
  last_name?: string;
  phone?: string;
  address?: string;
  canton_id?: string;
  commune_id?: string;
  preferred_sectors: string[];
  experience_level: 'junior' | 'intermediate' | 'senior' | 'expert';
  availability: 'immediate' | '1month' | '3months' | '6months';
  contract_types: ('cdi' | 'cdd' | 'stage' | 'freelance' | 'temps_partiel')[];
  salary_min?: number;
  salary_max?: number;
  profile_photo_url?: string;
  cv_url?: string;
  cover_letter_template?: string;
  subscription_type: 'free' | 'premium' | 'enterprise';
  subscription_expires_at?: string;
  automation_level: 'semi' | 'auto' | 'manual';
  created_at: string;
  updated_at: string;
  canton?: Canton;
  commune?: Commune;
}

export interface JobOffer {
  id: string;
  title: string;
  company_name: string;
  description?: string;
  requirements?: string;
  salary_min?: number;
  salary_max?: number;
  contract_type: string;
  location?: string;
  canton_id?: string;
  commune_id?: string;
  sector_id?: string;
  source_url?: string;
  source_platform?: string;
  application_url?: string;
  application_email?: string;
  contact_person?: string;
  deadline?: string;
  is_active: boolean;
  matching_score?: number;
  extracted_at: string;
  created_at: string;
  canton?: Canton;
  commune?: Commune;
  sector?: Sector;
}

export interface Application {
  id: string;
  user_id: string;
  job_offer_id: string;
  status: 'draft' | 'applied' | 'interview_scheduled' | 'interview_done' | 'rejected' | 'accepted' | 'withdrawn';
  kanban_position: number;
  generated_cv_url?: string;
  generated_cover_letter_url?: string;
  custom_cv_url?: string;
  custom_cover_letter_url?: string;
  additional_documents: string[];
  application_sent_at?: string;
  interview_date?: string;
  interview_notes?: string;
  feedback?: string;
  follow_up_date?: string;
  auto_generated: boolean;
  created_at: string;
  updated_at: string;
  job_offer?: JobOffer;
}

export interface UserDocument {
  id: string;
  user_id: string;
  document_type: 'cv' | 'cover_letter' | 'diploma' | 'certificate' | 'photo' | 'other';
  file_name: string;
  file_url: string;
  file_size?: number;
  mime_type?: string;
  is_primary: boolean;
  tags: string[];
  created_at: string;
}

export interface RiasecTest {
  id: string;
  question_number: number;
  question_text: string;
  category: 'R' | 'I' | 'A' | 'S' | 'E' | 'C';
  created_at: string;
}

export interface RiasecResult {
  id: string;
  user_id: string;
  realistic_score: number;
  investigative_score: number;
  artistic_score: number;
  social_score: number;
  enterprising_score: number;
  conventional_score: number;
  dominant_type?: 'R' | 'I' | 'A' | 'S' | 'E' | 'C';
  recommended_sectors: string[];
  report_url?: string;
  completed_at: string;
}

export interface EnneagramTest {
  id: string;
  question_number: number;
  question_text: string;
  type_1_weight: number;
  type_2_weight: number;
  type_3_weight: number;
  type_4_weight: number;
  type_5_weight: number;
  type_6_weight: number;
  type_7_weight: number;
  type_8_weight: number;
  type_9_weight: number;
  created_at: string;
}

export interface EnneagramResult {
  id: string;
  user_id: string;
  type_1_score: number;
  type_2_score: number;
  type_3_score: number;
  type_4_score: number;
  type_5_score: number;
  type_6_score: number;
  type_7_score: number;
  type_8_score: number;
  type_9_score: number;
  dominant_type?: number;
  wing_type?: number;
  description?: string;
  career_recommendations?: string;
  report_url?: string;
  completed_at: string;
}

export interface InterviewResource {
  id: string;
  title: string;
  description?: string;
  resource_type: 'video' | 'audio' | 'document' | 'link';
  file_url?: string;
  thumbnail_url?: string;
  duration?: number;
  category?: string;
  tags: string[];
  is_public: boolean;
  created_at: string;
}

export interface Notification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  category?: string;
  is_read: boolean;
  action_url?: string;
  created_at: string;
}

export interface ActivityLog {
  id: string;
  user_id: string;
  action: string;
  entity_type?: string;
  entity_id?: string;
  details?: Record<string, any>;
  ip_address?: string;
  user_agent?: string;
  created_at: string;
}

// Types pour les réponses aux tests
export interface RiasecAnswer {
  question_id: string;
  score: number; // 1-5 (pas du tout d'accord à tout à fait d'accord)
}

export interface EnneagramAnswer {
  question_id: string;
  score: number; // 1-5 (pas du tout d'accord à tout à fait d'accord)
}

// Types pour les statistiques du dashboard
export interface DashboardStats {
  total_applications: number;
  applications_this_month: number;
  interviews_scheduled: number;
  success_rate: number;
  avg_response_time: number;
  top_sectors: Array<{
    sector_name: string;
    application_count: number;
  }>;
  monthly_activity: Array<{
    month: string;
    applications: number;
    interviews: number;
  }>;
}

// Types pour les filtres de recherche
export interface JobSearchFilters {
  keywords?: string;
  canton_ids?: string[];
  commune_ids?: string[];
  sector_ids?: string[];
  contract_types?: string[];
  salary_min?: number;
  salary_max?: number;
  experience_level?: string;
  remote_work?: boolean;
  posted_within_days?: number;
}

// Types pour les préférences utilisateur
export interface UserPreferences {
  email_notifications: boolean;
  push_notifications: boolean;
  auto_apply: boolean;
  max_applications_per_day: number;
  preferred_interview_times: string[];
  cv_template_id?: string;
  cover_letter_template_id?: string;
}