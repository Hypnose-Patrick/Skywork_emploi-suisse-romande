import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Search,
  MapPin,
  Briefcase,
  Clock,
  Euro,
  Filter,
  SlidersHorizontal,
  Target,
  Building,
  Calendar,
  ExternalLink,
  Heart,
  Send,
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { JobOffer, Canton, Commune, Sector, JobSearchFilters } from '@/types/database';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';

export const JobSearchPage: React.FC = () => {
  const { user } = useAuth();
  const [jobs, setJobs] = useState<JobOffer[]>([]);
  const [cantons, setCantons] = useState<Canton[]>([]);
  const [communes, setCommunnes] = useState<Commune[]>([]);
  const [sectors, setSectors] = useState<Sector[]>([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  
  const [filters, setFilters] = useState<JobSearchFilters>({
    keywords: '',
    canton_ids: [],
    commune_ids: [],
    sector_ids: [],
    contract_types: [],
    salary_min: undefined,
    salary_max: undefined,
    posted_within_days: 30,
  });

  const contractTypes = [
    { value: 'cdi', label: 'CDI' },
    { value: 'cdd', label: 'CDD' },
    { value: 'stage', label: 'Stage' },
    { value: 'freelance', label: 'Freelance' },
    { value: 'temps_partiel', label: 'Temps partiel' },
  ];

  useEffect(() => {
    fetchInitialData();
    searchJobs();
  }, []);

  const fetchInitialData = async () => {
    try {
      const [cantonsRes, communesRes, sectorsRes] = await Promise.all([
        supabase.from('cantons_2025_10_03_16_01').select('*').order('name'),
        supabase.from('communes_2025_10_03_16_01').select('*').order('name'),
        supabase.from('sectors_2025_10_03_16_01').select('*').eq('level', 1).order('name'),
      ]);

      if (cantonsRes.data) setCantons(cantonsRes.data);
      if (communesRes.data) setCommunnes(communesRes.data);
      if (sectorsRes.data) setSectors(sectorsRes.data);
    } catch (error) {
      console.error('Erreur lors du chargement des données:', error);
    }
  };

  const searchJobs = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from('job_offers_2025_10_03_16_01')
        .select(`
          *,
          canton:cantons_2025_10_03_16_01(*),
          commune:communes_2025_10_03_16_01(*),
          sector:sectors_2025_10_03_16_01(*)
        `)
        .eq('is_active', true);

      // Filtres de recherche
      if (filters.keywords) {
        query = query.or(`title.ilike.%${filters.keywords}%,description.ilike.%${filters.keywords}%,company_name.ilike.%${filters.keywords}%`);
      }

      if (filters.canton_ids && filters.canton_ids.length > 0) {
        query = query.in('canton_id', filters.canton_ids);
      }

      if (filters.commune_ids && filters.commune_ids.length > 0) {
        query = query.in('commune_id', filters.commune_ids);
      }

      if (filters.sector_ids && filters.sector_ids.length > 0) {
        query = query.in('sector_id', filters.sector_ids);
      }

      if (filters.contract_types && filters.contract_types.length > 0) {
        query = query.in('contract_type', filters.contract_types);
      }

      if (filters.salary_min) {
        query = query.gte('salary_min', filters.salary_min);
      }

      if (filters.salary_max) {
        query = query.lte('salary_max', filters.salary_max);
      }

      if (filters.posted_within_days) {
        const dateLimit = new Date();
        dateLimit.setDate(dateLimit.getDate() - filters.posted_within_days);
        query = query.gte('created_at', dateLimit.toISOString());
      }

      const { data, error } = await query
        .order('matching_score', { ascending: false, nullsLast: true })
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;
      setJobs(data || []);
    } catch (error) {
      console.error('Erreur lors de la recherche:', error);
      toast({
        title: "Erreur de recherche",
        description: "Impossible de charger les offres d'emploi",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key: keyof JobSearchFilters, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleArrayFilterChange = (key: keyof JobSearchFilters, value: string, checked: boolean) => {
    setFilters(prev => {
      const currentArray = (prev[key] as string[]) || [];
      if (checked) {
        return { ...prev, [key]: [...currentArray, value] };
      } else {
        return { ...prev, [key]: currentArray.filter(item => item !== value) };
      }
    });
  };

  const clearFilters = () => {
    setFilters({
      keywords: '',
      canton_ids: [],
      commune_ids: [],
      sector_ids: [],
      contract_types: [],
      salary_min: undefined,
      salary_max: undefined,
      posted_within_days: 30,
    });
  };

  const applyToJob = async (jobId: string) => {
    if (!user) {
      toast({
        title: "Connexion requise",
        description: "Vous devez être connecté pour postuler",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('applications_2025_10_03_16_01')
        .insert([{
          user_id: user.id,
          job_offer_id: jobId,
          status: 'draft',
          auto_generated: false,
        }]);

      if (error) throw error;

      toast({
        title: "Candidature créée",
        description: "Votre candidature a été ajoutée à vos brouillons",
      });
    } catch (error) {
      console.error('Erreur lors de la candidature:', error);
      toast({
        title: "Erreur",
        description: "Impossible de créer la candidature",
        variant: "destructive",
      });
    }
  };

  const formatSalary = (min?: number, max?: number) => {
    if (!min && !max) return 'Salaire non spécifié';
    if (min && max) return `${min.toLocaleString()} - ${max.toLocaleString()} CHF`;
    if (min) return `Dès ${min.toLocaleString()} CHF`;
    if (max) return `Jusqu'à ${max.toLocaleString()} CHF`;
    return '';
  };

  const getContractTypeLabel = (type: string) => {
    const contract = contractTypes.find(c => c.value === type);
    return contract?.label || type;
  };

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Recherche d'emploi</h1>
          <p className="text-muted-foreground mt-2">
            Découvrez les meilleures opportunités en Suisse Romande
          </p>
        </div>
        <div className="flex items-center space-x-2 mt-4 lg:mt-0">
          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center"
          >
            <SlidersHorizontal className="mr-2 h-4 w-4" />
            Filtres
          </Button>
          <Button onClick={searchJobs} className="gradient-primary text-white">
            <Search className="mr-2 h-4 w-4" />
            Rechercher
          </Button>
        </div>
      </div>

      <div className="grid lg:grid-cols-4 gap-6">
        {/* Filtres */}
        <div className={`lg:col-span-1 ${showFilters ? 'block' : 'hidden lg:block'}`}>
          <Card className="sticky top-6">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center">
                  <Filter className="mr-2 h-4 w-4" />
                  Filtres
                </span>
                <Button variant="ghost" size="sm" onClick={clearFilters}>
                  Effacer
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Mots-clés */}
              <div className="space-y-2">
                <Label htmlFor="keywords">Mots-clés</Label>
                <Input
                  id="keywords"
                  placeholder="Poste, compétences, entreprise..."
                  value={filters.keywords}
                  onChange={(e) => handleFilterChange('keywords', e.target.value)}
                />
              </div>

              {/* Canton */}
              <div className="space-y-2">
                <Label>Canton</Label>
                <ScrollArea className="h-32 border rounded-md p-2">
                  {cantons.map((canton) => (
                    <div key={canton.id} className="flex items-center space-x-2 py-1">
                      <Checkbox
                        id={`canton-${canton.id}`}
                        checked={filters.canton_ids?.includes(canton.id) || false}
                        onCheckedChange={(checked) => 
                          handleArrayFilterChange('canton_ids', canton.id, checked as boolean)
                        }
                      />
                      <Label htmlFor={`canton-${canton.id}`} className="text-sm">
                        {canton.name} ({canton.code})
                      </Label>
                    </div>
                  ))}
                </ScrollArea>
              </div>

              {/* Secteur */}
              <div className="space-y-2">
                <Label>Secteur d'activité</Label>
                <ScrollArea className="h-32 border rounded-md p-2">
                  {sectors.map((sector) => (
                    <div key={sector.id} className="flex items-center space-x-2 py-1">
                      <Checkbox
                        id={`sector-${sector.id}`}
                        checked={filters.sector_ids?.includes(sector.id) || false}
                        onCheckedChange={(checked) => 
                          handleArrayFilterChange('sector_ids', sector.id, checked as boolean)
                        }
                      />
                      <Label htmlFor={`sector-${sector.id}`} className="text-sm">
                        {sector.name}
                      </Label>
                    </div>
                  ))}
                </ScrollArea>
              </div>

              {/* Type de contrat */}
              <div className="space-y-2">
                <Label>Type de contrat</Label>
                <div className="space-y-2">
                  {contractTypes.map((contract) => (
                    <div key={contract.value} className="flex items-center space-x-2">
                      <Checkbox
                        id={`contract-${contract.value}`}
                        checked={filters.contract_types?.includes(contract.value) || false}
                        onCheckedChange={(checked) => 
                          handleArrayFilterChange('contract_types', contract.value, checked as boolean)
                        }
                      />
                      <Label htmlFor={`contract-${contract.value}`} className="text-sm">
                        {contract.label}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Salaire */}
              <div className="space-y-2">
                <Label>Salaire (CHF)</Label>
                <div className="grid grid-cols-2 gap-2">
                  <Input
                    type="number"
                    placeholder="Min"
                    value={filters.salary_min || ''}
                    onChange={(e) => handleFilterChange('salary_min', e.target.value ? parseInt(e.target.value) : undefined)}
                  />
                  <Input
                    type="number"
                    placeholder="Max"
                    value={filters.salary_max || ''}
                    onChange={(e) => handleFilterChange('salary_max', e.target.value ? parseInt(e.target.value) : undefined)}
                  />
                </div>
              </div>

              {/* Date de publication */}
              <div className="space-y-2">
                <Label>Publié dans les</Label>
                <Select 
                  value={filters.posted_within_days?.toString()} 
                  onValueChange={(value) => handleFilterChange('posted_within_days', parseInt(value))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">24 heures</SelectItem>
                    <SelectItem value="7">7 jours</SelectItem>
                    <SelectItem value="30">30 jours</SelectItem>
                    <SelectItem value="90">3 mois</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Résultats */}
        <div className="lg:col-span-3">
          {/* Barre de résultats */}
          <div className="flex items-center justify-between mb-6">
            <div className="text-sm text-muted-foreground">
              {loading ? 'Recherche en cours...' : `${jobs.length} offre(s) trouvée(s)`}
            </div>
            <Select defaultValue="relevance">
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="relevance">Pertinence</SelectItem>
                <SelectItem value="date">Date de publication</SelectItem>
                <SelectItem value="salary">Salaire</SelectItem>
                <SelectItem value="company">Entreprise</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Liste des offres */}
          <div className="space-y-4">
            {loading ? (
              <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : jobs.length > 0 ? (
              jobs.map((job) => (
                <Card key={job.id} className="job-card">
                  <CardContent className="p-6">
                    <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between">
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h3 className="text-lg font-semibold text-foreground hover:text-primary cursor-pointer">
                              {job.title}
                            </h3>
                            <div className="flex items-center text-muted-foreground text-sm mt-1">
                              <Building className="h-4 w-4 mr-1" />
                              <span className="font-medium">{job.company_name}</span>
                              {job.location && (
                                <>
                                  <span className="mx-2">•</span>
                                  <MapPin className="h-4 w-4 mr-1" />
                                  <span>{job.location}</span>
                                </>
                              )}
                            </div>
                          </div>
                          {job.matching_score && (
                            <Badge className="bg-green-100 text-green-800 border-green-200">
                              <Target className="h-3 w-3 mr-1" />
                              {Math.round(job.matching_score * 100)}% match
                            </Badge>
                          )}
                        </div>

                        <p className="text-muted-foreground text-sm mb-4 line-clamp-3">
                          {job.description}
                        </p>

                        <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-4">
                          <div className="flex items-center">
                            <Briefcase className="h-4 w-4 mr-1" />
                            <span>{getContractTypeLabel(job.contract_type)}</span>
                          </div>
                          <div className="flex items-center">
                            <Euro className="h-4 w-4 mr-1" />
                            <span>{formatSalary(job.salary_min, job.salary_max)}</span>
                          </div>
                          <div className="flex items-center">
                            <Clock className="h-4 w-4 mr-1" />
                            <span>
                              {new Date(job.created_at).toLocaleDateString('fr-CH')}
                            </span>
                          </div>
                          {job.deadline && (
                            <div className="flex items-center">
                              <Calendar className="h-4 w-4 mr-1" />
                              <span>
                                Échéance: {new Date(job.deadline).toLocaleDateString('fr-CH')}
                              </span>
                            </div>
                          )}
                        </div>

                        {job.sector && (
                          <Badge variant="secondary" className="mr-2">
                            {job.sector.name}
                          </Badge>
                        )}
                      </div>

                      <div className="flex flex-col space-y-2 mt-4 lg:mt-0 lg:ml-6">
                        <Button 
                          onClick={() => applyToJob(job.id)}
                          className="gradient-primary text-white"
                        >
                          <Send className="mr-2 h-4 w-4" />
                          Postuler
                        </Button>
                        <Button variant="outline" size="sm">
                          <Heart className="mr-2 h-4 w-4" />
                          Sauvegarder
                        </Button>
                        {job.source_url && (
                          <Button variant="ghost" size="sm" asChild>
                            <a href={job.source_url} target="_blank" rel="noopener noreferrer">
                              <ExternalLink className="mr-2 h-4 w-4" />
                              Voir l'annonce
                            </a>
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Card>
                <CardContent className="text-center py-12">
                  <Search className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                  <h3 className="text-lg font-semibold mb-2">Aucune offre trouvée</h3>
                  <p className="text-muted-foreground mb-4">
                    Essayez de modifier vos critères de recherche ou d'élargir vos filtres
                  </p>
                  <Button onClick={clearFilters} variant="outline">
                    Effacer les filtres
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};