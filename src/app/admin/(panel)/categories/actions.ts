'use server';

import { revalidatePath } from 'next/cache';
import { db } from '@/lib/db';
import { requireAdmin } from '@/lib/auth-server';

export async function createCategory(formData: FormData) {
  await requireAdmin();
  const nameAr = String(formData.get('nameAr') ?? '').trim();
  const nameEn = String(formData.get('nameEn') ?? '').trim();
  const sortOrder = Number.parseInt(String(formData.get('sortOrder') ?? '0'), 10) || 0;
  const isActive = formData.get('isActive') === 'on';
  if (!nameAr || !nameEn) {
    return { ok: false as const, error: 'أدخل الاسم بالعربي والإنجليزي' };
  }
  await db.category.create({ data: { nameAr, nameEn, sortOrder, isActive } });
  revalidatePath('/admin/categories');
  return { ok: true as const };
}

export async function updateCategory(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get('id') ?? '');
  const nameAr = String(formData.get('nameAr') ?? '').trim();
  const nameEn = String(formData.get('nameEn') ?? '').trim();
  const sortOrder = Number.parseInt(String(formData.get('sortOrder') ?? '0'), 10) || 0;
  const isActive = formData.get('isActive') === 'on';
  if (!id || !nameAr || !nameEn) {
    return { ok: false as const, error: 'بيانات ناقصة' };
  }
  await db.category.update({
    where: { id },
    data: { nameAr, nameEn, sortOrder, isActive },
  });
  revalidatePath('/admin/categories');
  return { ok: true as const };
}

export async function deleteCategory(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get('id') ?? '');
  if (!id) return { ok: false as const, error: 'معرّف ناقص' };
  try {
    await db.category.delete({ where: { id } });
  } catch {
    return {
      ok: false as const,
      error: 'لا يمكن الحذف: قد تكون هناك أصناف مرتبطة بهذا التصنيف',
    };
  }
  revalidatePath('/admin/categories');
  return { ok: true as const };
}
