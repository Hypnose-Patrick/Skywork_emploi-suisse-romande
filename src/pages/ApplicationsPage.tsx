import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  MoreHorizontal,
  Calendar,
  MapPin,
  Building,
  Euro,
  Clock,
  FileText,
  MessageSquare,
  Edit,
  Trash2,
  ExternalLink,
  Plus,
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Application, JobOffer } from '@/types/database';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';

interface KanbanColumn {
  id: string;
  title: string;
  status: string;
  color: string;
  applications: Application[];
}

const initialColumns: Omit<KanbanColumn, 'applications'>[] = [
  {
    id: 'draft',
    title: 'Brouillons',
    status: 'draft',
    color: 'bg-gray-100 border-gray-300',
  },
  {
    id: 'applied',
    title: 'Envoyées',
    status: 'applied',
    color: 'bg-blue-100 border-blue-300',
  },
  {
    id: 'interview_scheduled',
    title: 'Entretien prévu',
    status: 'interview_scheduled',
    color: 'bg-purple-100 border-purple-300',
  },
  {
    id: 'interview_done',
    title: 'Entretien passé',
    status: 'interview_done',
    color: 'bg-orange-100 border-orange-300',
  },
  {
    id: 'accepted',
    title: 'Acceptées',
    status: 'accepted',
    color: 'bg-green-100 border-green-300',
  },
  {
    id: 'rejected',
    title: 'Refusées',
    status: 'rejected',
    color: 'bg-red-100 border-red-300',
  },
];

