'use client';

import React from 'react';
import { useNavigation, useLanguage } from '@/lib/store';
import Header from '@/components/restaurant/Header';
import Footer from '@/components/restaurant/Footer';
import HomePage from '@/components/restaurant/HomePage';
import MenuPage from '@/components/restaurant/MenuPage';
import AboutPage from '@/components/restaurant/AboutPage';
import BranchesPage from '@/components/restaurant/BranchesPage';
import ContactPage from '@/components/restaurant/ContactPage';
import CartDrawer from '@/components/restaurant/CartDrawer';
import ItemCustomizer from '@/components/restaurant/ItemCustomizer';

export default function Home() {
  const { currentPage } = useNavigation();
  const { isRTL } = useLanguage();

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage />;
      case 'menu':
        return <MenuPage />;
      case 'about':
        return <AboutPage />;
      case 'branches':
        return <BranchesPage />;
      case 'contact':
        return <ContactPage />;
      default:
        return <HomePage />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col overflow-x-clip" dir={isRTL ? 'rtl' : 'ltr'}>
      <Header />
      <div className="flex-1">
        {renderPage()}
      </div>
      <Footer />
      <CartDrawer />
      <ItemCustomizer />
    </div>
  );
}
