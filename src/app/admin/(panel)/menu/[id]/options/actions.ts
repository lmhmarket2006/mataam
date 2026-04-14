'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { OptionSelectionType } from '@prisma/client';
import { db } from '@/lib/db';
import { requireAdmin } from '@/lib/auth-server';
import { sarToHalalas } from '@/lib/money';

const SELECTION_TYPES = new Set<string>(Object.values(OptionSelectionType));

function parsePriceModifierSar(raw: string): number | null {
  const n = Number.parseFloat(raw.replace(',', '.').trim());
  if (Number.isNaN(n) || n < 0) return null;
  return sarToHalalas(n);
}

function parseOptionalInt(raw: string): number | null {
  const t = raw.trim();
  if (!t) return null;
  const n = Number.parseInt(t, 10);
  if (Number.isNaN(n)) return null;
  return n;
}

async function assertMenuItem(menuItemId: string) {
  const item = await db.menuItem.findUnique({ where: { id: menuItemId }, select: { id: true } });
  if (!item) redirect('/admin/menu');
}

async function assertGroupBelongsToMenuItem(optionGroupId: string, menuItemId: string) {
  const g = await db.optionGroup.findUnique({
    where: { id: optionGroupId },
    select: { menuItemId: true },
  });
  if (!g || g.menuItemId !== menuItemId) {
    redirect(`/admin/menu/${menuItemId}/options?error=group`);
  }
}

async function assertValueBelongsToMenuItem(optionValueId: string, menuItemId: string) {
  const v = await db.optionValue.findUnique({
    where: { id: optionValueId },
    select: { optionGroup: { select: { menuItemId: true } } },
  });
  if (!v || v.optionGroup.menuItemId !== menuItemId) {
    redirect(`/admin/menu/${menuItemId}/options?error=value`);
  }
}

export async function createOptionGroup(formData: FormData): Promise<void> {
  await requireAdmin();
  const menuItemId = String(formData.get('menuItemId') ?? '').trim();
  const nameAr = String(formData.get('nameAr') ?? '').trim();
  const nameEn = String(formData.get('nameEn') ?? '').trim();
  const selectionTypeRaw = String(formData.get('selectionType') ?? 'SINGLE').trim();
  const isRequired = formData.get('isRequired') === 'on';
  const minSelect = parseOptionalInt(String(formData.get('minSelect') ?? ''));
  const maxSelect = parseOptionalInt(String(formData.get('maxSelect') ?? ''));
  const sortOrder = Number.parseInt(String(formData.get('sortOrder') ?? '0'), 10) || 0;

  if (!menuItemId || !nameAr || !nameEn || !SELECTION_TYPES.has(selectionTypeRaw)) {
    if (menuItemId) redirect(`/admin/menu/${menuItemId}/options?error=missing`);
    redirect('/admin/menu');
  }
  await assertMenuItem(menuItemId);

  await db.optionGroup.create({
    data: {
      menuItemId,
      nameAr,
      nameEn,
      selectionType: selectionTypeRaw as OptionSelectionType,
      isRequired,
      minSelect,
      maxSelect,
      sortOrder,
    },
  });
  revalidatePath(`/admin/menu/${menuItemId}/options`);
}

export async function updateOptionGroup(formData: FormData): Promise<void> {
  await requireAdmin();
  const menuItemId = String(formData.get('menuItemId') ?? '').trim();
  const id = String(formData.get('id') ?? '').trim();
  const nameAr = String(formData.get('nameAr') ?? '').trim();
  const nameEn = String(formData.get('nameEn') ?? '').trim();
  const selectionTypeRaw = String(formData.get('selectionType') ?? 'SINGLE').trim();
  const isRequired = formData.get('isRequired') === 'on';
  const minSelect = parseOptionalInt(String(formData.get('minSelect') ?? ''));
  const maxSelect = parseOptionalInt(String(formData.get('maxSelect') ?? ''));
  const sortOrder = Number.parseInt(String(formData.get('sortOrder') ?? '0'), 10) || 0;

  if (!menuItemId || !id || !nameAr || !nameEn || !SELECTION_TYPES.has(selectionTypeRaw)) {
    if (menuItemId) redirect(`/admin/menu/${menuItemId}/options?error=missing`);
    redirect('/admin/menu');
  }
  await assertGroupBelongsToMenuItem(id, menuItemId);

  await db.optionGroup.update({
    where: { id },
    data: {
      nameAr,
      nameEn,
      selectionType: selectionTypeRaw as OptionSelectionType,
      isRequired,
      minSelect,
      maxSelect,
      sortOrder,
    },
  });
  revalidatePath(`/admin/menu/${menuItemId}/options`);
}

