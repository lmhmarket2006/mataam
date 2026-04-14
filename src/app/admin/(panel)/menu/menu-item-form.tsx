import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

type CategoryOption = { id: string; nameAr: string };

export type MenuItemFormDefaults = {
  id?: string;
  categoryId: string;
  nameAr: string;
  nameEn: string;
  descriptionAr: string;
  descriptionEn: string;
  priceSar: string;
  image: string;
  available: boolean;
  sortOrder: number;
};

export function MenuItemForm({
  categories,
  defaults,
  action,
  submitLabel,
}: {
  categories: CategoryOption[];
  defaults: MenuItemFormDefaults;
  action: (formData: FormData) => Promise<void>;
  submitLabel: string;
}) {
  return (
    <form action={action} className="space-y-6 max-w-xl">
      {defaults.id ? <input type="hidden" name="id" value={defaults.id} /> : null}
      <div className="space-y-2">
        <Label htmlFor="categoryId">التصنيف</Label>
        <select
          id="categoryId"
          name="categoryId"
          required
          defaultValue={defaults.categoryId}
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <option value="">— اختر —</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.nameAr}
            </option>
          ))}
        </select>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="nameAr">الاسم (عربي)</Label>
          <Input id="nameAr" name="nameAr" defaultValue={defaults.nameAr} required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="nameEn">الاسم (إنجليزي)</Label>
          <Input
            id="nameEn"
            name="nameEn"
            defaultValue={defaults.nameEn}
            required
            dir="ltr"
            className="text-start"
          />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="descriptionAr">الوصف (عربي)</Label>
        <Textarea id="descriptionAr" name="descriptionAr" defaultValue={defaults.descriptionAr} rows={3} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="descriptionEn">الوصف (إنجليزي)</Label>
        <Textarea
          id="descriptionEn"
          name="descriptionEn"
          defaultValue={defaults.descriptionEn}
          rows={3}
          dir="ltr"
          className="text-start"
        />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="priceSar">السعر (ر.س)</Label>
          <Input
            id="priceSar"
            name="priceSar"
            type="text"
            inputMode="decimal"
            defaultValue={defaults.priceSar}
            required
            dir="ltr"
            className="text-start tabular-nums"
            placeholder="35.00"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="sortOrder">الترتيب</Label>
          <Input
            id="sortOrder"
            name="sortOrder"
            type="number"
            defaultValue={defaults.sortOrder}
          />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="image">رابط الصورة (اختياري)</Label>
        <Input
          id="image"
          name="image"
          defaultValue={defaults.image}
          dir="ltr"
          className="text-start"
          placeholder="/images/..."
        />
      </div>
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          name="available"
          id="available"
          defaultChecked={defaults.available}
          className="size-4"
        />
        <Label htmlFor="available">متاح للبيع</Label>
      </div>
      <Button type="submit">{submitLabel}</Button>
    </form>
  );
}
