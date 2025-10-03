import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  Calendar,
  MessageSquare,
  Play,
  Pause,
  Volume2,
  VolumeX,
  BookOpen,
  Video,
  FileText,
  Clock,
  Users,
  Lightbulb,
  Mic,
  MicOff,
  Send,
  Bot,
  User,
  Download,
  Star,
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { InterviewResource } from '@/types/database';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const commonQuestions = [
  {
    category: 'Présentation',
    questions: [
      'Parlez-moi de vous',
      'Quelles sont vos principales qualités ?',
      'Quels sont vos défauts ?',
      'Pourquoi voulez-vous ce poste ?',
      'Pourquoi voulez-vous travailler dans notre entreprise ?'
    ]
  },
  {
    category: 'Expérience',
    questions: [
      'Décrivez votre expérience professionnelle',
      'Quel a été votre plus grand défi professionnel ?',
      'Parlez-moi d\'un projet dont vous êtes fier',
      'Comment gérez-vous le stress ?',
      'Décrivez une situation de conflit que vous avez résolue'
    ]
  },
  {
    category: 'Motivation',
    questions: [
      'Où vous voyez-vous dans 5 ans ?',
      'Qu\'est-ce qui vous motive au travail ?',
      'Pourquoi quittez-vous votre emploi actuel ?',
      'Quelles sont vos attentes salariales ?',
      'Avez-vous des questions sur le poste ?'
    ]
  }
];

const interviewTips = [
  {
    title: 'Avant l\'entretien',
    tips: [
      'Recherchez l\'entreprise et le poste',
      'Préparez vos réponses aux questions courantes',
      'Préparez vos propres questions',
      'Choisissez une tenue appropriée',
      'Arrivez 10-15 minutes en avance'
    ]
  },
  {
    title: 'Pendant l\'entretien',
    tips: [
      'Maintenez un contact visuel',
      'Écoutez attentivement les questions',
      'Donnez des exemples concrets',
      'Montrez votre enthousiasme',
      'Posez des questions pertinentes'
    ]
  },
  {
    title: 'Après l\'entretien',
    tips: [
      'Envoyez un email de remerciement',
      'Faites le bilan de l\'entretien',
      'Notez les points à améliorer',
      'Suivez l\'évolution de votre candidature',
      'Préparez-vous pour d\'éventuels entretiens suivants'
    ]
  }
];