export async function deleteOptionGroup(formData: FormData): Promise<void> {
  await requireAdmin();
  const menuItemId = String(formData.get('menuItemId') ?? '').trim();
  const id = String(formData.get('id') ?? '').trim();
  if (!menuItemId || !id) redirect('/admin/menu');
  await assertGroupBelongsToMenuItem(id, menuItemId);
  await db.optionGroup.delete({ where: { id } });
  revalidatePath(`/admin/menu/${menuItemId}/options`);
}

export async function createOptionValue(formData: FormData): Promise<void> {
  await requireAdmin();
  const menuItemId = String(formData.get('menuItemId') ?? '').trim();
  const optionGroupId = String(formData.get('optionGroupId') ?? '').trim();
  const nameAr = String(formData.get('nameAr') ?? '').trim();
  const nameEn = String(formData.get('nameEn') ?? '').trim();
  const priceSar = String(formData.get('priceModifierSar') ?? '');
  const sortOrder = Number.parseInt(String(formData.get('sortOrder') ?? '0'), 10) || 0;

  if (!menuItemId || !optionGroupId || !nameAr || !nameEn) {
    if (menuItemId) redirect(`/admin/menu/${menuItemId}/options?error=missing`);
    redirect('/admin/menu');
  }
  await assertGroupBelongsToMenuItem(optionGroupId, menuItemId);
  const priceModifier = parsePriceModifierSar(priceSar);
  if (priceModifier === null) {
    redirect(`/admin/menu/${menuItemId}/options?error=price`);
  }

  await db.optionValue.create({
    data: {
      optionGroupId,
      nameAr,
      nameEn,
      priceModifier,
      sortOrder,
    },
  });
  revalidatePath(`/admin/menu/${menuItemId}/options`);
}

export async function updateOptionValue(formData: FormData): Promise<void> {
  await requireAdmin();
  const menuItemId = String(formData.get('menuItemId') ?? '').trim();
  const id = String(formData.get('id') ?? '').trim();
  const nameAr = String(formData.get('nameAr') ?? '').trim();
  const nameEn = String(formData.get('nameEn') ?? '').trim();
  const priceSar = String(formData.get('priceModifierSar') ?? '');
  const sortOrder = Number.parseInt(String(formData.get('sortOrder') ?? '0'), 10) || 0;

  if (!menuItemId || !id || !nameAr || !nameEn) {
    if (menuItemId) redirect(`/admin/menu/${menuItemId}/options?error=missing`);
    redirect('/admin/menu');
  }
  await assertValueBelongsToMenuItem(id, menuItemId);
  const priceModifier = parsePriceModifierSar(priceSar);
  if (priceModifier === null) {
    redirect(`/admin/menu/${menuItemId}/options?error=price`);
  }

  await db.optionValue.update({
    where: { id },
    data: { nameAr, nameEn, priceModifier, sortOrder },
  });
  revalidatePath(`/admin/menu/${menuItemId}/options`);
}

export async function deleteOptionValue(formData: FormData): Promise<void> {
  await requireAdmin();
  const menuItemId = String(formData.get('menuItemId') ?? '').trim();
  const id = String(formData.get('id') ?? '').trim();
  if (!menuItemId || !id) redirect('/admin/menu');
  await assertValueBelongsToMenuItem(id, menuItemId);
  await db.optionValue.delete({ where: { id } });
  revalidatePath(`/admin/menu/${menuItemId}/options`);
}
