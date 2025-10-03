import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Search,
  FileText,
  Calendar,
  Brain,
  BarChart3,
  CheckCircle,
  ArrowRight,
  Zap,
  Shield,
  Users,
  Target,
  Briefcase,
  MessageSquare,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const features = [
  {
    icon: Search,
    title: 'Recherche Automatisée',
    description: 'Notre IA scanne automatiquement les offres d\'emploi en Suisse Romande et vous propose les meilleures opportunités.',
    color: 'text-blue-500'
  },
  {
    icon: FileText,
    title: 'CV & Lettres Personnalisés',
    description: 'Génération automatique de CV et lettres de motivation adaptés à chaque offre d\'emploi.',
    color: 'text-green-500'
  },
  {
    icon: Calendar,
    title: 'Suivi Kanban',
    description: 'Organisez vos candidatures avec notre système Kanban intuitif et ne perdez plus le fil.',
    color: 'text-purple-500'
  },
  {
    icon: Brain,
    title: 'Tests Psychométriques',
    description: 'Découvrez vos forces avec nos tests RIASEC et Ennéagramme pour une orientation optimale.',
    color: 'text-orange-500'
  },
  {
    icon: MessageSquare,
    title: 'Préparation Entretiens',
    description: 'Assistant IA pour vous préparer aux entretiens avec des simulations personnalisées.',
    color: 'text-pink-500'
  },
  {
    icon: BarChart3,
    title: 'Statistiques Avancées',
    description: 'Analysez vos performances et optimisez votre stratégie de recherche d\'emploi.',
    color: 'text-indigo-500'
  },
];

const stats = [
  { label: 'Offres analysées', value: '10,000+' },
  { label: 'CV générés', value: '5,000+' },
  { label: 'Entretiens décrochés', value: '2,500+' },
  { label: 'Taux de réussite', value: '85%' },
];

const testimonials = [
  {
    name: 'Marie Dubois',
    role: 'Développeuse Full-Stack',
    location: 'Lausanne, VD',
    content: 'Grâce à Emploi Romand, j\'ai trouvé mon poste de rêve en seulement 3 semaines. L\'automatisation m\'a fait gagner un temps précieux.',
    avatar: 'MD'
  },
  {
    name: 'Pierre Martin',
    role: 'Chef de Projet',
    location: 'Genève, GE',
    content: 'Les tests psychométriques m\'ont aidé à mieux comprendre mes motivations et à cibler les bonnes opportunités.',
    avatar: 'PM'
  },
  {
    name: 'Sophie Leroy',
    role: 'Consultante RH',
    location: 'Neuchâtel, NE',
    content: 'L\'assistant IA pour la préparation d\'entretiens est fantastique. Je me sens beaucoup plus confiante maintenant.',
    avatar: 'SL'
  },
];

