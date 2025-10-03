import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from 'recharts';
import {
  Briefcase,
  Calendar,
  TrendingUp,
  Users,
  Clock,
  CheckCircle,
  AlertCircle,
  Plus,
  Search,
  FileText,
  Brain,
  Target,
  Zap,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Application, JobOffer } from '@/types/database';

interface DashboardStats {
  totalApplications: number;
  applicationsThisMonth: number;
  interviewsScheduled: number;
  successRate: number;
  avgResponseTime: number;
}

const quickActions = [
  {
    title: 'Rechercher des emplois',
    description: 'Découvrir de nouvelles opportunités',
    icon: Search,
    href: '/jobs',
    color: 'bg-blue-500',
  },
  {
    title: 'Générer un CV',
    description: 'Créer un CV personnalisé',
    icon: FileText,
    href: '/cv-generator',
    color: 'bg-green-500',
  },
  {
    title: 'Test RIASEC',
    description: 'Découvrir vos intérêts',
    icon: Brain,
    href: '/riasec',
    color: 'bg-purple-500',
  },
  {
    title: 'Préparer un entretien',
    description: 'S\'entraîner avec l\'IA',
    icon: Users,
    href: '/interviews',
    color: 'bg-orange-500',
  },
];

const applicationStatusData = [
  { name: 'En attente', value: 8, color: '#f59e0b' },
  { name: 'Entretien', value: 3, color: '#3b82f6' },
  { name: 'Acceptées', value: 2, color: '#10b981' },
  { name: 'Refusées', value: 5, color: '#ef4444' },
];

const monthlyData = [
  { month: 'Jan', applications: 12, interviews: 3 },
  { month: 'Fév', applications: 15, interviews: 4 },
  { month: 'Mar', applications: 18, interviews: 6 },
  { month: 'Avr', applications: 22, interviews: 8 },
  { month: 'Mai', applications: 25, interviews: 10 },
  { month: 'Jun', applications: 20, interviews: 7 },
];

