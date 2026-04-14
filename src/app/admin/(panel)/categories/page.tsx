import Link from 'next/link';
import { db } from '@/lib/db';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { createCategory, deleteCategory, updateCategory } from './actions';

export default async function AdminCategoriesPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const sp = await searchParams;
  const categories = await db.category.findMany({ orderBy: { sortOrder: 'asc' } });

  const errMsg =
    sp.error === 'missing'
      ? 'يرجى تعبئة الحقول المطلوبة.'
      : sp.error === 'delete'
        ? 'لا يمكن الحذف: يوجد أصناف مرتبطة بهذا التصنيف.'
        : sp.error === 'id'
          ? 'معرّف غير صالح.'
          : null;

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <h1 className="text-2xl font-bold">التصنيفات</h1>
        <Button variant="outline" asChild>
          <Link href="/admin">رجوع</Link>
        </Button>
      </div>

      {errMsg ? <p className="text-sm text-destructive">{errMsg}</p> : null}

      <Card>
        <CardHeader>
          <CardTitle>إضافة تصنيف</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={createCategory} className="flex flex-col gap-4">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div className="space-y-2">
                <Label htmlFor="new-nameAr">الاسم (عربي)</Label>
                <Input id="new-nameAr" name="nameAr" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="new-nameEn">الاسم (إنجليزي)</Label>
                <Input id="new-nameEn" name="nameEn" required dir="ltr" className="text-start" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="new-sort">الترتيب</Label>
                <Input id="new-sort" name="sortOrder" type="number" defaultValue={0} />
              </div>
              <div className="flex items-end gap-2 pb-2">
                <input type="checkbox" name="isActive" id="new-active" defaultChecked className="size-4" />
                <Label htmlFor="new-active">نشط</Label>
              </div>
            </div>
            <Button type="submit" className="w-fit">
              إنشاء
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>قائمة التصنيفات</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {categories.map((c) => (
            <div
              key={c.id}
              className="flex flex-col lg:flex-row lg:items-end gap-4 p-4 rounded-lg border border-border bg-card"
            >
              <form action={updateCategory} className="flex-1 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                <input type="hidden" name="id" value={c.id} />
                <div className="space-y-2">
                  <Label>الاسم (عربي)</Label>
                  <Input name="nameAr" defaultValue={c.nameAr} required />
                </div>
                <div className="space-y-2">
                  <Label>الاسم (إنجليزي)</Label>
                  <Input name="nameEn" defaultValue={c.nameEn} required dir="ltr" className="text-start" />
                </div>
                <div className="space-y-2">
                  <Label>الترتيب</Label>
                  <Input name="sortOrder" type="number" defaultValue={c.sortOrder} />
                </div>
                <div className="flex items-center gap-2 h-10">
                  <input type="checkbox" name="isActive" defaultChecked={c.isActive} className="size-4" />
                  <span className="text-sm">نشط</span>
                </div>
                <div className="sm:col-span-2 lg:col-span-4">
                  <Button type="submit" size="sm" variant="secondary">
                    حفظ التعديلات
                  </Button>
                </div>
              </form>
              <form action={deleteCategory}>
                <input type="hidden" name="id" value={c.id} />
                <Button type="submit" size="sm" variant="destructive">
                  حذف
                </Button>
              </form>
            </div>
          ))}
          {categories.length === 0 ? (
            <p className="text-sm text-muted-foreground">لا توجد تصنيفات بعد.</p>
          ) : null}
        </CardContent>
      </Card>
    </div>
  );
}