export const LandingPage: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-background via-muted/20 to-primary/5 py-20 lg:py-32">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="container mx-auto px-4 relative">
          <div className="max-w-4xl mx-auto text-center">
            <Badge className="mb-6 gradient-primary text-white border-0">
              <Zap className="w-3 h-3 mr-1" />
              Automatisation IA Avancée
            </Badge>
            <h1 className="text-5xl lg:text-7xl font-bold mb-6 gradient-hero bg-clip-text text-transparent">
              Votre Carrière en
              <br />
              <span className="text-primary">Suisse Romande</span>
            </h1>
            <p className="text-xl lg:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed">
              La première plateforme SaaS qui automatise votre recherche d'emploi en Suisse Romande. 
              IA, tests psychométriques et suivi intelligent pour maximiser vos chances de succès.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              {user ? (
                <Button size="lg" className="gradient-primary text-white shadow-primary" asChild>
                  <Link to="/dashboard">
                    Accéder au Dashboard
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
              ) : (
                <>
                  <Button size="lg" className="gradient-primary text-white shadow-primary" asChild>
                    <Link to="/register">
                      Commencer Gratuitement
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Link>
                  </Button>
                  <Button size="lg" variant="outline" asChild>
                    <Link to="/login">Se connecter</Link>
                  </Button>
                </>
              )}
            </div>
            
            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 max-w-2xl mx-auto">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-2xl lg:text-3xl font-bold text-primary mb-1">
                    {stat.value}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 lg:py-32 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge className="mb-4" variant="secondary">
              <Target className="w-3 h-3 mr-1" />
              Fonctionnalités
            </Badge>
            <h2 className="text-4xl lg:text-5xl font-bold mb-6">
              Tout ce dont vous avez besoin
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Une suite complète d'outils alimentés par l'IA pour optimiser votre recherche d'emploi
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="job-card group hover:shadow-primary/20">
                <CardHeader>
                  <div className={`w-12 h-12 rounded-lg bg-muted flex items-center justify-center mb-4 group-hover:scale-110 transition-transform ${feature.color}`}>
                    <feature.icon className="h-6 w-6" />
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base leading-relaxed">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 lg:py-32">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge className="mb-4" variant="secondary">
              <Briefcase className="w-3 h-3 mr-1" />
              Comment ça marche
            </Badge>
            <h2 className="text-4xl lg:text-5xl font-bold mb-6">
              Simple et efficace
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              En quelques étapes, automatisez votre recherche d'emploi
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  step: '01',
                  title: 'Créez votre profil',
                  description: 'Renseignez vos compétences, expériences et préférences pour que notre IA vous comprenne parfaitement.'
                },
                {
                  step: '02',
                  title: 'L\'IA travaille pour vous',
                  description: 'Notre système scanne automatiquement les offres, génère vos candidatures et les envoie selon vos critères.'
                },
                {
                  step: '03',
                  title: 'Suivez et optimisez',
                  description: 'Utilisez notre tableau Kanban pour suivre vos candidatures et nos outils pour préparer vos entretiens.'
                }
              ].map((item, index) => (
                <div key={index} className="text-center">
                  <div className="w-16 h-16 gradient-primary rounded-full flex items-center justify-center text-white font-bold text-xl mb-6 mx-auto">
                    {item.step}
                  </div>
                  <h3 className="text-xl font-semibold mb-4">{item.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 lg:py-32 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge className="mb-4" variant="secondary">
              <Users className="w-3 h-3 mr-1" />
              Témoignages
            </Badge>
            <h2 className="text-4xl lg:text-5xl font-bold mb-6">
              Ils ont trouvé leur emploi
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Découvrez comment Emploi Romand a transformé leur recherche d'emploi
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="job-card">
                <CardContent className="pt-6">
                  <p className="text-muted-foreground mb-6 leading-relaxed">
                    "{testimonial.content}"
                  </p>
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 gradient-primary rounded-full flex items-center justify-center text-white font-semibold text-sm">
                      {testimonial.avatar}
                    </div>
                    <div>
                      <div className="font-semibold">{testimonial.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {testimonial.role} • {testimonial.location}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 lg:py-32 gradient-hero relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="container mx-auto px-4 relative">
          <div className="max-w-3xl mx-auto text-center text-white">
            <h2 className="text-4xl lg:text-5xl font-bold mb-6">
              Prêt à transformer votre carrière ?
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Rejoignez des milliers de professionnels qui ont déjà trouvé leur emploi idéal en Suisse Romande
            </p>
            {!user && (
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="bg-white text-primary hover:bg-white/90" asChild>
                  <Link to="/register">
                    Commencer maintenant
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10" asChild>
                  <Link to="/login">Se connecter</Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-sidebar-background text-sidebar-foreground py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-8 h-8 gradient-primary rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">ER</span>
                </div>
                <span className="font-semibold">Emploi Romand</span>
              </div>
              <p className="text-sidebar-foreground/60 text-sm">
                La plateforme SaaS de référence pour la recherche d'emploi en Suisse Romande.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Produit</h4>
              <ul className="space-y-2 text-sm text-sidebar-foreground/60">
                <li><Link to="/features" className="hover:text-sidebar-foreground">Fonctionnalités</Link></li>
                <li><Link to="/pricing" className="hover:text-sidebar-foreground">Tarifs</Link></li>
                <li><Link to="/security" className="hover:text-sidebar-foreground">Sécurité</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-sm text-sidebar-foreground/60">
                <li><Link to="/help" className="hover:text-sidebar-foreground">Centre d'aide</Link></li>
                <li><Link to="/contact" className="hover:text-sidebar-foreground">Contact</Link></li>
                <li><Link to="/status" className="hover:text-sidebar-foreground">Statut</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Légal</h4>
              <ul className="space-y-2 text-sm text-sidebar-foreground/60">
                <li><Link to="/privacy" className="hover:text-sidebar-foreground">Confidentialité</Link></li>
                <li><Link to="/terms" className="hover:text-sidebar-foreground">Conditions</Link></li>
                <li><Link to="/cookies" className="hover:text-sidebar-foreground">Cookies</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-sidebar-border mt-8 pt-8 text-center text-sm text-sidebar-foreground/60">
            <p>&copy; 2025 Emploi Romand. Tous droits réservés.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};