export const DashboardPage: React.FC = () => {
  const { user, profile } = useAuth();
  const [stats, setStats] = useState<DashboardStats>({
    totalApplications: 0,
    applicationsThisMonth: 0,
    interviewsScheduled: 0,
    successRate: 0,
    avgResponseTime: 0,
  });
  const [recentApplications, setRecentApplications] = useState<Application[]>([]);
  const [recommendedJobs, setRecommendedJobs] = useState<JobOffer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchDashboardData();
    }
  }, [user]);

  const fetchDashboardData = async () => {
    try {
      // Récupérer les statistiques des candidatures
      const { data: applications } = await supabase
        .from('applications_2025_10_03_16_01')
        .select('*')
        .eq('user_id', user!.id);

      // Récupérer les candidatures récentes avec les offres d'emploi
      const { data: recentApps } = await supabase
        .from('applications_2025_10_03_16_01')
        .select(`
          *,
          job_offer:job_offers_2025_10_03_16_01(*)
        `)
        .eq('user_id', user!.id)
        .order('created_at', { ascending: false })
        .limit(5);

      // Récupérer les offres recommandées
      const { data: jobs } = await supabase
        .from('job_offers_2025_10_03_16_01')
        .select('*')
        .eq('is_active', true)
        .order('matching_score', { ascending: false })
        .limit(6);

      if (applications) {
        const now = new Date();
        const thisMonth = applications.filter(app => {
          const appDate = new Date(app.created_at);
          return appDate.getMonth() === now.getMonth() && appDate.getFullYear() === now.getFullYear();
        });

        const interviews = applications.filter(app => 
          app.status === 'interview_scheduled' || app.status === 'interview_done'
        );

        const accepted = applications.filter(app => app.status === 'accepted');
        const successRate = applications.length > 0 ? (accepted.length / applications.length) * 100 : 0;

        setStats({
          totalApplications: applications.length,
          applicationsThisMonth: thisMonth.length,
          interviewsScheduled: interviews.length,
          successRate: Math.round(successRate),
          avgResponseTime: 7, // Placeholder
        });
      }

      if (recentApps) setRecentApplications(recentApps);
      if (jobs) setRecommendedJobs(jobs);
    } catch (error) {
      console.error('Erreur lors du chargement des données:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft': return 'bg-gray-500';
      case 'applied': return 'bg-blue-500';
      case 'interview_scheduled': return 'bg-purple-500';
      case 'interview_done': return 'bg-orange-500';
      case 'accepted': return 'bg-green-500';
      case 'rejected': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'draft': return 'Brouillon';
      case 'applied': return 'Envoyée';
      case 'interview_scheduled': return 'Entretien prévu';
      case 'interview_done': return 'Entretien passé';
      case 'accepted': return 'Acceptée';
      case 'rejected': return 'Refusée';
      default: return status;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* En-tête de bienvenue */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            Bonjour {profile?.first_name || 'Utilisateur'} ! 👋
          </h1>
          <p className="text-muted-foreground mt-2">
            Voici un aperçu de votre recherche d'emploi en Suisse Romande
          </p>
        </div>
        <div className="flex items-center space-x-3 mt-4 lg:mt-0">
          <Badge variant={profile?.subscription_type === 'premium' ? 'default' : 'secondary'}>
            {profile?.subscription_type === 'free' ? 'Gratuit' : 
             profile?.subscription_type === 'premium' ? 'Premium' : 'Enterprise'}
          </Badge>
          <Button className="gradient-primary text-white" asChild>
            <Link to="/jobs">
              <Plus className="mr-2 h-4 w-4" />
              Nouvelle recherche
            </Link>
          </Button>
        </div>
      </div>

      {/* Statistiques principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="stats-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Candidatures totales</CardTitle>
            <Briefcase className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalApplications}</div>
            <p className="text-xs text-muted-foreground">
              +{stats.applicationsThisMonth} ce mois
            </p>
          </CardContent>
        </Card>

        <Card className="stats-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Entretiens</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.interviewsScheduled}</div>
            <p className="text-xs text-muted-foreground">
              Programmés ou passés
            </p>
          </CardContent>
        </Card>

        <Card className="stats-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taux de réussite</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.successRate}%</div>
            <Progress value={stats.successRate} className="mt-2" />
          </CardContent>
        </Card>

        <Card className="stats-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Temps de réponse</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.avgResponseTime}j</div>
            <p className="text-xs text-muted-foreground">
              Moyenne des réponses
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Actions rapides */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Zap className="mr-2 h-5 w-5" />
            Actions rapides
          </CardTitle>
          <CardDescription>
            Accédez rapidement aux fonctionnalités principales
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickActions.map((action, index) => (
              <Link key={index} to={action.href}>
                <Card className="job-card hover:shadow-primary/20 cursor-pointer">
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-3">
                      <div className={`w-10 h-10 ${action.color} rounded-lg flex items-center justify-center`}>
                        <action.icon className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-sm">{action.title}</h3>
                        <p className="text-xs text-muted-foreground">{action.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Graphique des candidatures par mois */}
        <Card>
          <CardHeader>
            <CardTitle>Évolution mensuelle</CardTitle>
            <CardDescription>
              Candidatures et entretiens par mois
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="applications" 
                  stroke="hsl(var(--primary))" 
                  strokeWidth={2}
                  name="Candidatures"
                />
                <Line 
                  type="monotone" 
                  dataKey="interviews" 
                  stroke="hsl(var(--accent))" 
                  strokeWidth={2}
                  name="Entretiens"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Répartition des statuts */}
        <Card>
          <CardHeader>
            <CardTitle>Statut des candidatures</CardTitle>
            <CardDescription>
              Répartition par statut actuel
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={applicationStatusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {applicationStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Candidatures récentes */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Candidatures récentes</CardTitle>
              <CardDescription>
                Vos 5 dernières candidatures
              </CardDescription>
            </div>
            <Button variant="outline" size="sm" asChild>
              <Link to="/applications">Voir tout</Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentApplications.length > 0 ? (
                recentApplications.map((application) => (
                  <div key={application.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex-1">
                      <h4 className="font-medium text-sm">
                        {application.job_offer?.title || 'Titre non disponible'}
                      </h4>
                      <p className="text-xs text-muted-foreground">
                        {application.job_offer?.company_name || 'Entreprise non disponible'}
                      </p>
                    </div>
                    <Badge 
                      className={`${getStatusColor(application.status)} text-white text-xs`}
                    >
                      {getStatusLabel(application.status)}
                    </Badge>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Briefcase className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Aucune candidature pour le moment</p>
                  <Button className="mt-4" asChild>
                    <Link to="/jobs">Commencer à postuler</Link>
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Offres recommandées */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Offres recommandées</CardTitle>
              <CardDescription>
                Sélectionnées pour votre profil
              </CardDescription>
            </div>
            <Button variant="outline" size="sm" asChild>
              <Link to="/jobs">Voir plus</Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recommendedJobs.length > 0 ? (
                recommendedJobs.slice(0, 5).map((job) => (
                  <div key={job.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="flex-1">
                      <h4 className="font-medium text-sm">{job.title}</h4>
                      <p className="text-xs text-muted-foreground">
                        {job.company_name} • {job.location}
                      </p>
                      {job.matching_score && (
                        <div className="flex items-center mt-1">
                          <Target className="h-3 w-3 mr-1 text-green-500" />
                          <span className="text-xs text-green-600">
                            {Math.round(job.matching_score * 100)}% de correspondance
                          </span>
                        </div>
                      )}
                    </div>
                    <Button size="sm" variant="outline">
                      Voir
                    </Button>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Search className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Aucune offre recommandée</p>
                  <p className="text-xs mt-2">Complétez votre profil pour de meilleures recommandations</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};