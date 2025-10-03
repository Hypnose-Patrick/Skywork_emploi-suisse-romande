import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import { useAuth } from '@/contexts/AuthContext';
import { Toaster } from '@/components/ui/toaster';

export const Layout: React.FC = () => {
  const { user } = useAuth();
  const location = useLocation();
  
  // Pages qui n'ont pas besoin de sidebar (login, register, etc.)
  const publicPages = ['/login', '/register', '/'];
  const isPublicPage = publicPages.includes(location.pathname);

  if (!user && !isPublicPage) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <Outlet />
        </main>
        <Toaster />
      </div>
    );
  }

  if (user && !isPublicPage) {
    return (
      <div className="min-h-screen bg-background flex">
        <Sidebar />
        <div className="flex-1 flex flex-col">
          <Header />
          <main className="flex-1 p-6 overflow-auto">
            <Outlet />
          </main>
        </div>
        <Toaster />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <Outlet />
      </main>
      <Toaster />
    </div>
  );
};