export const InterviewPreparationPage: React.FC = () => {
  const { user } = useAuth();
  const [resources, setResources] = useState<InterviewResource[]>([]);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchResources();
    initializeChat();
  }, []);

  const fetchResources = async () => {
    try {
      const { data, error } = await supabase
        .from('interview_resources_2025_10_03_16_01')
        .select('*')
        .eq('is_public', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setResources(data || []);
    } catch (error) {
      console.error('Erreur lors du chargement des ressources:', error);
    }
  };

  const initializeChat = () => {
    const welcomeMessage: ChatMessage = {
      id: '1',
      role: 'assistant',
      content: 'Bonjour ! Je suis votre assistant IA pour la préparation aux entretiens. Je peux vous aider à pratiquer vos réponses, vous donner des conseils personnalisés et simuler un entretien. Comment puis-je vous aider aujourd\'hui ?',
      timestamp: new Date()
    };
    setChatMessages([welcomeMessage]);
  };

  const sendMessage = async () => {
    if (!currentMessage.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: currentMessage,
      timestamp: new Date()
    };

    setChatMessages(prev => [...prev, userMessage]);
    setCurrentMessage('');
    setLoading(true);

    // Simuler une réponse de l'IA (à remplacer par un vrai appel API)
    setTimeout(() => {
      const aiResponse: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: generateAIResponse(currentMessage),
        timestamp: new Date()
      };
      setChatMessages(prev => [...prev, aiResponse]);
      setLoading(false);
    }, 1500);
  };

  const generateAIResponse = (userInput: string): string => {
    const input = userInput.toLowerCase();
    
    if (input.includes('présent') || input.includes('parlez-moi de vous')) {
      return 'Excellente question ! Pour bien vous présenter, structurez votre réponse en 3 parties : votre parcours professionnel, vos compétences clés, et pourquoi vous êtes intéressé par ce poste. Gardez votre présentation entre 2-3 minutes. Voulez-vous que nous pratiquions ensemble ?';
    }
    
    if (input.includes('stress') || input.includes('pression')) {
      return 'La gestion du stress est cruciale. Parlez d\'une situation concrète où vous avez géré la pression, expliquez votre méthode (priorisation, organisation, communication) et le résultat obtenu. Montrez que vous restez efficace sous pression.';
    }
    
    if (input.includes('défaut') || input.includes('faiblesse')) {
      return 'Pour parler de vos défauts, choisissez un point d\'amélioration réel mais pas rédhibitoire pour le poste. Expliquez surtout les actions que vous prenez pour vous améliorer. Par exemple : "Je peux parfois être perfectionniste, mais j\'ai appris à fixer des priorités et des délais réalistes."';
    }
    
    if (input.includes('salaire') || input.includes('rémunération')) {
      return 'Pour négocier votre salaire, renseignez-vous d\'abord sur les standards du marché suisse pour votre poste et région. Donnez une fourchette plutôt qu\'un chiffre fixe, et mettez en avant votre valeur ajoutée. En Suisse romande, n\'oubliez pas de considérer les avantages (13ème salaire, assurances, etc.).';
    }
    
    return 'C\'est une excellente question ! Pour bien y répondre, je vous conseille de structurer votre réponse avec des exemples concrets de votre expérience. Utilisez la méthode STAR (Situation, Tâche, Action, Résultat) pour être plus convaincant. Voulez-vous que nous pratiquions cette réponse ensemble ?';
  };

  const practiceQuestion = (question: string) => {
    setSelectedQuestion(question);
    const practiceMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'assistant',
      content: `Parfait ! Entraînons-nous avec cette question : "${question}". Prenez votre temps pour réfléchir et donnez-moi votre réponse. Je vous donnerai ensuite des conseils pour l'améliorer.`,
      timestamp: new Date()
    };
    setChatMessages(prev => [...prev, practiceMessage]);
  };

  const toggleRecording = () => {
    setIsRecording(!isRecording);
    if (!isRecording) {
      toast({
        title: "Enregistrement démarré",
        description: "Parlez maintenant, votre réponse sera transcrite",
      });
    } else {
      toast({
        title: "Enregistrement arrêté",
        description: "Transcription en cours...",
      });
    }
  };

  const toggleSpeech = () => {
    setIsSpeaking(!isSpeaking);
    if (!isSpeaking) {
      // Simuler la synthèse vocale
      toast({
        title: "Lecture audio activée",
        description: "Les réponses de l'assistant seront lues à voix haute",
      });
    }
  };

  const getResourceIcon = (type: string) => {
    switch (type) {
      case 'video': return Video;
      case 'audio': return Volume2;
      case 'document': return FileText;
      default: return BookOpen;
    }
  };

  const formatDuration = (seconds?: number) => {
    if (!seconds) return '';
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-2">Préparation aux entretiens</h1>
        <p className="text-muted-foreground">
          Entraînez-vous avec notre assistant IA et accédez à nos ressources exclusives
        </p>
      </div>

      <Tabs defaultValue="assistant" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="assistant">Assistant IA</TabsTrigger>
          <TabsTrigger value="questions">Questions courantes</TabsTrigger>
          <TabsTrigger value="resources">Ressources</TabsTrigger>
          <TabsTrigger value="tips">Conseils</TabsTrigger>
        </TabsList>

        {/* Assistant IA */}
        <TabsContent value="assistant" className="space-y-6">
          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span className="flex items-center">
                      <Bot className="mr-2 h-5 w-5" />
                      Assistant IA
                    </span>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={toggleSpeech}
                        className={isSpeaking ? 'bg-primary text-primary-foreground' : ''}
                      >
                        {isSpeaking ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={toggleRecording}
                        className={isRecording ? 'bg-red-500 text-white animate-pulse' : ''}
                      >
                        {isRecording ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                      </Button>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-96 mb-4 p-4 border rounded-lg">
                    <div className="space-y-4">
                      {chatMessages.map((message) => (
                        <div
                          key={message.id}
                          className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                          <div className={`flex items-start space-x-2 max-w-[80%] ${message.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                            <Avatar className="w-8 h-8">
                              <AvatarFallback className={message.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted'}>
                                {message.role === 'user' ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                              </AvatarFallback>
                            </Avatar>
                            <div className={`p-3 rounded-lg ${message.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                              <p className="text-sm">{message.content}</p>
                              <p className="text-xs opacity-70 mt-1">
                                {message.timestamp.toLocaleTimeString('fr-CH', { hour: '2-digit', minute: '2-digit' })}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                      {loading && (
                        <div className="flex justify-start">
                          <div className="flex items-center space-x-2">
                            <Avatar className="w-8 h-8">
                              <AvatarFallback className="bg-muted">
                                <Bot className="h-4 w-4" />
                              </AvatarFallback>
                            </Avatar>
                            <div className="bg-muted p-3 rounded-lg">
                              <div className="flex space-x-1">
                                <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"></div>
                                <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                                <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </ScrollArea>
                  
                  <div className="flex space-x-2">
                    <Input
                      placeholder="Posez votre question ou décrivez votre situation..."
                      value={currentMessage}
                      onChange={(e) => setCurrentMessage(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                      disabled={loading}
                    />
                    <Button onClick={sendMessage} disabled={loading || !currentMessage.trim()}>
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Suggestions rapides</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {[
                    'Comment me présenter ?',
                    'Gérer le stress en entretien',
                    'Parler de mes défauts',
                    'Négocier mon salaire',
                    'Questions à poser au recruteur'
                  ].map((suggestion, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      className="w-full justify-start text-left h-auto p-3"
                      onClick={() => setCurrentMessage(suggestion)}
                    >
                      <MessageSquare className="mr-2 h-4 w-4 flex-shrink-0" />
                      <span className="text-sm">{suggestion}</span>
                    </Button>
                  ))}
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* Questions courantes */}
        <TabsContent value="questions" className="space-y-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {commonQuestions.map((category, categoryIndex) => (
              <Card key={categoryIndex}>
                <CardHeader>
                  <CardTitle className="text-lg">{category.category}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {category.questions.map((question, questionIndex) => (
                    <div key={questionIndex} className="p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                      <p className="text-sm mb-2">{question}</p>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => practiceQuestion(question)}
                        className="w-full"
                      >
                        <Play className="mr-2 h-3 w-3" />
                        Pratiquer
                      </Button>
                    </div>
                  ))}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Ressources */}
        <TabsContent value="resources" className="space-y-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {resources.map((resource) => {
              const IconComponent = getResourceIcon(resource.resource_type);
              return (
                <Card key={resource.id} className="job-card">
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-3 mb-4">
                      <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                        <IconComponent className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-sm mb-1">{resource.title}</h3>
                        <p className="text-xs text-muted-foreground line-clamp-2">
                          {resource.description}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mb-4">
                      <Badge variant="secondary" className="text-xs">
                        {resource.category}
                      </Badge>
                      {resource.duration && (
                        <div className="flex items-center text-xs text-muted-foreground">
                          <Clock className="h-3 w-3 mr-1" />
                          {formatDuration(resource.duration)}
                        </div>
                      )}
                    </div>

                    <div className="flex flex-wrap gap-1 mb-4">
                      {resource.tags.slice(0, 3).map((tag, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>

                    <div className="flex space-x-2">
                      <Button size="sm" className="flex-1">
                        <Play className="mr-2 h-3 w-3" />
                        Consulter
                      </Button>
                      <Button size="sm" variant="outline">
                        <Download className="h-3 w-3" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {resources.length === 0 && (
            <Card>
              <CardContent className="text-center py-12">
                <BookOpen className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                <h3 className="text-lg font-semibold mb-2">Aucune ressource disponible</h3>
                <p className="text-muted-foreground">
                  Les ressources de préparation aux entretiens seront bientôt disponibles
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Conseils */}
        <TabsContent value="tips" className="space-y-6">
          <div className="grid md:grid-cols-3 gap-6">
            {interviewTips.map((section, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="flex items-center text-lg">
                    <Lightbulb className="mr-2 h-5 w-5" />
                    {section.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {section.tips.map((tip, tipIndex) => (
                      <li key={tipIndex} className="flex items-start space-x-2">
                        <Star className="h-4 w-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                        <span className="text-sm">{tip}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Conseils spécifiques à la Suisse */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="mr-2 h-5 w-5" />
                Spécificités des entretiens en Suisse Romande
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-3">Culture d'entreprise</h4>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>• Ponctualité absolue (arrivez 10 minutes en avance)</li>
                    <li>• Poignée de main ferme et contact visuel</li>
                    <li>• Vouvoiement jusqu'à invitation au tutoiement</li>
                    <li>• Discrétion et professionnalisme</li>
                    <li>• Respect de la hiérarchie</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-3">Aspects pratiques</h4>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>• Salaires souvent négociables (13ème mois standard)</li>
                    <li>• Importance des langues (français, allemand, anglais)</li>
                    <li>• Permis de travail si non-Suisse</li>
                    <li>• Références professionnelles importantes</li>
                    <li>• Période d'essai standard (1-3 mois)</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};