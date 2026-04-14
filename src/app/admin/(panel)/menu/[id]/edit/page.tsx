import Link from 'next/link';
import { notFound } from 'next/navigation';
import { db } from '@/lib/db';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { halalasToSar } from '@/lib/money';
import { MenuItemForm } from '../../menu-item-form';
import { updateMenuItem } from '../../actions';

export default async function EditMenuItemPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string }>;
}) {
  const { id } = await params;
  const sp = await searchParams;

  const [item, categories] = await Promise.all([
    db.menuItem.findUnique({ where: { id } }),
    db.category.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: 'asc' },
      select: { id: true, nameAr: true },
    }),
  ]);

  if (!item) notFound();

  const err =
    sp.error === 'price'
      ? 'السعر غير صالح.'
      : sp.error === 'missing'
        ? 'يرجى تعبئة الحقول المطلوبة.'
        : null;

  const priceSar = halalasToSar(item.price).toFixed(2);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <h1 className="text-2xl font-bold">تعديل صنف</h1>
        <Button variant="outline" asChild>
          <Link href="/admin/menu">رجوع</Link>
        </Button>
      </div>
      {err ? <p className="text-sm text-destructive">{err}</p> : null}
      <Card>
        <CardHeader>
          <CardTitle>{item.nameAr}</CardTitle>
        </CardHeader>
        <CardContent>
          <MenuItemForm
            categories={categories}
            defaults={{
              id: item.id,
              categoryId: item.categoryId,
              nameAr: item.nameAr,
              nameEn: item.nameEn,
              descriptionAr: item.descriptionAr ?? '',
              descriptionEn: item.descriptionEn ?? '',
              priceSar,
              image: item.image ?? '',
              available: item.available,
              sortOrder: item.sortOrder,
            }}
            action={updateMenuItem}
            submitLabel="حفظ التعديلات"
          />
        </CardContent>
      </Card>
    </div>
  );
}
