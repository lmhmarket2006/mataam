'use client';

import React, { createContext, useContext } from 'react';
import type { PublicRestaurantPayload } from '@/lib/public-menu-types';

const RestaurantDataContext = createContext<PublicRestaurantPayload | null>(null);

export function RestaurantProvider({
  value,
  children,
}: {
  value: PublicRestaurantPayload;
  children: React.ReactNode;
}) {
  return <RestaurantDataContext.Provider value={value}>{children}</RestaurantDataContext.Provider>;
}

export function useRestaurantData(): PublicRestaurantPayload {
  const v = useContext(RestaurantDataContext);
  if (!v) {
    throw new Error('useRestaurantData must be used within RestaurantProvider');
  }
  return v;
}
