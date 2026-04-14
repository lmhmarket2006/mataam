'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { db } from '@/lib/db';
import { requireAdmin } from '@/lib/auth-server';
import { sarToHalalas } from '@/lib/money';

function parsePriceSar(raw: string): number | null {
  const n = Number.parseFloat(raw.replace(',', '.').trim());
  if (Number.isNaN(n) || n < 0) return null;
  return sarToHalalas(n);
}

export async function updateRestaurantSettings(formData: FormData): Promise<void> {
  await requireAdmin();
  const nameAr = String(formData.get('nameAr') ?? '').trim();
  const nameEn = String(formData.get('nameEn') ?? '').trim();
  const logo = String(formData.get('logo') ?? '').trim() || null;
  const currency = String(formData.get('currency') ?? '').trim() || 'SAR';
  const whatsappNumber = String(formData.get('whatsappNumber') ?? '').trim() || null;
  const defaultPickupAddressAr = String(formData.get('defaultPickupAddressAr') ?? '').trim() || null;
  const defaultPickupAddressEn = String(formData.get('defaultPickupAddressEn') ?? '').trim() || null;
  const deliveryFeeSar = String(formData.get('deliveryFeeSar') ?? '');
  const freeDeliveryMinTotalSar = String(formData.get('freeDeliveryMinTotalSar') ?? '');

  if (!nameAr || !nameEn) {
    redirect('/admin/settings?error=missing');
  }

  const deliveryFeeAmount = parsePriceSar(deliveryFeeSar);
  const freeDeliveryMinTotal = parsePriceSar(freeDeliveryMinTotalSar);
  if (deliveryFeeAmount === null || freeDeliveryMinTotal === null) {
    redirect('/admin/settings?error=price');
  }

  await db.restaurantSettings.upsert({
    where: { id: 'default' },
    create: {
      id: 'default',
      nameAr,
      nameEn,
      logo,
      currency,
      whatsappNumber,
      defaultPickupAddressAr,
      defaultPickupAddressEn,
      deliveryFeeAmount,
      freeDeliveryMinTotal,
    },
    update: {
      nameAr,
      nameEn,
      logo,
      currency,
      whatsappNumber,
      defaultPickupAddressAr,
      defaultPickupAddressEn,
      deliveryFeeAmount,
      freeDeliveryMinTotal,
    },
  });
  revalidatePath('/admin/settings');
}
