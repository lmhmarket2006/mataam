'use client';

import React, { useEffect, useState } from 'react';
import { RestaurantProvider } from '@/contexts/restaurant-data-context';
import { useDelivery, CART_MIGRATION_FLAG } from '@/lib/store';
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
  const { isRTL, locale } = useLanguage();
  const [cartMigrationNotice, setCartMigrationNotice] = useState(false);

  useEffect(() => {
    useDelivery
      .getState()
      .hydratePricing(data.settings.deliveryFeeSar, data.settings.freeDeliveryMinSar);
  }, [data.settings.deliveryFeeSar, data.settings.freeDeliveryMinSar]);

  useEffect(() => {
    try {
      if (sessionStorage.getItem(CART_MIGRATION_FLAG) === '1') {
        sessionStorage.removeItem(CART_MIGRATION_FLAG);
        setCartMigrationNotice(true);
      }
    } catch {
      /* ignore */
    }
  }, []);

  return (
    <RestaurantProvider value={data}>
      <div className="min-h-screen flex flex-col" dir={isRTL ? 'rtl' : 'ltr'}>
        <Header />
        {cartMigrationNotice ? (
          <div
            role="status"
            className="shrink-0 border-b border-amber-200/80 bg-amber-50 px-4 py-2.5 text-center text-sm text-amber-950 dark:border-amber-900/50 dark:bg-amber-950/40 dark:text-amber-100"
          >
            <p className="font-medium">تم تحديث السلة، يرجى إعادة إضافة الطلبات</p>
            <p className="text-xs opacity-90 mt-0.5">Your cart was updated. Please add your items again.</p>
            <button
              type="button"
              onClick={() => setCartMigrationNotice(false)}
              className="mt-2 text-xs underline underline-offset-2 hover:opacity-80"
            >
              {locale === 'ar' ? 'إغلاق' : 'Dismiss'}
            </button>
          </div>
        ) : null}
        <RestaurantPages />
      </div>
    </RestaurantProvider>
  );
}
