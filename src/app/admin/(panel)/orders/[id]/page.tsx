import Link from 'next/link';
import { notFound } from 'next/navigation';
import { OrderStatus } from '@prisma/client';
import { db } from '@/lib/db';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { formatSarFromHalalas } from '@/lib/money';
import { updateOrderStatus } from '../actions';

const STATUS_LABEL: Record<OrderStatus, string> = {
  PENDING: 'قيد الانتظار',
  CONFIRMED: 'مؤكد',
  PREPARING: 'قيد التحضير',
  READY: 'جاهز',
  COMPLETED: 'مكتمل',
  CANCELLED: 'ملغى',
};

const QUICK_STATUSES: OrderStatus[] = ['CONFIRMED', 'PREPARING', 'READY', 'COMPLETED'];

function OptionsSnapshot({ raw }: { raw: unknown }) {
  if (raw == null) return <span className="text-muted-foreground">—</span>;
  if (Array.isArray(raw)) {
    if (raw.length === 0) return <span className="text-muted-foreground">—</span>;
    return (
      <ul className="list-disc ms-4 text-sm space-y-1">
        {raw.map((entry, i) => (
          <li key={i}>
            {typeof entry === 'object' && entry !== null ? (
              <span dir="auto">{JSON.stringify(entry)}</span>
            ) : (
              String(entry)
            )}
          </li>
        ))}
      </ul>
    );
  }
  return (
    <pre className="text-xs whitespace-pre-wrap rounded-md bg-muted p-2 max-h-40 overflow-auto" dir="ltr">
      {JSON.stringify(raw, null, 2)}
    </pre>
  );
}

