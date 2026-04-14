import type { CheckoutDisplayPayload } from '@/lib/checkout-types';

export type CheckoutWhatsAppInput = {
  restaurantNameAr: string;
  orderId: string;
  customerName: string;
  customerPhone: string;
  orderType: 'delivery' | 'pickup';
  addressLine: string;
  deliveryNotes: string;
  paymentMethod: 'cash' | 'online';
  display: CheckoutDisplayPayload;
};

/** Arabic WhatsApp body; totals match server-validated checkout. */
export function buildCheckoutWhatsAppMessage(p: CheckoutWhatsAppInput): string {
  const lines: string[] = [];
  lines.push('==============================');
  lines.push(`*${p.restaurantNameAr}*`);
  lines.push('*طلب جديد عبر واتساب*');
  lines.push('==============================');
  lines.push('');
  lines.push(`*رقم الطلب:* ${p.orderId.slice(0, 8)}`);
  lines.push('');
  lines.push('*بيانات العميل*');
  lines.push(`- الاسم: ${p.customerName.trim() || 'غير محدد'}`);
  lines.push(`- الجوال: ${p.customerPhone.trim() || 'غير محدد'}`);
  lines.push('');
  lines.push('*تفاصيل الطلب*');
  lines.push(
    `- نوع الطلب: ${p.orderType === 'delivery' ? 'توصيل' : 'استلام من الفرع'}`
  );
  if (p.orderType === 'delivery') {
    if (p.addressLine) lines.push(`- العنوان: ${p.addressLine}`);
    if (p.deliveryNotes.trim()) lines.push(`- ملاحظات التوصيل: ${p.deliveryNotes.trim()}`);
  }
  lines.push(
    `- طريقة الدفع: ${p.paymentMethod === 'cash' ? 'الدفع عند الاستلام' : 'الدفع الإلكتروني'}`
  );
  lines.push('');
  lines.push('*الأصناف*');
  p.display.lines.forEach((line, index) => {
    lines.push(`${index + 1}) ${line.nameSnapshot}`);
    lines.push(`   - الكمية: ${line.quantity}`);
    if (line.optionLabels.length > 0) {
      lines.push(`   - الإضافات: ${line.optionLabels.join('، ')}`);
    }
    lines.push(`   - إجمالي الصنف: ${line.lineTotalSar} ر.س`);
    lines.push('');
  });
  lines.push('*الملخص المالي*');
  lines.push(`- المجموع الفرعي: ${p.display.subtotalSar} ر.س`);
  lines.push(
    `- رسوم التوصيل: ${p.orderType === 'delivery' ? `${p.display.deliveryFeeSar} ر.س` : '0 ر.س'}`
  );
  lines.push(`- الإجمالي: ${p.display.totalSar} ر.س`);
  return lines.join('\n');
}
