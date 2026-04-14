'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { db } from '@/lib/db';
import { requireAdmin } from '@/lib/auth-server';

export async function createCategory(formData: FormData): Promise<void> {
  await requireAdmin();
  const nameAr = String(formData.get('nameAr') ?? '').trim();
  const nameEn = String(formData.get('nameEn') ?? '').trim();
  const sortOrder = Number.parseInt(String(formData.get('sortOrder') ?? '0'), 10) || 0;
  const isActive = formData.get('isActive') === 'on';
  if (!nameAr || !nameEn) {
    redirect('/admin/categories?error=missing');
  }
  await db.category.create({ data: { nameAr, nameEn, sortOrder, isActive } });
  revalidatePath('/admin/categories');
}

export async function updateCategory(formData: FormData): Promise<void> {
  await requireAdmin();
  const id = String(formData.get('id') ?? '');
  const nameAr = String(formData.get('nameAr') ?? '').trim();
  const nameEn = String(formData.get('nameEn') ?? '').trim();
  const sortOrder = Number.parseInt(String(formData.get('sortOrder') ?? '0'), 10) || 0;
  const isActive = formData.get('isActive') === 'on';
  if (!id || !nameAr || !nameEn) {
    redirect('/admin/categories?error=missing');
  }
  await db.category.update({
    where: { id },
    data: { nameAr, nameEn, sortOrder, isActive },
  });
  revalidatePath('/admin/categories');
}

export async function deleteCategory(formData: FormData): Promise<void> {
  await requireAdmin();
  const id = String(formData.get('id') ?? '');
  if (!id) {
    redirect('/admin/categories?error=id');
  }
  try {
    await db.category.delete({ where: { id } });
  } catch {
    redirect('/admin/categories?error=delete');
  }
  revalidatePath('/admin/categories');
}