export const ApplicationsPage: React.FC = () => {
  const { user } = useAuth();
  const [columns, setColumns] = useState<KanbanColumn[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);
  const [editingNotes, setEditingNotes] = useState('');
  const [interviewDate, setInterviewDate] = useState('');

  useEffect(() => {
    if (user) {
      fetchApplications();
    }
  }, [user]);

  const fetchApplications = async () => {
    try {
      const { data, error } = await supabase
        .from('applications_2025_10_03_16_01')
        .select(`
          *,
          job_offer:job_offers_2025_10_03_16_01(*)
        `)
        .eq('user_id', user!.id)
        .order('kanban_position', { ascending: true });

      if (error) throw error;

      // Organiser les candidatures par colonne
      const columnsWithData = initialColumns.map(col => ({
        ...col,
        applications: (data || []).filter(app => app.status === col.status),
      }));

      setColumns(columnsWithData);
    } catch (error) {
      console.error('Erreur lors du chargement des candidatures:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger vos candidatures",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDragEnd = async (result: DropResult) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    const sourceColumn = columns.find(col => col.id === source.droppableId);
    const destColumn = columns.find(col => col.id === destination.droppableId);

    if (!sourceColumn || !destColumn) return;

    const application = sourceColumn.applications.find(app => app.id === draggableId);
    if (!application) return;

    try {
      // Mettre à jour le statut dans la base de données
      const { error } = await supabase
        .from('applications_2025_10_03_16_01')
        .update({
          status: destColumn.status,
          kanban_position: destination.index,
          updated_at: new Date().toISOString(),
        })
        .eq('id', draggableId);

      if (error) throw error;

      // Mettre à jour l'état local
      const newColumns = columns.map(col => {
        if (col.id === source.droppableId) {
          return {
            ...col,
            applications: col.applications.filter(app => app.id !== draggableId),
          };
        }
        if (col.id === destination.droppableId) {
          const newApplications = [...col.applications];
          newApplications.splice(destination.index, 0, {
            ...application,
            status: destColumn.status as any,
          });
          return {
            ...col,
            applications: newApplications,
          };
        }
        return col;
      });

      setColumns(newColumns);

      toast({
        title: "Candidature mise à jour",
        description: `Statut changé vers "${destColumn.title}"`,
      });
    } catch (error) {
      console.error('Erreur lors de la mise à jour:', error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour la candidature",
        variant: "destructive",
      });
    }
  };

  const updateApplicationNotes = async () => {
    if (!selectedApplication) return;

    try {
      const { error } = await supabase
        .from('applications_2025_10_03_16_01')
        .update({
          interview_notes: editingNotes,
          interview_date: interviewDate || null,
          updated_at: new Date().toISOString(),
        })
        .eq('id', selectedApplication.id);

      if (error) throw error;

      toast({
        title: "Notes mises à jour",
        description: "Vos notes ont été sauvegardées",
      });

      fetchApplications();
      setSelectedApplication(null);
    } catch (error) {
      console.error('Erreur lors de la mise à jour des notes:', error);
      toast({
        title: "Erreur",
        description: "Impossible de sauvegarder les notes",
        variant: "destructive",
      });
    }
  };

  const deleteApplication = async (applicationId: string) => {
    try {
      const { error } = await supabase
        .from('applications_2025_10_03_16_01')
        .delete()
        .eq('id', applicationId);

      if (error) throw error;

      toast({
        title: "Candidature supprimée",
        description: "La candidature a été supprimée avec succès",
      });

      fetchApplications();
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer la candidature",
        variant: "destructive",
      });
    }
  };

  const formatSalary = (min?: number, max?: number) => {
    if (!min && !max) return 'Non spécifié';
    if (min && max) return `${min.toLocaleString()} - ${max.toLocaleString()} CHF`;
    if (min) return `Dès ${min.toLocaleString()} CHF`;
    if (max) return `Jusqu'à ${max.toLocaleString()} CHF`;
    return '';
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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Mes candidatures</h1>
          <p className="text-muted-foreground mt-2">
            Suivez l'évolution de vos candidatures avec notre tableau Kanban
          </p>
        </div>
        <div className="flex items-center space-x-2 mt-4 lg:mt-0">
          <Button variant="outline">
            <FileText className="mr-2 h-4 w-4" />
            Exporter PDF
          </Button>
          <Button className="gradient-primary text-white">
            <Plus className="mr-2 h-4 w-4" />
            Nouvelle candidature
          </Button>
        </div>
      </div>

      {/* Statistiques rapides */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
        {columns.map((column) => (
          <Card key={column.id} className="text-center">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-foreground">
                {column.applications.length}
              </div>
              <div className="text-sm text-muted-foreground">
                {column.title}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Tableau Kanban */}
      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 min-h-[600px]">
          {columns.map((column) => (
            <div key={column.id} className="flex flex-col">
              <div className={`kanban-column ${column.color}`}>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-sm">
                    {column.title}
                  </h3>
                  <Badge variant="secondary" className="text-xs">
                    {column.applications.length}
                  </Badge>
                </div>

                <Droppable droppableId={column.id}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className={`flex-1 space-y-3 ${
                        snapshot.isDraggingOver ? 'bg-muted/50 rounded-lg' : ''
                      }`}
                    >
                      {column.applications.map((application, index) => (
                        <Draggable
                          key={application.id}
                          draggableId={application.id}
                          index={index}
                        >
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className={`kanban-card ${
                                snapshot.isDragging ? 'rotate-3 shadow-xl' : ''
                              }`}
                            >
                              <div className="flex items-start justify-between mb-3">
                                <div className="flex-1">
                                  <h4 className="font-medium text-sm line-clamp-2">
                                    {application.job_offer?.title || 'Titre non disponible'}
                                  </h4>
                                  <div className="flex items-center text-xs text-muted-foreground mt-1">
                                    <Building className="h-3 w-3 mr-1" />
                                    <span className="truncate">
                                      {application.job_offer?.company_name || 'Entreprise non disponible'}
                                    </span>
                                  </div>
                                </div>
                                <Dialog>
                                  <DialogTrigger asChild>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="h-6 w-6 p-0"
                                      onClick={() => {
                                        setSelectedApplication(application);
                                        setEditingNotes(application.interview_notes || '');
                                        setInterviewDate(application.interview_date || '');
                                      }}
                                    >
                                      <MoreHorizontal className="h-3 w-3" />
                                    </Button>
                                  </DialogTrigger>
                                  <DialogContent className="max-w-2xl">
                                    <DialogHeader>
                                      <DialogTitle>
                                        {application.job_offer?.title}
                                      </DialogTitle>
                                      <DialogDescription>
                                        {application.job_offer?.company_name}
                                      </DialogDescription>
                                    </DialogHeader>
                                    <div className="space-y-4">
                                      <div className="grid grid-cols-2 gap-4 text-sm">
                                        <div className="flex items-center">
                                          <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                                          <span>{application.job_offer?.location || 'Non spécifié'}</span>
                                        </div>
                                        <div className="flex items-center">
                                          <Euro className="h-4 w-4 mr-2 text-muted-foreground" />
                                          <span>
                                            {formatSalary(
                                              application.job_offer?.salary_min,
                                              application.job_offer?.salary_max
                                            )}
                                          </span>
                                        </div>
                                        <div className="flex items-center">
                                          <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                                          <span>
                                            Postulé le {new Date(application.created_at).toLocaleDateString('fr-CH')}
                                          </span>
                                        </div>
                                        <div className="flex items-center">
                                          <Badge className={`${getStatusColor(application.status)} text-white text-xs`}>
                                            {column.title}
                                          </Badge>
                                        </div>
                                      </div>

                                      {application.job_offer?.description && (
                                        <div>
                                          <Label className="text-sm font-medium">Description du poste</Label>
                                          <p className="text-sm text-muted-foreground mt-1 max-h-32 overflow-y-auto">
                                            {application.job_offer.description}
                                          </p>
                                        </div>
                                      )}

                                      <div className="space-y-3">
                                        <div>
                                          <Label htmlFor="interview-date">Date d'entretien</Label>
                                          <Input
                                            id="interview-date"
                                            type="datetime-local"
                                            value={interviewDate}
                                            onChange={(e) => setInterviewDate(e.target.value)}
                                          />
                                        </div>

                                        <div>
                                          <Label htmlFor="notes">Notes et commentaires</Label>
                                          <Textarea
                                            id="notes"
                                            placeholder="Ajoutez vos notes sur cette candidature..."
                                            value={editingNotes}
                                            onChange={(e) => setEditingNotes(e.target.value)}
                                            rows={4}
                                          />
                                        </div>
                                      </div>

                                      <div className="flex justify-between">
                                        <div className="space-x-2">
                                          {application.job_offer?.source_url && (
                                            <Button variant="outline" size="sm" asChild>
                                              <a
                                                href={application.job_offer.source_url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                              >
                                                <ExternalLink className="mr-2 h-4 w-4" />
                                                Voir l'annonce
                                              </a>
                                            </Button>
                                          )}
                                        </div>
                                        <div className="space-x-2">
                                          <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => deleteApplication(application.id)}
                                          >
                                            <Trash2 className="mr-2 h-4 w-4" />
                                            Supprimer
                                          </Button>
                                          <Button size="sm" onClick={updateApplicationNotes}>
                                            <Edit className="mr-2 h-4 w-4" />
                                            Sauvegarder
                                          </Button>
                                        </div>
                                      </div>
                                    </div>
                                  </DialogContent>
                                </Dialog>
                              </div>

                              <div className="space-y-2 text-xs text-muted-foreground">
                                {application.job_offer?.location && (
                                  <div className="flex items-center">
                                    <MapPin className="h-3 w-3 mr-1" />
                                    <span className="truncate">{application.job_offer.location}</span>
                                  </div>
                                )}
                                
                                <div className="flex items-center">
                                  <Calendar className="h-3 w-3 mr-1" />
                                  <span>
                                    {new Date(application.created_at).toLocaleDateString('fr-CH')}
                                  </span>
                                </div>

                                {application.interview_date && (
                                  <div className="flex items-center text-purple-600">
                                    <Clock className="h-3 w-3 mr-1" />
                                    <span>
                                      Entretien: {new Date(application.interview_date).toLocaleDateString('fr-CH')}
                                    </span>
                                  </div>
                                )}
                              </div>

                              {application.auto_generated && (
                                <Badge variant="secondary" className="text-xs mt-2">
                                  Auto-générée
                                </Badge>
                              )}
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </div>
            </div>
          ))}
        </div>
      </DragDropContext>

      {columns.every(col => col.applications.length === 0) && (
        <Card>
          <CardContent className="text-center py-12">
            <Briefcase className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
            <h3 className="text-lg font-semibold mb-2">Aucune candidature</h3>
            <p className="text-muted-foreground mb-4">
              Commencez par rechercher des offres d'emploi et postulez pour voir vos candidatures ici
            </p>
            <Button className="gradient-primary text-white">
              <Plus className="mr-2 h-4 w-4" />
              Rechercher des emplois
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};