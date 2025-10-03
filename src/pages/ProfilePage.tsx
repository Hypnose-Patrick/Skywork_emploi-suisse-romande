import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  User,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  GraduationCap,
  Award,
  Upload,
  Save,
  Edit,
  FileText,
  Calendar,
  Target,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Canton, Commune, Sector } from '@/types/database';
import { toast } from '@/hooks/use-toast';

export const ProfilePage: React.FC = () => {
  const { user, profile, updateProfile } = useAuth();
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [cantons, setCantons] = useState<Canton[]>([]);
  const [communes, setCommunnes] = useState<Commune[]>([]);
  const [sectors, setSectors] = useState<Sector[]>([]);
  const [filteredCommunes, setFilteredCommunes] = useState<Commune[]>([]);
  
  const [formData, setFormData] = useState({
    first_name: profile?.first_name || '',
    last_name: profile?.last_name || '',
    email: profile?.email || '',
    phone: profile?.phone || '',
    address: profile?.address || '',
    canton_id: profile?.canton_id || '',
    commune_id: profile?.commune_id || '',
    experience_level: profile?.experience_level || 'junior',
    availability: profile?.availability || 'immediate',
    contract_types: profile?.contract_types || ['cdi'],
    salary_min: profile?.salary_min || '',
    salary_max: profile?.salary_max || '',
    cover_letter_template: profile?.cover_letter_template || '',
    automation_level: profile?.automation_level || 'semi',
  });

  useEffect(() => {
    fetchReferenceData();
  }, []);

  useEffect(() => {
    if (formData.canton_id) {
      const filtered = communes.filter(commune => commune.canton_id === formData.canton_id);
      setFilteredCommunes(filtered);
    } else {
      setFilteredCommunes([]);
    }
  }, [formData.canton_id, communes]);

  const fetchReferenceData = async () => {
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

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      await updateProfile({
        ...formData,
        salary_min: formData.salary_min ? parseInt(formData.salary_min as string) : null,
        salary_max: formData.salary_max ? parseInt(formData.salary_max as string) : null,
      });
      setEditing(false);
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      first_name: profile?.first_name || '',
      last_name: profile?.last_name || '',
      email: profile?.email || '',
      phone: profile?.phone || '',
      address: profile?.address || '',
      canton_id: profile?.canton_id || '',
      commune_id: profile?.commune_id || '',
      experience_level: profile?.experience_level || 'junior',
      availability: profile?.availability || 'immediate',
      contract_types: profile?.contract_types || ['cdi'],
      salary_min: profile?.salary_min || '',
      salary_max: profile?.salary_max || '',
      cover_letter_template: profile?.cover_letter_template || '',
      automation_level: profile?.automation_level || 'semi',
    });
    setEditing(false);
  };

  const getExperienceLevelLabel = (level: string) => {
    switch (level) {
      case 'junior': return 'Junior (0-2 ans)';
      case 'intermediate': return 'Intermédiaire (2-5 ans)';
      case 'senior': return 'Senior (5-10 ans)';
      case 'expert': return 'Expert (10+ ans)';
      default: return level;
    }
  };

  const getAvailabilityLabel = (availability: string) => {
    switch (availability) {
      case 'immediate': return 'Immédiate';
      case '1month': return 'Dans 1 mois';
      case '3months': return 'Dans 3 mois';
      case '6months': return 'Dans 6 mois';
      default: return availability;
    }
  };

  const getAutomationLevelLabel = (level: string) => {
    switch (level) {
      case 'semi': return 'Semi-automatique';
      case 'auto': return 'Entièrement automatique';
      case 'manual': return 'Manuel';
      default: return level;
    }
  };

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Mon profil</h1>
          <p className="text-muted-foreground mt-2">
            Gérez vos informations personnelles et préférences de recherche d'emploi
          </p>
        </div>
        <div className="flex items-center space-x-2 mt-4 lg:mt-0">
          {editing ? (
            <>
              <Button variant="outline" onClick={handleCancel}>
                Annuler
              </Button>
              <Button onClick={handleSave} disabled={loading} className="gradient-primary text-white">
                <Save className="mr-2 h-4 w-4" />
                {loading ? 'Sauvegarde...' : 'Sauvegarder'}
              </Button>
            </>
          ) : (
            <Button onClick={() => setEditing(true)} className="gradient-primary text-white">
              <Edit className="mr-2 h-4 w-4" />
              Modifier
            </Button>
          )}
        </div>
      </div>

      <Tabs defaultValue="personal" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="personal">Informations personnelles</TabsTrigger>
          <TabsTrigger value="professional">Profil professionnel</TabsTrigger>
          <TabsTrigger value="preferences">Préférences</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
        </TabsList>

        {/* Informations personnelles */}
        <TabsContent value="personal" className="space-y-6">
          <div className="grid lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <User className="mr-2 h-5 w-5" />
                  Informations personnelles
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">Prénom</Label>
                    <Input
                      id="firstName"
                      value={formData.first_name}
                      onChange={(e) => handleInputChange('first_name', e.target.value)}
                      disabled={!editing}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Nom</Label>
                    <Input
                      id="lastName"
                      value={formData.last_name}
                      onChange={(e) => handleInputChange('last_name', e.target.value)}
                      disabled={!editing}
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        disabled={!editing}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Téléphone</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        disabled={!editing}
                        className="pl-10"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">Adresse</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Textarea
                      id="address"
                      value={formData.address}
                      onChange={(e) => handleInputChange('address', e.target.value)}
                      disabled={!editing}
                      className="pl-10"
                      rows={3}
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="canton">Canton</Label>
                    <Select 
                      value={formData.canton_id} 
                      onValueChange={(value) => handleInputChange('canton_id', value)}
                      disabled={!editing}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner un canton" />
                      </SelectTrigger>
                      <SelectContent>
                        {cantons.map((canton) => (
                          <SelectItem key={canton.id} value={canton.id}>
                            {canton.name} ({canton.code})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="commune">Commune</Label>
                    <Select 
                      value={formData.commune_id} 
                      onValueChange={(value) => handleInputChange('commune_id', value)}
                      disabled={!editing || !formData.canton_id}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner une commune" />
                      </SelectTrigger>
                      <SelectContent>
                        {filteredCommunes.map((commune) => (
                          <SelectItem key={commune.id} value={commune.id}>
                            {commune.name} ({commune.postal_code})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Photo de profil</CardTitle>
              </CardHeader>
              <CardContent className="text-center space-y-4">
                <Avatar className="w-32 h-32 mx-auto">
                  <AvatarImage src={profile?.profile_photo_url} />
                  <AvatarFallback className="text-2xl gradient-primary text-white">
                    {profile?.first_name?.[0]}{profile?.last_name?.[0]}
                  </AvatarFallback>
                </Avatar>
                {editing && (
                  <Button variant="outline" size="sm">
                    <Upload className="mr-2 h-4 w-4" />
                    Changer la photo
                  </Button>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Profil professionnel */}
        <TabsContent value="professional" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Briefcase className="mr-2 h-5 w-5" />
                Profil professionnel
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="experienceLevel">Niveau d'expérience</Label>
                  <Select 
                    value={formData.experience_level} 
                    onValueChange={(value) => handleInputChange('experience_level', value)}
                    disabled={!editing}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="junior">Junior (0-2 ans)</SelectItem>
                      <SelectItem value="intermediate">Intermédiaire (2-5 ans)</SelectItem>
                      <SelectItem value="senior">Senior (5-10 ans)</SelectItem>
                      <SelectItem value="expert">Expert (10+ ans)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="availability">Disponibilité</Label>
                  <Select 
                    value={formData.availability} 
                    onValueChange={(value) => handleInputChange('availability', value)}
                    disabled={!editing}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="immediate">Immédiate</SelectItem>
                      <SelectItem value="1month">Dans 1 mois</SelectItem>
                      <SelectItem value="3months">Dans 3 mois</SelectItem>
                      <SelectItem value="6months">Dans 6 mois</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="salaryMin">Salaire minimum (CHF)</Label>
                  <Input
                    id="salaryMin"
                    type="number"
                    value={formData.salary_min}
                    onChange={(e) => handleInputChange('salary_min', e.target.value)}
                    disabled={!editing}
                    placeholder="Ex: 80000"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="salaryMax">Salaire maximum (CHF)</Label>
                  <Input
                    id="salaryMax"
                    type="number"
                    value={formData.salary_max}
                    onChange={(e) => handleInputChange('salary_max', e.target.value)}
                    disabled={!editing}
                    placeholder="Ex: 120000"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="coverLetterTemplate">Modèle de lettre de motivation</Label>
                <Textarea
                  id="coverLetterTemplate"
                  value={formData.cover_letter_template}
                  onChange={(e) => handleInputChange('cover_letter_template', e.target.value)}
                  disabled={!editing}
                  rows={6}
                  placeholder="Rédigez votre modèle de lettre de motivation qui sera personnalisé automatiquement pour chaque candidature..."
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Préférences */}
        <TabsContent value="preferences" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Target className="mr-2 h-5 w-5" />
                Préférences de recherche
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="automationLevel">Niveau d'automatisation</Label>
                <Select 
                  value={formData.automation_level} 
                  onValueChange={(value) => handleInputChange('automation_level', value)}
                  disabled={!editing}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="manual">Manuel - Je contrôle chaque candidature</SelectItem>
                    <SelectItem value="semi">Semi-automatique - Validation avant envoi</SelectItem>
                    <SelectItem value="auto">Automatique - Envoi sans validation</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="bg-muted/50 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">Résumé de votre profil</h4>
                <div className="grid md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Expérience :</span>
                    <span className="ml-2">{getExperienceLevelLabel(formData.experience_level)}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Disponibilité :</span>
                    <span className="ml-2">{getAvailabilityLabel(formData.availability)}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Salaire :</span>
                    <span className="ml-2">
                      {formData.salary_min && formData.salary_max 
                        ? `${parseInt(formData.salary_min as string).toLocaleString()} - ${parseInt(formData.salary_max as string).toLocaleString()} CHF`
                        : 'Non spécifié'}
                    </span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Automatisation :</span>
                    <span className="ml-2">{getAutomationLevelLabel(formData.automation_level)}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Documents */}
        <TabsContent value="documents" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="mr-2 h-5 w-5" />
                Mes documents
              </CardTitle>
              <CardDescription>
                Gérez vos CV, lettres de motivation et autres documents
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                <h3 className="text-lg font-semibold mb-2">Aucun document</h3>
                <p className="text-muted-foreground mb-4">
                  Uploadez vos documents pour les utiliser dans vos candidatures
                </p>
                <Button>
                  <Upload className="mr-2 h-4 w-4" />
                  Ajouter un document
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};