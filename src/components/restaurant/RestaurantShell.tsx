'use client';

import React, { useEffect } from 'react';
import { RestaurantProvider } from '@/contexts/restaurant-data-context';
import { useDelivery } from '@/lib/store';
import type { PublicRestaurantPayload } from '@/lib/public-menu-types';
import Header from '@/components/restaurant/Header';
import Footer from '@/components/restaurant/Footer';
import HomePage from '@/components/restaurant/HomePage';
import MenuPage from '@/components/restaurant/MenuPage';
import AboutPage from '@/components/restaurant/AboutPage';
import BranchesPage from '@/components/restaurant/BranchesPage';
import ContactPage from '@/components/restaurant/ContactPage';
import CartDrawer from '@/components/restaurant/CartDrawer';
import ItemCustomizer from '@/components/restaurant/ItemCustomizer';
import { useNavigation, useLanguage } from '@/lib/store';

function RestaurantPages() {
  const { currentPage } = useNavigation();

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
    <>
      <div className="flex-1">{renderPage()}</div>
      <Footer />
      <CartDrawer />
      <ItemCustomizer />
    </>
  );
}

export default function RestaurantShell({ data }: { data: PublicRestaurantPayload }) {
  const { isRTL } = useLanguage();

  useEffect(() => {
    useDelivery
      .getState()
      .hydratePricing(data.settings.deliveryFeeSar, data.settings.freeDeliveryMinSar);
  }, [data.settings.deliveryFeeSar, data.settings.freeDeliveryMinSar]);

  return (
    <RestaurantProvider value={data}>
      <div className="min-h-screen flex flex-col" dir={isRTL ? 'rtl' : 'ltr'}>
        <Header />
        <RestaurantPages />
      </div>
    </RestaurantProvider>
  );
}