export default async function AdminOrderDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string }>;
}) {
  const { id } = await params;
  const sp = await searchParams;

  const order = await db.order.findUnique({
    where: { id },
    include: {
      items: { orderBy: { createdAt: 'asc' } },
      branch: { select: { nameAr: true, nameEn: true } },
    },
  });

  if (!order) notFound();

  const errMsg = sp.error === 'status' ? 'حالة غير صالحة.' : null;

  const payLabel = order.paymentMethod === 'CASH' ? 'نقداً' : 'أونلاين';
  const typeLabel = order.orderType === 'DELIVERY' ? 'توصيل' : 'استلام';

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <h1 className="text-2xl font-bold">طلب #{order.id.slice(0, 8)}</h1>
        <Button variant="outline" asChild>
          <Link href="/admin/orders">رجوع للقائمة</Link>
        </Button>
      </div>

      {errMsg ? <p className="text-sm text-destructive">{errMsg}</p> : null}

      <Card>
        <CardHeader>
          <CardTitle>تحديث الحالة</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <form action={updateOrderStatus} className="flex flex-wrap items-end gap-3">
            <input type="hidden" name="orderId" value={order.id} />
            <input type="hidden" name="returnToDetail" value={order.id} />
            <div className="space-y-2">
              <Label htmlFor="status-select">الحالة</Label>
              <select
                id="status-select"
                name="status"
                defaultValue={order.status}
                className="flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm min-w-[180px]"
              >
                {(Object.keys(STATUS_LABEL) as OrderStatus[]).map((st) => (
                  <option key={st} value={st}>
                    {STATUS_LABEL[st]}
                  </option>
                ))}
              </select>
            </div>
            <Button type="submit">حفظ الحالة</Button>
          </form>

          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">اختصار سريع</p>
            <div className="flex flex-wrap gap-2">
              {QUICK_STATUSES.map((st) => (
                <form key={st} action={updateOrderStatus}>
                  <input type="hidden" name="orderId" value={order.id} />
                  <input type="hidden" name="returnToDetail" value={order.id} />
                  <input type="hidden" name="status" value={st} />
                  <Button type="submit" variant="secondary" size="sm" disabled={order.status === st}>
                    {STATUS_LABEL[st]}
                  </Button>
                </form>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>بيانات العميل والطلب</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3 sm:grid-cols-2 text-sm">
          <div>
            <span className="text-muted-foreground">الاسم</span>
            <p className="font-medium">{order.customerName}</p>
          </div>
          <div>
            <span className="text-muted-foreground">الجوال</span>
            <p className="font-medium" dir="ltr">
              {order.customerPhone}
            </p>
          </div>
          <div>
            <span className="text-muted-foreground">نوع الطلب</span>
            <p className="font-medium">{typeLabel}</p>
          </div>
          <div>
            <span className="text-muted-foreground">طريقة الدفع</span>
            <p className="font-medium">{payLabel}</p>
          </div>
          <div>
            <span className="text-muted-foreground">الحالة الحالية</span>
            <p className="font-medium">{STATUS_LABEL[order.status]}</p>
          </div>
          <div>
            <span className="text-muted-foreground">تاريخ الإنشاء</span>
            <p className="font-medium tabular-nums" dir="ltr">
              {order.createdAt.toLocaleString('en-SA', { dateStyle: 'medium', timeStyle: 'short' })}
            </p>
          </div>
          {order.branch ? (
            <div className="sm:col-span-2">
              <span className="text-muted-foreground">الفرع</span>
              <p className="font-medium">
                {order.branch.nameAr} <span className="text-muted-foreground text-xs dir-ltr">{order.branch.nameEn}</span>
              </p>
            </div>
          ) : null}
          {order.orderType === 'DELIVERY' ? (
            <>
              <div className="sm:col-span-2">
                <span className="text-muted-foreground">العنوان</span>
                <p className="font-medium whitespace-pre-wrap">{order.address ?? '—'}</p>
              </div>
              <div>
                <span className="text-muted-foreground">مبنى / دور / شقة</span>
                <p className="font-medium dir-ltr">
                  {[order.buildingNo, order.floorNo, order.apartmentNo].filter(Boolean).join(' / ') || '—'}
                </p>
              </div>
            </>
          ) : null}
          {order.deliveryNotes ? (
            <div className="sm:col-span-2">
              <span className="text-muted-foreground">ملاحظات</span>
              <p className="font-medium whitespace-pre-wrap">{order.deliveryNotes}</p>
            </div>
          ) : null}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>الأصناف</CardTitle>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-muted-foreground text-start">
                <th className="py-2 pe-3">الصنف</th>
                <th className="py-2 pe-3">الكمية</th>
                <th className="py-2 pe-3">سعر الوحدة</th>
                <th className="py-2 pe-3">الإجمالي</th>
                <th className="py-2 pe-3">الإضافات</th>
              </tr>
            </thead>
            <tbody>
              {order.items.map((line) => (
                <tr key={line.id} className="border-b border-border/60 align-top">
                  <td className="py-3 pe-3">
                    <div className="font-medium">{line.nameSnapshot}</div>
                    {line.notes ? <div className="text-xs text-muted-foreground mt-1">{line.notes}</div> : null}
                  </td>
                  <td className="py-3 pe-3 tabular-nums">{line.quantity}</td>
                  <td className="py-3 pe-3 tabular-nums whitespace-nowrap">
                    {formatSarFromHalalas(line.unitPrice)} ر.س
                  </td>
                  <td className="py-3 pe-3 tabular-nums whitespace-nowrap">
                    {formatSarFromHalalas(line.lineTotal)} ر.س
                  </td>
                  <td className="py-3 pe-3 max-w-xs">
                    <OptionsSnapshot raw={line.optionsSnapshot as unknown} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>المجاميع</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm max-w-sm">
          <div className="flex justify-between gap-4">
            <span className="text-muted-foreground">المجموع الفرعي</span>
            <span className="tabular-nums font-medium" dir="ltr">
              {formatSarFromHalalas(order.subtotal)} ر.س
            </span>
          </div>
          <div className="flex justify-between gap-4">
            <span className="text-muted-foreground">رسوم التوصيل</span>
            <span className="tabular-nums font-medium" dir="ltr">
              {formatSarFromHalalas(order.deliveryFee)} ر.س
            </span>
          </div>
          <div className="flex justify-between gap-4 pt-2 border-t font-semibold">
            <span>الإجمالي</span>
            <span className="tabular-nums" dir="ltr">
              {formatSarFromHalalas(order.total)} ر.س
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
