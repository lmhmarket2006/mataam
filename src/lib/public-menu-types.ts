/** Serializable shapes for the public restaurant UI (from DB). Money for display: SAR (number). */

export type PublicOptionValue = {
  id: string;
  nameAr: string;
  nameEn: string;
  /** Extra charge in SAR (from halalas on server). */
  priceModifierSar: number;
  sortOrder: number;
};

export type PublicOptionGroup = {
  id: string;
  nameAr: string;
  nameEn: string;
  selectionType: 'SINGLE' | 'MULTIPLE';
  isRequired: boolean;
  minSelect: number | null;
  maxSelect: number | null;
  sortOrder: number;
  values: PublicOptionValue[];
};

/** Menu item as consumed by MenuPage / HomePage / ItemCustomizer. */
export type PublicMenuItem = {
  id: string;
  nameAr: string;
  nameEn: string;
  descAr: string;
  descEn: string;
  /** Base unit price in SAR (for display). */
  price: number;
  image: string;
  category: string;
  isPopular?: boolean;
  isBestSeller?: boolean;
  isNew?: boolean;
  isSpicy?: boolean;
  optionGroups: PublicOptionGroup[];
};

export type PublicMenuCategory = {
  id: string;
  nameAr: string;
  nameEn: string;
  icon: string;
  items: PublicMenuItem[];
};

export type PublicBranch = {
  id: string;
  nameAr: string;
  nameEn: string;
  cityAr: string;
  cityEn: string;
  addressAr: string;
  addressEn: string;
  phone: string;
  hoursAr: string;
  hoursEn: string;
  lat: number;
  lng: number;
};

export type PublicRestaurantSettings = {
  nameAr: string;
  nameEn: string;
  logo: string | null;
  whatsappNumber: string | null;
  currency: string;
  defaultPickupAddressAr: string | null;
  defaultPickupAddressEn: string | null;
  deliveryFeeSar: number;
  freeDeliveryMinSar: number;
};

export type PublicRestaurantPayload = {
  settings: PublicRestaurantSettings;
  branches: PublicBranch[];
  menuCategories: PublicMenuCategory[];
  allMenuItems: PublicMenuItem[];
  popularItems: PublicMenuItem[];
};
