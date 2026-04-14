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

export async function createMenuItem(formData: FormData): Promise<void> {
  await requireAdmin();
  const categoryId = String(formData.get('categoryId') ?? '').trim();
  const nameAr = String(formData.get('nameAr') ?? '').trim();
  const nameEn = String(formData.get('nameEn') ?? '').trim();
  const descriptionAr = String(formData.get('descriptionAr') ?? '').trim() || null;
  const descriptionEn = String(formData.get('descriptionEn') ?? '').trim() || null;
  const priceSar = String(formData.get('priceSar') ?? '');
  const image = String(formData.get('image') ?? '').trim() || null;
  const available = formData.get('available') === 'on';
  const sortOrder = Number.parseInt(String(formData.get('sortOrder') ?? '0'), 10) || 0;

  if (!categoryId || !nameAr || !nameEn) {
    redirect('/admin/menu/new?error=missing');
  }
  const price = parsePriceSar(priceSar);
  if (price === null) {
    redirect('/admin/menu/new?error=price');
  }

  await db.menuItem.create({
    data: {
      categoryId,
      nameAr,
      nameEn,
      descriptionAr,
      descriptionEn,
      price,
      image,
      available,
      sortOrder,
    },
  });
  revalidatePath('/admin/menu');
  redirect('/admin/menu');
}

export async function updateMenuItem(formData: FormData): Promise<void> {
  await requireAdmin();
  const id = String(formData.get('id') ?? '').trim();
  const categoryId = String(formData.get('categoryId') ?? '').trim();
  const nameAr = String(formData.get('nameAr') ?? '').trim();
  const nameEn = String(formData.get('nameEn') ?? '').trim();
  const descriptionAr = String(formData.get('descriptionAr') ?? '').trim() || null;
  const descriptionEn = String(formData.get('descriptionEn') ?? '').trim() || null;
  const priceSar = String(formData.get('priceSar') ?? '');
  const image = String(formData.get('image') ?? '').trim() || null;
  const available = formData.get('available') === 'on';
  const sortOrder = Number.parseInt(String(formData.get('sortOrder') ?? '0'), 10) || 0;

  if (!id || !categoryId || !nameAr || !nameEn) {
    redirect(id ? `/admin/menu/${id}/edit?error=missing` : '/admin/menu');
  }
  const price = parsePriceSar(priceSar);
  if (price === null) {
    redirect(`/admin/menu/${id}/edit?error=price`);
  }

  await db.menuItem.update({
    where: { id },
    data: {
      categoryId,
      nameAr,
      nameEn,
      descriptionAr,
      descriptionEn,
      price,
      image,
      available,
      sortOrder,
    },
  });
  revalidatePath('/admin/menu');
  redirect('/admin/menu');
}

export async function deleteMenuItem(formData: FormData): Promise<void> {
  await requireAdmin();
  const id = String(formData.get('id') ?? '').trim();
  if (!id) return;
  await db.menuItem.delete({ where: { id } });
  revalidatePath('/admin/menu');
}
