import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import {
  Brain,
  CheckCircle,
  ArrowRight,
  ArrowLeft,
  RotateCcw,
  Download,
  Target,
  Lightbulb,
  Users,
  Briefcase,
  Wrench,
  Calculator,
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { RiasecTest, RiasecResult, RiasecAnswer } from '@/types/database';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';

const riasecCategories = {
  R: {
    name: 'Réaliste',
    description: 'Aime travailler avec ses mains, utiliser des outils et machines',
    icon: Wrench,
    color: 'bg-blue-500',
    careers: ['Ingénieur', 'Technicien', 'Mécanicien', 'Électricien', 'Architecte']
  },
  I: {
    name: 'Investigateur',
    description: 'Aime observer, apprendre, analyser et résoudre des problèmes',
    icon: Brain,
    color: 'bg-purple-500',
    careers: ['Chercheur', 'Médecin', 'Analyste', 'Scientifique', 'Programmeur']
  },
  A: {
    name: 'Artistique',
    description: 'Aime créer, innover et s\'exprimer de manière créative',
    icon: Lightbulb,
    color: 'bg-pink-500',
    careers: ['Designer', 'Artiste', 'Musicien', 'Écrivain', 'Photographe']
  },
  S: {
    name: 'Social',
    description: 'Aime aider, enseigner et travailler avec les autres',
    icon: Users,
    color: 'bg-green-500',
    careers: ['Enseignant', 'Psychologue', 'Infirmier', 'Travailleur social', 'Coach']
  },
  E: {
    name: 'Entreprenant',
    description: 'Aime diriger, persuader et prendre des décisions',
    icon: Target,
    color: 'bg-orange-500',
    careers: ['Manager', 'Vendeur', 'Entrepreneur', 'Avocat', 'Consultant']
  },
  C: {
    name: 'Conventionnel',
    description: 'Aime organiser, classer et travailler avec des données',
    icon: Calculator,
    color: 'bg-indigo-500',
    careers: ['Comptable', 'Secrétaire', 'Banquier', 'Administrateur', 'Contrôleur']
  }
};

export const RiasecTestPage: React.FC = () => {
  const { user } = useAuth();
  const [questions, setQuestions] = useState<RiasecTest[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [testStarted, setTestStarted] = useState(false);
  const [testCompleted, setTestCompleted] = useState(false);
  const [results, setResults] = useState<RiasecResult | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchQuestions();
    checkExistingResults();
  }, [user]);

  const fetchQuestions = async () => {
    try {
      const { data, error } = await supabase
        .from('riasec_tests_2025_10_03_16_01')
        .select('*')
        .order('question_number');

      if (error) throw error;
      setQuestions(data || []);
    } catch (error) {
      console.error('Erreur lors du chargement des questions:', error);
    }
  };

  const checkExistingResults = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('riasec_results_2025_10_03_16_01')
        .select('*')
        .eq('user_id', user.id)
        .order('completed_at', { ascending: false })
        .limit(1);

      if (error) throw error;
      if (data && data.length > 0) {
        setResults(data[0]);
        setTestCompleted(true);
      }
    } catch (error) {
      console.error('Erreur lors de la vérification des résultats:', error);
    }
  };

  const handleAnswerChange = (questionId: string, score: number) => {
    setAnswers(prev => ({ ...prev, [questionId]: score }));
  };

  const nextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const previousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const calculateResults = () => {
    const scores = {
      R: 0, I: 0, A: 0, S: 0, E: 0, C: 0
    };

    questions.forEach(question => {
      const answer = answers[question.id];
      if (answer) {
        scores[question.category as keyof typeof scores] += answer;
      }
    });

    return scores;
  };

  const submitTest = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const scores = calculateResults();
      
      // Trouver le type dominant
      const dominantType = Object.entries(scores).reduce((a, b) => 
        scores[a[0] as keyof typeof scores] > scores[b[0] as keyof typeof scores] ? a : b
      )[0] as keyof typeof scores;

      // Recommander des secteurs basés sur le type dominant
      const recommendedSectors: string[] = []; // À implémenter avec les secteurs de la DB

      const resultData = {
        user_id: user.id,
        realistic_score: scores.R,
        investigative_score: scores.I,
        artistic_score: scores.A,
        social_score: scores.S,
        enterprising_score: scores.E,
        conventional_score: scores.C,
        dominant_type: dominantType,
        recommended_sectors: recommendedSectors,
        completed_at: new Date().toISOString(),
      };

      const { data, error } = await supabase
        .from('riasec_results_2025_10_03_16_01')
        .insert([resultData])
        .select()
        .single();

      if (error) throw error;

      setResults(data);
      setTestCompleted(true);

      toast({
        title: "Test terminé !",
        description: "Vos résultats RIASEC ont été calculés avec succès",
      });
    } catch (error) {
      console.error('Erreur lors de la soumission:', error);
      toast({
        title: "Erreur",
        description: "Impossible de sauvegarder vos résultats",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const restartTest = () => {
    setTestStarted(false);
    setTestCompleted(false);
    setCurrentQuestionIndex(0);
    setAnswers({});
    setResults(null);
  };

  const progress = questions.length > 0 ? ((currentQuestionIndex + 1) / questions.length) * 100 : 0;
  const currentQuestion = questions[currentQuestionIndex];
  const isAnswered = currentQuestion && answers[currentQuestion.id];
  const allQuestionsAnswered = questions.every(q => answers[q.id]);

  if (testCompleted && results) {
    const maxScore = Math.max(
      results.realistic_score,
      results.investigative_score,
      results.artistic_score,
      results.social_score,
      results.enterprising_score,
      results.conventional_score
    );

    return (
      <div className="space-y-6">
        <div className="text-center">
          <div className="w-16 h-16 gradient-primary rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold mb-2">Vos résultats RIASEC</h1>
          <p className="text-muted-foreground">
            Découvrez votre profil professionnel et les carrières qui vous correspondent
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Profil dominant */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Target className="mr-2 h-5 w-5" />
                Votre profil dominant
              </CardTitle>
            </CardHeader>
            <CardContent>
              {results.dominant_type && (
                <div className="text-center">
                  <div className={`w-20 h-20 ${riasecCategories[results.dominant_type].color} rounded-full flex items-center justify-center mx-auto mb-4`}>
                    {React.createElement(riasecCategories[results.dominant_type].icon, {
                      className: "h-10 w-10 text-white"
                    })}
                  </div>
                  <h3 className="text-2xl font-bold mb-2">
                    {riasecCategories[results.dominant_type].name}
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    {riasecCategories[results.dominant_type].description}
                  </p>
                  <div className="space-y-2">
                    <h4 className="font-semibold">Carrières suggérées :</h4>
                    <div className="flex flex-wrap gap-2 justify-center">
                      {riasecCategories[results.dominant_type].careers.map((career, index) => (
                        <Badge key={index} variant="secondary">
                          {career}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Graphique des scores */}
          <Card>
            <CardHeader>
              <CardTitle>Répartition de vos scores</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {Object.entries(riasecCategories).map(([key, category]) => {
                const score = results[`${key.toLowerCase() === 'r' ? 'realistic' : 
                  key.toLowerCase() === 'i' ? 'investigative' :
                  key.toLowerCase() === 'a' ? 'artistic' :
                  key.toLowerCase() === 's' ? 'social' :
                  key.toLowerCase() === 'e' ? 'enterprising' : 'conventional'}_score` as keyof RiasecResult] as number;
                
                const percentage = maxScore > 0 ? (score / maxScore) * 100 : 0;
                
                return (
                  <div key={key} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className={`w-4 h-4 ${category.color} rounded`}></div>
                        <span className="font-medium">{category.name}</span>
                      </div>
                      <span className="text-sm text-muted-foreground">{score}/25</span>
                    </div>
                    <Progress value={percentage} className="h-2" />
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </div>

        {/* Actions */}
        <div className="flex justify-center space-x-4">
          <Button variant="outline" onClick={restartTest}>
            <RotateCcw className="mr-2 h-4 w-4" />
            Refaire le test
          </Button>
          <Button>
            <Download className="mr-2 h-4 w-4" />
            Télécharger le rapport
          </Button>
        </div>
      </div>
    );
  }

  if (!testStarted) {
    return (
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center">
          <div className="w-16 h-16 gradient-primary rounded-full flex items-center justify-center mx-auto mb-4">
            <Brain className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold mb-2">Test RIASEC</h1>
          <p className="text-muted-foreground text-lg">
            Découvrez vos intérêts professionnels avec le test de Holland
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>À propos du test RIASEC</CardTitle>
            <CardDescription>
              Le test RIASEC (Holland Code) évalue vos intérêts professionnels selon 6 dimensions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
              {Object.entries(riasecCategories).map(([key, category]) => (
                <div key={key} className="flex items-start space-x-3 p-4 border rounded-lg">
                  <div className={`w-10 h-10 ${category.color} rounded-lg flex items-center justify-center flex-shrink-0`}>
                    {React.createElement(category.icon, {
                      className: "h-5 w-5 text-white"
                    })}
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm">{category.name}</h3>
                    <p className="text-xs text-muted-foreground">{category.description}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-muted/50 p-4 rounded-lg mb-6">
              <h4 className="font-semibold mb-2">Instructions :</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Le test contient {questions.length} questions</li>
                <li>• Répondez instinctivement, sans trop réfléchir</li>
                <li>• Évaluez chaque affirmation de 1 (pas du tout d'accord) à 5 (tout à fait d'accord)</li>
                <li>• Il n'y a pas de bonnes ou mauvaises réponses</li>
                <li>• Le test prend environ 10-15 minutes</li>
              </ul>
            </div>

            <div className="text-center">
              <Button 
                onClick={() => setTestStarted(true)}
                className="gradient-primary text-white"
                size="lg"
              >
                Commencer le test
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Progress */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span>Question {currentQuestionIndex + 1} sur {questions.length}</span>
          <span>{Math.round(progress)}% terminé</span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      {/* Question */}
      {currentQuestion && (
        <Card className="test-question">
          <CardContent className="p-8">
            <div className="text-center mb-6">
              <Badge className={`${riasecCategories[currentQuestion.category as keyof typeof riasecCategories].color} text-white mb-4`}>
                {riasecCategories[currentQuestion.category as keyof typeof riasecCategories].name}
              </Badge>
              <h2 className="text-xl font-semibold mb-2">
                {currentQuestion.question_text}
              </h2>
            </div>

            <RadioGroup
              value={answers[currentQuestion.id]?.toString() || ''}
              onValueChange={(value) => handleAnswerChange(currentQuestion.id, parseInt(value))}
              className="space-y-3"
            >
              {[1, 2, 3, 4, 5].map((score) => (
                <div key={score} className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                  <RadioGroupItem value={score.toString()} id={`score-${score}`} />
                  <Label htmlFor={`score-${score}`} className="flex-1 cursor-pointer">
                    <div className="flex items-center justify-between">
                      <span>
                        {score === 1 && 'Pas du tout d\'accord'}
                        {score === 2 && 'Plutôt pas d\'accord'}
                        {score === 3 && 'Neutre'}
                        {score === 4 && 'Plutôt d\'accord'}
                        {score === 5 && 'Tout à fait d\'accord'}
                      </span>
                      <span className="text-2xl font-bold text-muted-foreground">{score}</span>
                    </div>
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </CardContent>
        </Card>
      )}

      {/* Navigation */}
      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={previousQuestion}
          disabled={currentQuestionIndex === 0}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Précédent
        </Button>

        {currentQuestionIndex === questions.length - 1 ? (
          <Button
            onClick={submitTest}
            disabled={!allQuestionsAnswered || loading}
            className="gradient-primary text-white"
          >
            {loading ? 'Calcul...' : 'Terminer le test'}
            <CheckCircle className="ml-2 h-4 w-4" />
          </Button>
        ) : (
          <Button
            onClick={nextQuestion}
            disabled={!isAnswered}
            className="gradient-primary text-white"
          >
            Suivant
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
};