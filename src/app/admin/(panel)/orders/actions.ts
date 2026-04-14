'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { OrderStatus } from '@prisma/client';
import { db } from '@/lib/db';
import { requireAdmin } from '@/lib/auth-server';

const ORDER_STATUS_VALUES = new Set<string>(Object.values(OrderStatus));

function isOrderStatus(value: string): value is OrderStatus {
  return ORDER_STATUS_VALUES.has(value);
}

export async function updateOrderStatus(formData: FormData): Promise<void> {
  await requireAdmin();
  const id = String(formData.get('orderId') ?? '').trim();
  const statusRaw = String(formData.get('status') ?? '').trim();
  const returnToDetail = String(formData.get('returnToDetail') ?? '').trim();

  if (!id) {
    redirect('/admin/orders?error=id');
  }
  if (!isOrderStatus(statusRaw)) {
    if (returnToDetail === id) {
      redirect(`/admin/orders/${id}?error=status`);
    }
    redirect('/admin/orders?error=status');
  }

  const existing = await db.order.findUnique({ where: { id }, select: { id: true } });
  if (!existing) {
    redirect('/admin/orders?error=notfound');
  }

  await db.order.update({
    where: { id },
    data: { status: statusRaw },
  });
  revalidatePath('/admin/orders');
  revalidatePath(`/admin/orders/${id}`);
}
