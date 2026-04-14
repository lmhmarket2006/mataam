import { db } from '@/lib/db';
import { halalasToSar } from '@/lib/money';
import type {
  PublicBranch,
  PublicMenuCategory,
  PublicMenuItem,
  PublicRestaurantPayload,
  PublicRestaurantSettings,
} from '@/lib/public-menu-types';

/** Rotating icons by category sort order (no DB field). */
const CATEGORY_ICONS = ['\u{1F357}', '\u{1F969}', '\u{1F35A}', '\u{1F957}', '\u{1F9C6}', '\u{1F9C3}', '\u{1F370}', '\u{2B50}'];

const PLACEHOLDER_IMAGE = '/logo.svg';

const POPULAR_COUNT = 8;

function sarFromHalalas(h: number): number {
  return Math.round(halalasToSar(h) * 100) / 100;
}

function getMinimalFallbackPayload(): PublicRestaurantPayload {
  return {
    settings: {
      nameAr: 'مطعم',
      nameEn: 'Restaurant',
      logo: null,
      whatsappNumber: null,
      currency: 'SAR',
      defaultPickupAddressAr: null,
      defaultPickupAddressEn: null,
      deliveryFeeSar: 10,
      freeDeliveryMinSar: 100,
    },
    branches: [],
    menuCategories: [],
    allMenuItems: [],
    popularItems: [],
  };
}

function mapSettings(row: {
  nameAr: string;
  nameEn: string;
  logo: string | null;
  whatsappNumber: string | null;
  currency: string;
  defaultPickupAddressAr: string | null;
  defaultPickupAddressEn: string | null;
  deliveryFeeAmount: number;
  freeDeliveryMinTotal: number;
}): PublicRestaurantSettings {
  return {
    nameAr: row.nameAr,
    nameEn: row.nameEn,
    logo: row.logo,
    whatsappNumber: row.whatsappNumber,
    currency: row.currency,
    defaultPickupAddressAr: row.defaultPickupAddressAr,
    defaultPickupAddressEn: row.defaultPickupAddressEn,
    deliveryFeeSar: sarFromHalalas(row.deliveryFeeAmount),
    freeDeliveryMinSar: sarFromHalalas(row.freeDeliveryMinTotal),
  };
}

export async function getPublicRestaurantPayload(): Promise<PublicRestaurantPayload> {
  try {
    return await loadPublicRestaurantPayload();
  } catch (e) {
    console.error('[getPublicRestaurantPayload]', e);
    return getMinimalFallbackPayload();
  }
}

async function loadPublicRestaurantPayload(): Promise<PublicRestaurantPayload> {
  const [settingsRow, branchRows, categoryRows] = await Promise.all([
    db.restaurantSettings.findUnique({ where: { id: 'default' } }),
    db.branch.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: 'asc' },
    }),
    db.category.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: 'asc' },
      include: {
        items: {
          where: { available: true },
          orderBy: { sortOrder: 'asc' },
          include: {
            optionGroups: {
              orderBy: { sortOrder: 'asc' },
              include: { values: { orderBy: { sortOrder: 'asc' } } },
            },
          },
        },
      },
    }),
  ]);

  const settings: PublicRestaurantSettings = settingsRow
    ? mapSettings(settingsRow)
    : {
        nameAr: 'مطعم',
        nameEn: 'Restaurant',
        logo: null,
        whatsappNumber: null,
        currency: 'SAR',
        defaultPickupAddressAr: null,
        defaultPickupAddressEn: null,
        deliveryFeeSar: 10,
        freeDeliveryMinSar: 100,
      };

  const branches: PublicBranch[] = branchRows.map((b) => ({
    id: b.id,
    nameAr: b.nameAr,
    nameEn: b.nameEn,
    cityAr: b.cityAr ?? '',
    cityEn: b.cityEn ?? '',
    addressAr: b.addressAr,
    addressEn: b.addressEn,
    phone: b.phone,
    hoursAr: b.hoursAr ?? '',
    hoursEn: b.hoursEn ?? '',
    lat: b.lat,
    lng: b.lng,
  }));

  const popularIds = new Set<string>();
  const flatForPopular: { id: string }[] = [];

  const menuCategories: PublicMenuCategory[] = categoryRows.map((cat, catIndex) => {
    const icon =
      CATEGORY_ICONS[cat.sortOrder % CATEGORY_ICONS.length] ||
      CATEGORY_ICONS[catIndex % CATEGORY_ICONS.length];

    const items: PublicMenuItem[] = cat.items.map((item) => {
      const baseSar = sarFromHalalas(item.price);
      const optionGroups = item.optionGroups.map((g) => ({
        id: g.id,
        nameAr: g.nameAr,
        nameEn: g.nameEn,
        selectionType: g.selectionType as 'SINGLE' | 'MULTIPLE',
        isRequired: g.isRequired,
        minSelect: g.minSelect,
        maxSelect: g.maxSelect,
        sortOrder: g.sortOrder,
        values: g.values.map((v) => ({
          id: v.id,
          nameAr: v.nameAr,
          nameEn: v.nameEn,
          priceModifierSar: sarFromHalalas(v.priceModifier),
          sortOrder: v.sortOrder,
        })),
      }));

      flatForPopular.push({ id: item.id });

      return {
        id: item.id,
        nameAr: item.nameAr,
        nameEn: item.nameEn,
        descAr: item.descriptionAr ?? '',
        descEn: item.descriptionEn ?? '',
        price: baseSar,
        image: item.image?.trim() ? item.image : PLACEHOLDER_IMAGE,
        category: cat.id,
        isBestSeller: false,
        isNew: false,
        isSpicy: false,
        optionGroups,
      };
    });

    return {
      id: cat.id,
      nameAr: cat.nameAr,
      nameEn: cat.nameEn,
      icon,
      items,
    };
  });

  for (let i = 0; i < Math.min(POPULAR_COUNT, flatForPopular.length); i++) {
    popularIds.add(flatForPopular[i].id);
  }

  const allMenuItems: PublicMenuItem[] = menuCategories.flatMap((c) =>
    c.items.map((item) => ({
      ...item,
      isPopular: popularIds.has(item.id),
    }))
  );

  const menuCategoriesWithPopular: PublicMenuCategory[] = menuCategories.map((c) => ({
    ...c,
    items: c.items.map((item) => ({
      ...item,
      isPopular: popularIds.has(item.id),
    })),
  }));

  const popularItems = allMenuItems.filter((i) => i.isPopular);

  return {
    settings,
    branches,
    menuCategories: menuCategoriesWithPopular,
    allMenuItems,
    popularItems,
  };
}
