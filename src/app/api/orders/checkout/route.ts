import { NextResponse } from 'next/server';
import { OrderType, PaymentMethod, Prisma } from '@prisma/client';
import { db } from '@/lib/db';
const MAX_LINES = 40;
const MAX_NOTE = 500;
const DUP_WINDOW_MS = 120_000;
const MIN_REQUEST_GAP_MS = 400;

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

function normalizePhone(raw: string): string {
  return raw.replace(/\D/g, '');
}

function sarRoundFromHalalas(h: number): number {
  return Math.round((h / 100) * 100) / 100;
}

type CheckoutBody = {
  customerName?: string;
  customerPhone?: string;
  orderType?: string;
  address?: string;
  buildingNo?: string;
  floorNo?: string;
  apartmentNo?: string;
  deliveryNotes?: string;
  paymentMethod?: string;
  lines?: Array<{
    menuItemId?: string;
    quantity?: number;
    notes?: string;
    optionValueIds?: string[];
  }>;
};

export async function POST(req: Request) {
  await sleep(MIN_REQUEST_GAP_MS);

  let body: CheckoutBody;
  try {
    body = (await req.json()) as CheckoutBody;
  } catch {
    return NextResponse.json({ ok: false, error: 'invalid_json' }, { status: 400 });
  }

  const customerName = String(body.customerName ?? '').trim();
  const customerPhoneRaw = String(body.customerPhone ?? '').trim();
  const phoneNorm = normalizePhone(customerPhoneRaw);

  if (customerName.length < 2 || phoneNorm.length < 10) {
    return NextResponse.json({ ok: false, error: 'invalid_customer' }, { status: 400 });
  }

  const recent = await db.order.findMany({
    where: { createdAt: { gte: new Date(Date.now() - DUP_WINDOW_MS) } },
    select: { customerPhone: true },
    take: 80,
  });
  if (recent.some((o) => normalizePhone(o.customerPhone) === phoneNorm)) {
    return NextResponse.json({ ok: false, error: 'rate_limited' }, { status: 429 });
  }

  const orderTypeRaw = body.orderType;
  if (orderTypeRaw !== 'delivery' && orderTypeRaw !== 'pickup') {
    return NextResponse.json({ ok: false, error: 'invalid_order_type' }, { status: 400 });
  }
  const orderType = orderTypeRaw === 'delivery' ? OrderType.DELIVERY : OrderType.PICKUP;

  const address = String(body.address ?? '').trim() || null;
  const buildingNo = String(body.buildingNo ?? '').trim() || null;
  const floorNo = String(body.floorNo ?? '').trim() || null;
  const apartmentNo = String(body.apartmentNo ?? '').trim() || null;
  const deliveryNotes = String(body.deliveryNotes ?? '').trim().slice(0, MAX_NOTE) || null;

  if (orderType === OrderType.DELIVERY && (!address || address.length < 3)) {
    return NextResponse.json({ ok: false, error: 'invalid_address' }, { status: 400 });
  }

  const payRaw = body.paymentMethod;
  if (payRaw !== 'cash' && payRaw !== 'online') {
    return NextResponse.json({ ok: false, error: 'invalid_payment' }, { status: 400 });
  }
  const paymentMethod = payRaw === 'cash' ? PaymentMethod.CASH : PaymentMethod.ONLINE;

  const linesIn = Array.isArray(body.lines) ? body.lines : [];
  if (linesIn.length === 0 || linesIn.length > MAX_LINES) {
    return NextResponse.json({ ok: false, error: 'invalid_lines' }, { status: 400 });
  }

  const settings = await db.restaurantSettings.findUnique({ where: { id: 'default' } });
  const deliveryFeeAmount = settings?.deliveryFeeAmount ?? 0;
  const freeDeliveryMinTotal = settings?.freeDeliveryMinTotal ?? 0;

  const menuItemIds = [...new Set(linesIn.map((l) => String(l.menuItemId ?? '').trim()).filter(Boolean))];
  if (menuItemIds.length === 0) {
    return NextResponse.json({ ok: false, error: 'invalid_lines' }, { status: 400 });
  }

  const menuItems = await db.menuItem.findMany({
    where: { id: { in: menuItemIds }, available: true },
    include: {
      optionGroups: {
        orderBy: { sortOrder: 'asc' },
        include: { values: { orderBy: { sortOrder: 'asc' } } },
      },
    },
  });
  const itemById = new Map(menuItems.map((m) => [m.id, m]));

  type BuiltLine = {
    menuItemId: string;
    nameSnapshot: string;
    unitPrice: number;
    quantity: number;
    lineTotal: number;
    notes: string | null;
    optionsSnapshot: Prisma.JsonArray;
  };

  const builtLines: BuiltLine[] = [];

  for (const line of linesIn) {
    const menuItemId = String(line.menuItemId ?? '').trim();
    const item = itemById.get(menuItemId);
    if (!item) {
      return NextResponse.json({ ok: false, error: 'invalid_item' }, { status: 400 });
    }

    const qty = Number(line.quantity);
    if (!Number.isInteger(qty) || qty < 1 || qty > 10) {
      return NextResponse.json({ ok: false, error: 'invalid_quantity' }, { status: 400 });
    }

    const notes = String(line.notes ?? '').trim().slice(0, MAX_NOTE) || null;
    const rawIds = Array.isArray(line.optionValueIds) ? line.optionValueIds : [];
    const selectedIds = [...new Set(rawIds.map((x) => String(x).trim()).filter(Boolean))];

    const valueMeta = new Map<
      string,
      { groupId: string; nameAr: string; nameEn: string; priceModifier: number }
    >();
    for (const g of item.optionGroups) {
      for (const v of g.values) {
        valueMeta.set(v.id, {
          groupId: g.id,
          nameAr: v.nameAr,
          nameEn: v.nameEn,
          priceModifier: v.priceModifier,
        });
      }
    }
    for (const id of selectedIds) {
      if (!valueMeta.has(id)) {
        return NextResponse.json({ ok: false, error: 'invalid_options' }, { status: 400 });
      }
    }

    const selectedByGroup = new Map<string, string[]>();
    for (const vid of selectedIds) {
      const m = valueMeta.get(vid)!;
      const arr = selectedByGroup.get(m.groupId) ?? [];
      arr.push(vid);
      selectedByGroup.set(m.groupId, arr);
    }

    for (const g of item.optionGroups) {
      const picked = selectedByGroup.get(g.id) ?? [];
      if (g.selectionType === 'SINGLE') {
        if (picked.length > 1) {
          return NextResponse.json({ ok: false, error: 'invalid_options' }, { status: 400 });
        }
        if (g.isRequired && picked.length === 0) {
          return NextResponse.json({ ok: false, error: 'invalid_options' }, { status: 400 });
        }
      } else {
        const max = g.maxSelect ?? g.values.length;
        const min = g.minSelect ?? (g.isRequired ? 1 : 0);
        if (picked.length > max) {
          return NextResponse.json({ ok: false, error: 'invalid_options' }, { status: 400 });
        }
        if (picked.length < min) {
          return NextResponse.json({ ok: false, error: 'invalid_options' }, { status: 400 });
        }
      }
    }

    let modifiers = 0;
    const optionsSnapshot: Prisma.JsonArray = [];
    for (const vid of selectedIds) {
      const m = valueMeta.get(vid)!;
      const g = item.optionGroups.find((x) => x.id === m.groupId);
      if (!g) continue;
      modifiers += m.priceModifier;
      optionsSnapshot.push({
        groupNameAr: g.nameAr,
        groupNameEn: g.nameEn,
        valueNameAr: m.nameAr,
        valueNameEn: m.nameEn,
        priceModifier: m.priceModifier,
      });
    }

    const unitPrice = item.price + modifiers;
    const lineTotal = unitPrice * qty;

    builtLines.push({
      menuItemId: item.id,
      nameSnapshot: item.nameAr,
      unitPrice,
      quantity: qty,
      lineTotal,
      notes,
      optionsSnapshot,
    });
  }

  const subtotal = builtLines.reduce((s, l) => s + l.lineTotal, 0);

  let deliveryFee = 0;
  if (orderType === OrderType.DELIVERY) {
    deliveryFee = subtotal >= freeDeliveryMinTotal ? 0 : deliveryFeeAmount;
  }

  const total = subtotal + deliveryFee;

  const order = await db.$transaction(async (tx) => {
    return tx.order.create({
      data: {
        customerName,
        customerPhone: customerPhoneRaw,
        orderType,
        address,
        buildingNo,
        floorNo,
        apartmentNo,
        deliveryNotes,
        paymentMethod,
        subtotal,
        deliveryFee,
        total,
        items: {
          create: builtLines.map((l) => ({
            menuItemId: l.menuItemId,
            nameSnapshot: l.nameSnapshot,
            unitPrice: l.unitPrice,
            quantity: l.quantity,
            lineTotal: l.lineTotal,
            notes: l.notes,
            optionsSnapshot: l.optionsSnapshot,
          })),
        },
      },
    });
  });

  const displayLines = builtLines.map((l) => ({
    nameSnapshot: l.nameSnapshot,
    quantity: l.quantity,
    lineTotalSar: sarRoundFromHalalas(l.lineTotal),
    optionLabels: (l.optionsSnapshot as { valueNameAr?: string }[]).map((o) => o.valueNameAr ?? ''),
  }));

  return NextResponse.json({
    ok: true,
    orderId: order.id,
    display: {
      subtotalSar: sarRoundFromHalalas(subtotal),
      deliveryFeeSar: sarRoundFromHalalas(deliveryFee),
      totalSar: sarRoundFromHalalas(total),
      lines: displayLines,
    },
  });
}
