'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { db } from '@/lib/db';
import { requireAdmin } from '@/lib/auth-server';

export async function createBranch(formData: FormData): Promise<void> {
  await requireAdmin();
  const nameAr = String(formData.get('nameAr') ?? '').trim();
  const nameEn = String(formData.get('nameEn') ?? '').trim();
  const addressAr = String(formData.get('addressAr') ?? '').trim();
  const addressEn = String(formData.get('addressEn') ?? '').trim();
  const cityAr = String(formData.get('cityAr') ?? '').trim() || null;
  const cityEn = String(formData.get('cityEn') ?? '').trim() || null;
  const phone = String(formData.get('phone') ?? '').trim();
  const hoursAr = String(formData.get('hoursAr') ?? '').trim() || null;
  const hoursEn = String(formData.get('hoursEn') ?? '').trim() || null;
  const lat = Number.parseFloat(String(formData.get('lat') ?? ''));
  const lng = Number.parseFloat(String(formData.get('lng') ?? ''));
  const sortOrder = Number.parseInt(String(formData.get('sortOrder') ?? '0'), 10) || 0;
  const isActive = formData.get('isActive') === 'on';

  if (!nameAr || !nameEn || !addressAr || !addressEn || !phone || Number.isNaN(lat) || Number.isNaN(lng)) {
    redirect('/admin/branches?error=missing');
  }

  await db.branch.create({
    data: {
      nameAr,
      nameEn,
      addressAr,
      addressEn,
      cityAr,
      cityEn,
      phone,
      hoursAr,
      hoursEn,
      lat,
      lng,
      sortOrder,
      isActive,
    },
  });
  revalidatePath('/admin/branches');
}

export async function updateBranch(formData: FormData): Promise<void> {
  await requireAdmin();
  const id = String(formData.get('id') ?? '').trim();
  const nameAr = String(formData.get('nameAr') ?? '').trim();
  const nameEn = String(formData.get('nameEn') ?? '').trim();
  const addressAr = String(formData.get('addressAr') ?? '').trim();
  const addressEn = String(formData.get('addressEn') ?? '').trim();
  const cityAr = String(formData.get('cityAr') ?? '').trim() || null;
  const cityEn = String(formData.get('cityEn') ?? '').trim() || null;
  const phone = String(formData.get('phone') ?? '').trim();
  const hoursAr = String(formData.get('hoursAr') ?? '').trim() || null;
  const hoursEn = String(formData.get('hoursEn') ?? '').trim() || null;
  const lat = Number.parseFloat(String(formData.get('lat') ?? ''));
  const lng = Number.parseFloat(String(formData.get('lng') ?? ''));
  const sortOrder = Number.parseInt(String(formData.get('sortOrder') ?? '0'), 10) || 0;
  const isActive = formData.get('isActive') === 'on';

  if (!id || !nameAr || !nameEn || !addressAr || !addressEn || !phone || Number.isNaN(lat) || Number.isNaN(lng)) {
    redirect('/admin/branches?error=missing');
  }

  await db.branch.update({
    where: { id },
    data: {
      nameAr,
      nameEn,
      addressAr,
      addressEn,
      cityAr,
      cityEn,
      phone,
      hoursAr,
      hoursEn,
      lat,
      lng,
      sortOrder,
      isActive,
    },
  });
  revalidatePath('/admin/branches');
}

export async function deleteBranch(formData: FormData): Promise<void> {
  await requireAdmin();
  const id = String(formData.get('id') ?? '').trim();
  if (!id) {
    redirect('/admin/branches?error=id');
  }
  await db.branch.delete({ where: { id } });
  revalidatePath('/admin/branches');
}
