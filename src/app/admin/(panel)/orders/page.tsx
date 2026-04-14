import Link from 'next/link';
import { OrderStatus } from '@prisma/client';
import { db } from '@/lib/db';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatSarFromHalalas } from '@/lib/money';
import { cn } from '@/lib/utils';

const STATUS_VALUES = Object.values(OrderStatus) as string[];

function isOrderStatus(value: string): value is OrderStatus {
  return STATUS_VALUES.includes(value);
}

const STATUS_LABEL: Record<OrderStatus, string> = {
  PENDING: 'قيد الانتظار',
  CONFIRMED: 'مؤكد',
  PREPARING: 'قيد التحضير',
  READY: 'جاهز',
  COMPLETED: 'مكتمل',
  CANCELLED: 'ملغى',
};

export default async function AdminOrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; error?: string }>;
}) {
  const sp = await searchParams;
  const filterRaw = sp.status ?? 'all';
  const where =
    filterRaw !== 'all' && isOrderStatus(filterRaw)
      ? { status: filterRaw }
      : {};

  const orders = await db.order.findMany({
    where,
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      customerName: true,
      customerPhone: true,
      orderType: true,
      status: true,
      total: true,
      createdAt: true,
    },
  });

  const errMsg =
    sp.error === 'id'
      ? 'معرّف الطلب غير صالح.'
      : sp.error === 'status'
        ? 'حالة غير صالحة.'
        : sp.error === 'notfound'
          ? 'الطلب غير موجود.'
          : null;

  const typeLabel = (t: string) => (t === 'DELIVERY' ? 'توصيل' : 'استلام');

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <h1 className="text-2xl font-bold">الطلبات</h1>
        <Button variant="outline" asChild>
          <Link href="/admin">رجوع</Link>
        </Button>
      </div>

      {errMsg ? <p className="text-sm text-destructive">{errMsg}</p> : null}

      <Card>
        <CardHeader>
          <CardTitle>تصفية حسب الحالة</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          <Button variant={filterRaw === 'all' ? 'default' : 'outline'} size="sm" asChild>
            <Link href="/admin/orders">الكل</Link>
          </Button>
          {STATUS_VALUES.map((st) => (
            <Button key={st} variant={filterRaw === st ? 'default' : 'outline'} size="sm" asChild>
              <Link href={`/admin/orders?status=${st}`}>{STATUS_LABEL[st as OrderStatus]}</Link>
            </Button>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>قائمة الطلبات</CardTitle>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-muted-foreground text-start">
                <th className="py-2 pe-3">التاريخ</th>
                <th className="py-2 pe-3">العميل</th>
                <th className="py-2 pe-3">الجوال</th>
                <th className="py-2 pe-3">النوع</th>
                <th className="py-2 pe-3">الحالة</th>
                <th className="py-2 pe-3">الإجمالي</th>
                <th className="py-2">تفاصيل</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o.id} className="border-b border-border/60">
                  <td className="py-3 pe-3 whitespace-nowrap tabular-nums" dir="ltr">
                    {o.createdAt.toLocaleString('en-SA', { dateStyle: 'short', timeStyle: 'short' })}
                  </td>
                  <td className="py-3 pe-3">{o.customerName}</td>
                  <td className="py-3 pe-3" dir="ltr">
                    {o.customerPhone}
                  </td>
                  <td className="py-3 pe-3">{typeLabel(o.orderType)}</td>
                  <td className="py-3 pe-3">
                    <span
                      className={cn(
                        'inline-flex rounded-full px-2 py-0.5 text-xs font-medium',
                        o.status === 'CANCELLED' && 'bg-destructive/15 text-destructive',
                        o.status === 'COMPLETED' && 'bg-muted text-muted-foreground',
                        o.status !== 'CANCELLED' && o.status !== 'COMPLETED' && 'bg-primary/15 text-primary'
                      )}
                    >
                      {STATUS_LABEL[o.status]}
                    </span>
                  </td>
                  <td className="py-3 pe-3 tabular-nums whitespace-nowrap">
                    {formatSarFromHalalas(o.total)} <span className="text-muted-foreground text-xs">ر.س</span>
                  </td>
                  <td className="py-3">
                    <Button size="sm" variant="secondary" asChild>
                      <Link href={`/admin/orders/${o.id}`}>عرض</Link>
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {orders.length === 0 ? (
            <p className="text-sm text-muted-foreground mt-4">لا توجد طلبات مطابقة للتصفية.</p>
          ) : null}
        </CardContent>
      </Card>
    </div>
  );
}
