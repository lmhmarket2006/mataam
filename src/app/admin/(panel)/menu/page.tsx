import Link from 'next/link';
import { db } from '@/lib/db';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatSarFromHalalas } from '@/lib/money';
import { deleteMenuItem } from './actions';

export default async function AdminMenuPage() {
  const items = await db.menuItem.findMany({
    orderBy: [{ sortOrder: 'asc' }, { nameAr: 'asc' }],
    include: { category: { select: { nameAr: true } } },
  });

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <h1 className="text-2xl font-bold">المنيو</h1>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link href="/admin">رجوع</Link>
          </Button>
          <Button asChild>
            <Link href="/admin/menu/new">إضافة صنف</Link>
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>الأصناف</CardTitle>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-muted-foreground text-start">
                <th className="py-2 pe-3">الصنف</th>
                <th className="py-2 pe-3">التصنيف</th>
                <th className="py-2 pe-3">السعر</th>
                <th className="py-2 pe-3">متاح</th>
                <th className="py-2">إجراءات</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id} className="border-b border-border/60">
                  <td className="py-3 pe-3">
                    <div className="font-medium">{item.nameAr}</div>
                    <div className="text-xs text-muted-foreground" dir="ltr">
                      {item.nameEn}
                    </div>
                  </td>
                  <td className="py-3 pe-3">{item.category.nameAr}</td>
                  <td className="py-3 pe-3 tabular-nums whitespace-nowrap">
                    {formatSarFromHalalas(item.price)}{' '}
                    <span className="text-muted-foreground text-xs">ر.س</span>
                  </td>
                  <td className="py-3 pe-3">{item.available ? 'نعم' : 'لا'}</td>
                  <td className="py-3">
                    <div className="flex flex-wrap gap-2">
                      <Button size="sm" variant="secondary" asChild>
                        <Link href={`/admin/menu/${item.id}/edit`}>تعديل</Link>
                      </Button>
                      <form action={deleteMenuItem}>
                        <input type="hidden" name="id" value={item.id} />
                        <Button type="submit" size="sm" variant="destructive">
                          حذف
                        </Button>
                      </form>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {items.length === 0 ? (
            <p className="text-sm text-muted-foreground mt-4">لا توجد أصناف بعد.</p>
          ) : null}
        </CardContent>
      </Card>
    </div>
  );
}
