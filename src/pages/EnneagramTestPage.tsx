import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import {
  Users,
  CheckCircle,
  ArrowRight,
  ArrowLeft,
  RotateCcw,
  Download,
  Heart,
  Shield,
  Trophy,
  Palette,
  Search,
  Anchor,
  Zap,
  Mountain,
  Flower,
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { EnneagramTest, EnneagramResult } from '@/types/database';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';

const enneagramTypes = {
  1: {
    name: 'Le Perfectionniste',
    description: 'Rationnel, idéaliste, ayant des principes, déterminé, maîtrisé et perfectionniste',
    icon: Shield,
    color: 'bg-red-500',
    motivation: 'Être bon, juste, parfait et améliorer tout',
    fear: 'Être corrompu, défectueux ou mauvais',
    careers: ['Juge', 'Éditeur', 'Critique', 'Réformateur', 'Organisateur']
  },
  2: {
    name: 'L\'Altruiste',
    description: 'Attentionné, interpersonnel, démonstratif, généreux, possessif et manipulateur',
    icon: Heart,
    color: 'bg-pink-500',
    motivation: 'Se sentir aimé et nécessaire',
    fear: 'Être indigne d\'amour',
    careers: ['Conseiller', 'Infirmier', 'Travailleur social', 'Enseignant', 'Thérapeute']
  },
  3: {
    name: 'Le Battant',
    description: 'Adaptable, ambitieux, énergique, orienté image, pragmatique et vaniteux',
    icon: Trophy,
    color: 'bg-yellow-500',
    motivation: 'Se sentir valorisé et digne d\'estime',
    fear: 'Être sans valeur en dehors de ses réalisations',
    careers: ['Manager', 'Vendeur', 'Entrepreneur', 'Politicien', 'Athlète']
  },
  4: {
    name: 'L\'Artiste',
    description: 'Expressif, dramatique, égocentrique, tempéramental, créatif et morose',
    icon: Palette,
    color: 'bg-purple-500',
    motivation: 'Trouver son identité et sa signification',
    fear: 'N\'avoir aucune identité ou signification personnelle',
    careers: ['Artiste', 'Designer', 'Écrivain', 'Musicien', 'Acteur']
  },
  5: {
    name: 'L\'Investigateur',
    description: 'Intense, cérébral, perceptif, innovant, secret et isolé',
    icon: Search,
    color: 'bg-blue-500',
    motivation: 'Être capable et compétent',
    fear: 'Être inutile, incapable ou envahi',
    careers: ['Chercheur', 'Analyste', 'Ingénieur', 'Programmeur', 'Scientifique']
  },
  6: {
    name: 'Le Loyaliste',
    description: 'Engagé, responsable, anxieux, suspicieux, loyal et défensif',
    icon: Anchor,
    color: 'bg-indigo-500',
    motivation: 'Avoir sécurité et soutien',
    fear: 'Être sans soutien ou guidance',
    careers: ['Avocat', 'Policier', 'Comptable', 'Administrateur', 'Consultant']
  },
  7: {
    name: 'L\'Enthousiaste',
    description: 'Spontané, versatile, acquisitif, dispersé, optimiste et impulsif',
    icon: Zap,
    color: 'bg-orange-500',
    motivation: 'Maintenir bonheur et satisfaction',
    fear: 'Être piégé dans la douleur ou la privation',
    careers: ['Journaliste', 'Animateur', 'Consultant', 'Entrepreneur', 'Guide touristique']
  },
  8: {
    name: 'Le Challenger',
    description: 'Puissant, dominateur, confiant en soi, confrontant, autoritaire et vengeur',
    icon: Mountain,
    color: 'bg-gray-700',
    motivation: 'Être autonome et contrôler sa vie',
    fear: 'Être contrôlé ou vulnérable',
    careers: ['PDG', 'Entrepreneur', 'Avocat', 'Militaire', 'Négociateur']
  },
  9: {
    name: 'Le Médiateur',
    description: 'Réceptif, rassurant, agréable, complaisant, résigné et négligent',
    icon: Flower,
    color: 'bg-green-500',
    motivation: 'Maintenir paix et harmonie intérieure',
    fear: 'Perte de connexion et fragmentation',
    careers: ['Médiateur', 'Conseiller', 'Bibliothécaire', 'Vétérinaire', 'Diplomate']
  }
};

export const EnneagramTestPage: React.FC = () => {
  const { user } = useAuth();
  const [questions, setQuestions] = useState<EnneagramTest[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [testStarted, setTestStarted] = useState(false);
  const [testCompleted, setTestCompleted] = useState(false);
  const [results, setResults] = useState<EnneagramResult | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchQuestions();
    checkExistingResults();
  }, [user]);

  const fetchQuestions = async () => {
    try {
      const { data, error } = await supabase
        .from('enneagram_tests_2025_10_03_16_01')
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
        .from('enneagram_results_2025_10_03_16_01')
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
      1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0, 9: 0
    };

    questions.forEach(question => {
      const answer = answers[question.id];
      if (answer) {
        // Calculer le score pour chaque type basé sur les poids de la question
        for (let type = 1; type <= 9; type++) {
          const weightKey = `type_${type}_weight` as keyof EnneagramTest;
          const weight = question[weightKey] as number;
          scores[type as keyof typeof scores] += weight * answer;
        }
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
        scores[parseInt(a[0]) as keyof typeof scores] > scores[parseInt(b[0]) as keyof typeof scores] ? a : b
      )[0];

      // Trouver l'aile (type adjacent avec le score le plus élevé)
      const dominantTypeNum = parseInt(dominantType);
      const leftWing = dominantTypeNum === 1 ? 9 : dominantTypeNum - 1;
      const rightWing = dominantTypeNum === 9 ? 1 : dominantTypeNum + 1;
      const wingType = scores[leftWing as keyof typeof scores] > scores[rightWing as keyof typeof scores] ? leftWing : rightWing;

      const resultData = {
        user_id: user.id,
        type_1_score: scores[1],
        type_2_score: scores[2],
        type_3_score: scores[3],
        type_4_score: scores[4],
        type_5_score: scores[5],
        type_6_score: scores[6],
        type_7_score: scores[7],
        type_8_score: scores[8],
        type_9_score: scores[9],
        dominant_type: dominantTypeNum,
        wing_type: wingType,
        description: enneagramTypes[dominantTypeNum as keyof typeof enneagramTypes].description,
        career_recommendations: enneagramTypes[dominantTypeNum as keyof typeof enneagramTypes].careers.join(', '),
        completed_at: new Date().toISOString(),
      };

      const { data, error } = await supabase
        .from('enneagram_results_2025_10_03_16_01')
        .insert([resultData])
        .select()
        .single();

      if (error) throw error;

      setResults(data);
      setTestCompleted(true);

      toast({
        title: "Test terminé !",
        description: "Vos résultats Ennéagramme ont été calculés avec succès",
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

  if (testCompleted && results && results.dominant_type) {
    const dominantType = enneagramTypes[results.dominant_type as keyof typeof enneagramTypes];
    const wingType = results.wing_type ? enneagramTypes[results.wing_type as keyof typeof enneagramTypes] : null;

    const maxScore = Math.max(
      results.type_1_score,
      results.type_2_score,
      results.type_3_score,
      results.type_4_score,
      results.type_5_score,
      results.type_6_score,
      results.type_7_score,
      results.type_8_score,
      results.type_9_score
    );

    return (
      <div className="space-y-6">
        <div className="text-center">
          <div className="w-16 h-16 gradient-primary rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold mb-2">Votre profil Ennéagramme</h1>
          <p className="text-muted-foreground">
            Découvrez votre type de personnalité et vos motivations profondes
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Type dominant */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="mr-2 h-5 w-5" />
                Votre type principal
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center">
                <div className={`w-20 h-20 ${dominantType.color} rounded-full flex items-center justify-center mx-auto mb-4`}>
                  {React.createElement(dominantType.icon, {
                    className: "h-10 w-10 text-white"
                  })}
                </div>
                <h3 className="text-2xl font-bold mb-2">
                  Type {results.dominant_type} - {dominantType.name}
                </h3>
                <p className="text-muted-foreground mb-4">
                  {dominantType.description}
                </p>
                
                <div className="space-y-3 text-left">
                  <div className="bg-muted/50 p-3 rounded-lg">
                    <h4 className="font-semibold text-sm mb-1">Motivation principale :</h4>
                    <p className="text-sm text-muted-foreground">{dominantType.motivation}</p>
                  </div>
                  
                  <div className="bg-muted/50 p-3 rounded-lg">
                    <h4 className="font-semibold text-sm mb-1">Peur fondamentale :</h4>
                    <p className="text-sm text-muted-foreground">{dominantType.fear}</p>
                  </div>

                  {wingType && (
                    <div className="bg-muted/50 p-3 rounded-lg">
                      <h4 className="font-semibold text-sm mb-1">Aile dominante :</h4>
                      <p className="text-sm text-muted-foreground">
                        Type {results.wing_type} - {wingType.name}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Carrières suggérées */}
          <Card>
            <CardHeader>
              <CardTitle>Carrières suggérées</CardTitle>
              <CardDescription>
                Métiers qui correspondent à votre profil de personnalité
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  {dominantType.careers.map((career, index) => (
                    <Badge key={index} variant="secondary" className="text-sm">
                      {career}
                    </Badge>
                  ))}
                </div>
                
                <div className="bg-muted/50 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">Recommandations professionnelles :</h4>
                  <p className="text-sm text-muted-foreground">
                    {results.career_recommendations}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Graphique des scores */}
        <Card>
          <CardHeader>
            <CardTitle>Répartition de vos scores par type</CardTitle>
            <CardDescription>
              Votre profil complet sur les 9 types de l'Ennéagramme
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4">
              {Object.entries(enneagramTypes).map(([typeNum, typeInfo]) => {
                const score = results[`type_${typeNum}_score` as keyof EnneagramResult] as number;
                const percentage = maxScore > 0 ? (score / maxScore) * 100 : 0;
                const isMainType = parseInt(typeNum) === results.dominant_type;
                const isWing = parseInt(typeNum) === results.wing_type;
                
                return (
                  <div key={typeNum} className={`p-4 border rounded-lg ${isMainType ? 'border-primary bg-primary/5' : isWing ? 'border-orange-300 bg-orange-50' : ''}`}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <div className={`w-6 h-6 ${typeInfo.color} rounded flex items-center justify-center`}>
                          <span className="text-white text-xs font-bold">{typeNum}</span>
                        </div>
                        <span className="font-medium text-sm">{typeInfo.name}</span>
                        {isMainType && <Badge className="text-xs">Principal</Badge>}
                        {isWing && <Badge variant="secondary" className="text-xs">Aile</Badge>}
                      </div>
                      <span className="text-sm text-muted-foreground">{score}</span>
                    </div>
                    <Progress value={percentage} className="h-2" />
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

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
            <Users className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold mb-2">Test Ennéagramme</h1>
          <p className="text-muted-foreground text-lg">
            Découvrez votre type de personnalité et vos motivations profondes
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>À propos de l'Ennéagramme</CardTitle>
            <CardDescription>
              L'Ennéagramme décrit 9 types de personnalité basés sur les motivations et les peurs fondamentales
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4 mb-6">
              {Object.entries(enneagramTypes).map(([typeNum, typeInfo]) => (
                <div key={typeNum} className="flex items-start space-x-3 p-4 border rounded-lg">
                  <div className={`w-10 h-10 ${typeInfo.color} rounded-lg flex items-center justify-center flex-shrink-0`}>
                    <span className="text-white font-bold text-sm">{typeNum}</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm">{typeInfo.name}</h3>
                    <p className="text-xs text-muted-foreground line-clamp-2">{typeInfo.description}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-muted/50 p-4 rounded-lg mb-6">
              <h4 className="font-semibold mb-2">Instructions :</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Le test contient {questions.length} questions</li>
                <li>• Répondez selon ce qui vous correspond le mieux actuellement</li>
                <li>• Évaluez chaque affirmation de 1 (pas du tout) à 5 (complètement)</li>
                <li>• Soyez honnête avec vous-même</li>
                <li>• Le test prend environ 15-20 minutes</li>
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
              <Badge className="bg-purple-500 text-white mb-4">
                Ennéagramme
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
                        {score === 1 && 'Pas du tout'}
                        {score === 2 && 'Un peu'}
                        {score === 3 && 'Modérément'}
                        {score === 4 && 'Beaucoup'}
                        {score === 5 && 'Complètement'}
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