import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  Search,
  FileText,
  Calendar,
  Brain,
  BookOpen,
  Settings,
  HelpCircle,
  Briefcase,
  Users,
  BarChart3,
  Upload,
  MessageSquare,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';

const navigation = [
  {
    title: 'Principal',
    items: [
      {
        title: 'Tableau de bord',
        href: '/dashboard',
        icon: LayoutDashboard,
        description: 'Vue d\'ensemble de vos candidatures'
      },
      {
        title: 'Recherche d\'emploi',
        href: '/jobs',
        icon: Search,
        description: 'Découvrir de nouvelles opportunités'
      },
      {
        title: 'Mes candidatures',
        href: '/applications',
        icon: Briefcase,
        description: 'Suivi de vos candidatures',
        badge: '12'
      },
    ]
  },
  {
    title: 'Outils',
    items: [
      {
        title: 'Générateur CV',
        href: '/cv-generator',
        icon: FileText,
        description: 'Créer et personnaliser votre CV'
      },
      {
        title: 'Entretiens',
        href: '/interviews',
        icon: Calendar,
        description: 'Préparation aux entretiens'
      },
      {
        title: 'Documents',
        href: '/documents',
        icon: Upload,
        description: 'Gérer vos fichiers'
      },
    ]
  },
  {
    title: 'Tests & Évaluations',
    items: [
      {
        title: 'Test RIASEC',
        href: '/riasec',
        icon: Brain,
        description: 'Découvrir vos intérêts professionnels'
      },
      {
        title: 'Ennéagramme',
        href: '/enneagram',
        icon: Users,
        description: 'Comprendre votre personnalité'
      },
      {
        title: 'Ressources',
        href: '/resources',
        icon: BookOpen,
        description: 'Guides et formations'
      },
    ]
  },
  {
    title: 'Assistance',
    items: [
      {
        title: 'Assistant IA',
        href: '/ai-assistant',
        icon: MessageSquare,
        description: 'Aide personnalisée'
      },
      {
        title: 'Statistiques',
        href: '/stats',
        icon: BarChart3,
        description: 'Analyser vos performances'
      },
      {
        title: 'Aide',
        href: '/help',
        icon: HelpCircle,
        description: 'Support et FAQ'
      },
    ]
  }
];

export const Sidebar: React.FC = () => {
  const location = useLocation();

  return (
    <div className="w-64 bg-sidebar-background border-r border-sidebar-border flex flex-col">
      {/* Header de la sidebar */}
      <div className="p-6 border-b border-sidebar-border">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 gradient-primary rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">ER</span>
          </div>
          <div>
            <h2 className="text-sm font-semibold text-sidebar-foreground">Emploi Romand</h2>
            <p className="text-xs text-sidebar-foreground/60">SaaS Recherche d'emploi</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <ScrollArea className="flex-1 px-3 py-4">
        <div className="space-y-6">
          {navigation.map((section) => (
            <div key={section.title}>
              <h3 className="px-3 text-xs font-semibold text-sidebar-foreground/60 uppercase tracking-wider mb-3">
                {section.title}
              </h3>
              <div className="space-y-1">
                {section.items.map((item) => {
                  const isActive = location.pathname === item.href;
                  return (
                    <Link key={item.href} to={item.href}>
                      <Button
                        variant={isActive ? "secondary" : "ghost"}
                        className={cn(
                          "w-full justify-start h-auto p-3 text-left",
                          isActive 
                            ? "bg-sidebar-accent text-sidebar-accent-foreground shadow-sm" 
                            : "text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"
                        )}
                      >
                        <div className="flex items-center space-x-3 w-full">
                          <item.icon className="h-4 w-4 flex-shrink-0" />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-medium truncate">
                                {item.title}
                              </span>
                              {item.badge && (
                                <Badge 
                                  variant="secondary" 
                                  className="ml-2 h-5 px-1.5 text-xs bg-primary text-primary-foreground"
                                >
                                  {item.badge}
                                </Badge>
                              )}
                            </div>
                            <p className="text-xs text-muted-foreground truncate mt-0.5">
                              {item.description}
                            </p>
                          </div>
                        </div>
                      </Button>
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>

      {/* Footer de la sidebar */}
      <div className="p-3 border-t border-sidebar-border">
        <Link to="/settings">
          <Button
            variant="ghost"
            className="w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent/50"
          >
            <Settings className="mr-3 h-4 w-4" />
            <span className="text-sm">Paramètres</span>
          </Button>
        </Link>
      </div>
    </div>
  );
};