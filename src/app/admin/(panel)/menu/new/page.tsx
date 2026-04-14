import Link from 'next/link';
import { db } from '@/lib/db';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MenuItemForm } from '../menu-item-form';
import { createMenuItem } from '../actions';

export default async function NewMenuItemPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const sp = await searchParams;
  const categories = await db.category.findMany({
    where: { isActive: true },
    orderBy: { sortOrder: 'asc' },
    select: { id: true, nameAr: true },
  });

  const err =
    sp.error === 'missing'
      ? 'يرجى تعبئة الحقول المطلوبة.'
      : sp.error === 'price'
        ? 'السعر غير صالح.'
        : null;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <h1 className="text-2xl font-bold">إضافة صنف</h1>
        <Button variant="outline" asChild>
          <Link href="/admin/menu">رجوع</Link>
        </Button>
      </div>
      {err ? <p className="text-sm text-destructive">{err}</p> : null}
      <Card>
        <CardHeader>
          <CardTitle>بيانات الصنف</CardTitle>
        </CardHeader>
        <CardContent>
          <MenuItemForm
            categories={categories}
            defaults={{
              categoryId: categories[0]?.id ?? '',
              nameAr: '',
              nameEn: '',
              descriptionAr: '',
              descriptionEn: '',
              priceSar: '',
              image: '',
              available: true,
              sortOrder: 0,
            }}
            action={createMenuItem}
            submitLabel="حفظ الصنف"
          />
        </CardContent>
      </Card>
    </div>
  );
}
