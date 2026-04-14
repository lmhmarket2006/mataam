import Link from 'next/link';
import { db } from '@/lib/db';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { createBranch, deleteBranch, updateBranch } from './actions';

export default async function AdminBranchesPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const sp = await searchParams;
  const branches = await db.branch.findMany({ orderBy: { sortOrder: 'asc' } });

  const errMsg =
    sp.error === 'missing'
      ? 'يرجى تعبئة الحقول المطلوبة (الاسم، العنوان، الهاتف، الإحداثيات).'
      : sp.error === 'id'
        ? 'معرّف غير صالح.'
        : null;

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <h1 className="text-2xl font-bold">الفروع</h1>
        <Button variant="outline" asChild>
          <Link href="/admin">رجوع</Link>
        </Button>
      </div>

      {errMsg ? <p className="text-sm text-destructive">{errMsg}</p> : null}

      <Card>
        <CardHeader>
          <CardTitle>إضافة فرع</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={createBranch} className="flex flex-col gap-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="new-nameAr">الاسم (عربي)</Label>
                <Input id="new-nameAr" name="nameAr" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="new-nameEn">الاسم (إنجليزي)</Label>
                <Input id="new-nameEn" name="nameEn" required dir="ltr" className="text-start" />
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="new-addressAr">العنوان (عربي)</Label>
                <Input id="new-addressAr" name="addressAr" required />
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="new-addressEn">العنوان (إنجليزي)</Label>
                <Input id="new-addressEn" name="addressEn" required dir="ltr" className="text-start" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="new-cityAr">المدينة (عربي)</Label>
                <Input id="new-cityAr" name="cityAr" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="new-cityEn">المدينة (إنجليزي)</Label>
                <Input id="new-cityEn" name="cityEn" dir="ltr" className="text-start" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="new-phone">الهاتف</Label>
                <Input id="new-phone" name="phone" required dir="ltr" className="text-start" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="new-sort">الترتيب</Label>
                <Input id="new-sort" name="sortOrder" type="number" defaultValue={0} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="new-hoursAr">ساعات العمل (عربي)</Label>
                <Input id="new-hoursAr" name="hoursAr" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="new-hoursEn">ساعات العمل (إنجليزي)</Label>
                <Input id="new-hoursEn" name="hoursEn" dir="ltr" className="text-start" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="new-lat">خط العرض (lat)</Label>
                <Input id="new-lat" name="lat" type="number" step="any" required dir="ltr" className="text-start" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="new-lng">خط الطول (lng)</Label>
                <Input id="new-lng" name="lng" type="number" step="any" required dir="ltr" className="text-start" />
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
          <CardTitle>قائمة الفروع</CardTitle>
        </CardHeader>
        <CardContent className="space-y-8">
          {branches.length === 0 ? (
            <p className="text-sm text-muted-foreground">لا توجد فروع بعد.</p>
          ) : null}
          {branches.map((b) => (
            <div key={b.id} className="space-y-4 p-4 rounded-lg border border-border bg-card">
              <form action={updateBranch} className="grid gap-3 sm:grid-cols-2">
                <input type="hidden" name="id" value={b.id} />
                <div className="space-y-2">
                  <Label>الاسم (عربي)</Label>
                  <Input name="nameAr" defaultValue={b.nameAr} required />
                </div>
                <div className="space-y-2">
                  <Label>الاسم (إنجليزي)</Label>
                  <Input name="nameEn" defaultValue={b.nameEn} required dir="ltr" className="text-start" />
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <Label>العنوان (عربي)</Label>
                  <Input name="addressAr" defaultValue={b.addressAr} required />
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <Label>العنوان (إنجليزي)</Label>
                  <Input name="addressEn" defaultValue={b.addressEn} required dir="ltr" className="text-start" />
                </div>
                <div className="space-y-2">
                  <Label>المدينة (عربي)</Label>
                  <Input name="cityAr" defaultValue={b.cityAr ?? ''} />
                </div>
                <div className="space-y-2">
                  <Label>المدينة (إنجليزي)</Label>
                  <Input name="cityEn" defaultValue={b.cityEn ?? ''} dir="ltr" className="text-start" />
                </div>
                <div className="space-y-2">
                  <Label>الهاتف</Label>
                  <Input name="phone" defaultValue={b.phone} required dir="ltr" className="text-start" />
                </div>
                <div className="space-y-2">
                  <Label>الترتيب</Label>
                  <Input name="sortOrder" type="number" defaultValue={b.sortOrder} />
                </div>
                <div className="space-y-2">
                  <Label>ساعات العمل (عربي)</Label>
                  <Input name="hoursAr" defaultValue={b.hoursAr ?? ''} />
                </div>
                <div className="space-y-2">
                  <Label>ساعات العمل (إنجليزي)</Label>
                  <Input name="hoursEn" defaultValue={b.hoursEn ?? ''} dir="ltr" className="text-start" />
                </div>
                <div className="space-y-2">
                  <Label>lat</Label>
                  <Input name="lat" type="number" step="any" defaultValue={b.lat} required dir="ltr" className="text-start" />
                </div>
                <div className="space-y-2">
                  <Label>lng</Label>
                  <Input name="lng" type="number" step="any" defaultValue={b.lng} required dir="ltr" className="text-start" />
                </div>
                <div className="flex items-end gap-2 pb-2">
                  <input type="checkbox" name="isActive" id={`active-${b.id}`} defaultChecked={b.isActive} className="size-4" />
                  <Label htmlFor={`active-${b.id}`}>نشط</Label>
                </div>
                <div className="sm:col-span-2 flex flex-wrap gap-2">
                  <Button type="submit">حفظ</Button>
                </div>
              </form>
              <form action={deleteBranch}>
                <input type="hidden" name="id" value={b.id} />
                <Button type="submit" variant="destructive" size="sm">
                  حذف الفرع
                </Button>
              </form>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
