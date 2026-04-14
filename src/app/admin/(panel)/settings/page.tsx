import Link from 'next/link';
import { db } from '@/lib/db';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { halalasToSar } from '@/lib/money';
import { updateRestaurantSettings } from './actions';

export default async function AdminSettingsPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const sp = await searchParams;
  const row = await db.restaurantSettings.findUnique({ where: { id: 'default' } });
  const s = row ?? {
    nameAr: '',
    nameEn: '',
    logo: null as string | null,
    currency: 'SAR',
    whatsappNumber: null as string | null,
    defaultPickupAddressAr: null as string | null,
    defaultPickupAddressEn: null as string | null,
    deliveryFeeAmount: 0,
    freeDeliveryMinTotal: 0,
  };

  const errMsg =
    sp.error === 'missing'
      ? 'يرجى تعبئة اسم المطعم بالعربي والإنجليزي.'
      : sp.error === 'price'
        ? 'قيمة الرسوم أو الحد الأدنى غير صالحة.'
        : null;

  const deliveryFeeSar = halalasToSar(s.deliveryFeeAmount).toFixed(2);
  const freeMinSar = halalasToSar(s.freeDeliveryMinTotal).toFixed(2);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <h1 className="text-2xl font-bold">إعدادات المطعم</h1>
        <Button variant="outline" asChild>
          <Link href="/admin">رجوع</Link>
        </Button>
      </div>

      {errMsg ? <p className="text-sm text-destructive">{errMsg}</p> : null}

      <Card>
        <CardHeader>
          <CardTitle>البيانات العامة</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={updateRestaurantSettings} className="flex flex-col gap-4 max-w-2xl">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="nameAr">اسم المطعم (عربي)</Label>
                <Input id="nameAr" name="nameAr" defaultValue={s.nameAr} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="nameEn">اسم المطعم (إنجليزي)</Label>
                <Input id="nameEn" name="nameEn" defaultValue={s.nameEn} required dir="ltr" className="text-start" />
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="logo">رابط الشعار (URL)</Label>
                <Input id="logo" name="logo" defaultValue={s.logo ?? ''} dir="ltr" className="text-start" placeholder="https://..." />
              </div>
              <div className="space-y-2">
                <Label htmlFor="currency">العملة</Label>
                <Input id="currency" name="currency" defaultValue={s.currency} dir="ltr" className="text-start" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="whatsappNumber">واتساب (رقم بدون +)</Label>
                <Input id="whatsappNumber" name="whatsappNumber" defaultValue={s.whatsappNumber ?? ''} dir="ltr" className="text-start" />
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="defaultPickupAddressAr">عنوان الاستلام الافتراضي (عربي)</Label>
                <Input id="defaultPickupAddressAr" name="defaultPickupAddressAr" defaultValue={s.defaultPickupAddressAr ?? ''} />
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="defaultPickupAddressEn">عنوان الاستلام الافتراضي (إنجليزي)</Label>
                <Input
                  id="defaultPickupAddressEn"
                  name="defaultPickupAddressEn"
                  defaultValue={s.defaultPickupAddressEn ?? ''}
                  dir="ltr"
                  className="text-start"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="deliveryFeeSar">رسوم التوصيل (ر.س)</Label>
                <Input id="deliveryFeeSar" name="deliveryFeeSar" defaultValue={deliveryFeeSar} required dir="ltr" className="text-start" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="freeDeliveryMinTotalSar">الحد الأدنى للطلب لإلغاء رسوم التوصيل (ر.س)</Label>
                <Input
                  id="freeDeliveryMinTotalSar"
                  name="freeDeliveryMinTotalSar"
                  defaultValue={freeMinSar}
                  required
                  dir="ltr"
                  className="text-start"
                />
              </div>
            </div>
            <Button type="submit" className="w-fit">
              حفظ الإعدادات
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
