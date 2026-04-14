import Link from 'next/link';
import { notFound } from 'next/navigation';
import { OptionSelectionType } from '@prisma/client';
import { db } from '@/lib/db';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { halalasToSar } from '@/lib/money';
import {
  createOptionGroup,
  createOptionValue,
  deleteOptionGroup,
  deleteOptionValue,
  updateOptionGroup,
  updateOptionValue,
} from './actions';

const SELECTION_LABEL: Record<OptionSelectionType, string> = {
  SINGLE: 'اختيار واحد',
  MULTIPLE: 'متعدد',
};

export default async function MenuItemOptionsPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string }>;
}) {
  const { id: menuItemId } = await params;
  const sp = await searchParams;

  const item = await db.menuItem.findUnique({
    where: { id: menuItemId },
    include: {
      category: { select: { nameAr: true } },
      optionGroups: {
        orderBy: { sortOrder: 'asc' },
        include: { values: { orderBy: { sortOrder: 'asc' } } },
      },
    },
  });

  if (!item) notFound();

  const errMsg =
    sp.error === 'missing'
      ? 'يرجى تعبئة الحقول المطلوبة.'
      : sp.error === 'price'
        ? 'سعر الإضافة غير صالح.'
        : sp.error === 'group' || sp.error === 'value'
          ? 'تعذر العثور على المجموعة أو القيمة.'
          : null;

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold">إضافات الصنف</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {item.nameAr} · {item.category.nameAr}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link href={`/admin/menu/${menuItemId}/edit`}>تعديل الصنف</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/admin/menu">المنيو</Link>
          </Button>
        </div>
      </div>

      {errMsg ? <p className="text-sm text-destructive">{errMsg}</p> : null}

      <Card>
        <CardHeader>
          <CardTitle>إضافة مجموعة خيارات</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={createOptionGroup} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <input type="hidden" name="menuItemId" value={menuItemId} />
            <div className="space-y-2">
              <Label htmlFor="g-nameAr">اسم المجموعة (عربي)</Label>
              <Input id="g-nameAr" name="nameAr" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="g-nameEn">اسم المجموعة (إنجليزي)</Label>
              <Input id="g-nameEn" name="nameEn" required dir="ltr" className="text-start" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="g-type">نوع الاختيار</Label>
              <select
                id="g-type"
                name="selectionType"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                defaultValue="SINGLE"
              >
                {(Object.keys(SELECTION_LABEL) as OptionSelectionType[]).map((k) => (
                  <option key={k} value={k}>
                    {SELECTION_LABEL[k]}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="g-min">الحد الأدنى للاختيار (اختياري)</Label>
              <Input id="g-min" name="minSelect" type="number" min={0} dir="ltr" className="text-start" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="g-max">الحد الأقصى للاختيار (اختياري)</Label>
              <Input id="g-max" name="maxSelect" type="number" min={0} dir="ltr" className="text-start" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="g-sort">الترتيب</Label>
              <Input id="g-sort" name="sortOrder" type="number" defaultValue={0} dir="ltr" className="text-start" />
            </div>
            <div className="flex items-end gap-2 pb-2">
              <input type="checkbox" name="isRequired" id="g-req" className="size-4" />
              <Label htmlFor="g-req">إلزامي</Label>
            </div>
            <div className="sm:col-span-2 lg:col-span-3">
              <Button type="submit">إنشاء المجموعة</Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {item.optionGroups.length === 0 ? (
        <p className="text-sm text-muted-foreground">لا توجد مجموعات خيارات بعد.</p>
      ) : null}

      {item.optionGroups.map((g) => (
        <Card key={g.id}>
          <CardHeader className="flex flex-row flex-wrap items-start justify-between gap-4">
            <CardTitle className="text-lg">
              {g.nameAr}{' '}
              <span className="text-muted-foreground font-normal text-sm dir-ltr">({g.nameEn})</span>
            </CardTitle>
            <form action={deleteOptionGroup}>
              <input type="hidden" name="menuItemId" value={menuItemId} />
              <input type="hidden" name="id" value={g.id} />
              <Button type="submit" variant="destructive" size="sm">
                حذف المجموعة
              </Button>
            </form>
          </CardHeader>
          <CardContent className="space-y-8">
            <form action={updateOptionGroup} className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 border-b border-border pb-6">
              <input type="hidden" name="menuItemId" value={menuItemId} />
              <input type="hidden" name="id" value={g.id} />
              <div className="space-y-2">
                <Label>اسم المجموعة (عربي)</Label>
                <Input name="nameAr" defaultValue={g.nameAr} required />
              </div>
              <div className="space-y-2">
                <Label>اسم المجموعة (إنجليزي)</Label>
                <Input name="nameEn" defaultValue={g.nameEn} required dir="ltr" className="text-start" />
              </div>
              <div className="space-y-2">
                <Label>نوع الاختيار</Label>
                <select
                  name="selectionType"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  defaultValue={g.selectionType}
                >
                  {(Object.keys(SELECTION_LABEL) as OptionSelectionType[]).map((k) => (
                    <option key={k} value={k}>
                      {SELECTION_LABEL[k]}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <Label>الحد الأدنى</Label>
                <Input name="minSelect" type="number" min={0} defaultValue={g.minSelect ?? ''} dir="ltr" className="text-start" />
              </div>
              <div className="space-y-2">
                <Label>الحد الأقصى</Label>
                <Input name="maxSelect" type="number" min={0} defaultValue={g.maxSelect ?? ''} dir="ltr" className="text-start" />
              </div>
              <div className="space-y-2">
                <Label>الترتيب</Label>
                <Input name="sortOrder" type="number" defaultValue={g.sortOrder} dir="ltr" className="text-start" />
              </div>
              <div className="flex items-end gap-2 pb-2">
                <input type="checkbox" name="isRequired" id={`req-${g.id}`} defaultChecked={g.isRequired} className="size-4" />
                <Label htmlFor={`req-${g.id}`}>إلزامي</Label>
              </div>
              <div className="sm:col-span-2 lg:col-span-3">
                <Button type="submit" size="sm">
                  حفظ المجموعة
                </Button>
              </div>
            </form>

            <div>
              <h3 className="text-sm font-semibold mb-3">قيم الخيار</h3>
              <form action={createOptionValue} className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 mb-6 p-4 rounded-lg bg-muted/40">
                <input type="hidden" name="menuItemId" value={menuItemId} />
                <input type="hidden" name="optionGroupId" value={g.id} />
                <div className="space-y-2">
                  <Label>قيمة (عربي)</Label>
                  <Input name="nameAr" required />
                </div>
                <div className="space-y-2">
                  <Label>قيمة (إنجليزي)</Label>
                  <Input name="nameEn" required dir="ltr" className="text-start" />
                </div>
                <div className="space-y-2">
                  <Label>سعر إضافي (ر.س)</Label>
                  <Input name="priceModifierSar" defaultValue="0" required dir="ltr" className="text-start" />
                </div>
                <div className="space-y-2">
                  <Label>الترتيب</Label>
                  <Input name="sortOrder" type="number" defaultValue={0} dir="ltr" className="text-start" />
                </div>
                <div className="sm:col-span-2 lg:col-span-4">
                  <Button type="submit" size="sm" variant="secondary">
                    إضافة قيمة
                  </Button>
                </div>
              </form>

              <div className="space-y-4">
                {g.values.length === 0 ? (
                  <p className="text-xs text-muted-foreground">لا توجد قيم في هذه المجموعة.</p>
                ) : null}
                {g.values.map((v) => {
                  const sar = halalasToSar(v.priceModifier).toFixed(2);
                  return (
                    <div key={v.id} className="flex flex-col lg:flex-row gap-4 p-3 rounded-md border border-border">
                      <form action={updateOptionValue} className="flex-1 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
                        <input type="hidden" name="menuItemId" value={menuItemId} />
                        <input type="hidden" name="id" value={v.id} />
                        <div className="space-y-1">
                          <Label className="text-xs">عربي</Label>
                          <Input name="nameAr" defaultValue={v.nameAr} required />
                        </div>
                        <div className="space-y-1">
                          <Label className="text-xs">إنجليزي</Label>
                          <Input name="nameEn" defaultValue={v.nameEn} required dir="ltr" className="text-start" />
                        </div>
                        <div className="space-y-1">
                          <Label className="text-xs">سعر إضافي (ر.س)</Label>
                          <Input name="priceModifierSar" defaultValue={sar} required dir="ltr" className="text-start" />
                        </div>
                        <div className="space-y-1">
                          <Label className="text-xs">الترتيب</Label>
                          <Input name="sortOrder" type="number" defaultValue={v.sortOrder} dir="ltr" className="text-start" />
                        </div>
                        <div className="sm:col-span-2 lg:col-span-4">
                          <Button type="submit" size="sm">
                            حفظ القيمة
                          </Button>
                        </div>
                      </form>
                      <form action={deleteOptionValue} className="flex items-start">
                        <input type="hidden" name="menuItemId" value={menuItemId} />
                        <input type="hidden" name="id" value={v.id} />
                        <Button type="submit" variant="outline" size="sm" className="text-destructive border-destructive/50">
                          حذف
                        </Button>
                      </form>
                    </div>
                  );
                })}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
