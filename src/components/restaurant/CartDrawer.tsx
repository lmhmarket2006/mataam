'use client';

import React, { useCallback, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShoppingBag,
  Plus,
  Minus,
  Trash2,
  MessageCircle,
  ChevronRight,
  AlertCircle,
  Truck,
  Copy,
  ExternalLink,
} from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useCart, useDelivery, useLanguage, useNavigation, type CartItem } from '@/lib/store';
import { t } from '@/lib/i18n';
import DeliveryInfo from './DeliveryInfo';
import { useRestaurantData } from '@/contexts/restaurant-data-context';
import type { CheckoutDisplayPayload } from '@/lib/checkout-types';
import { buildCheckoutWhatsAppMessage } from '@/lib/checkout-whatsapp-message';

function checkoutApiErrorMessage(error: string, locale: 'ar' | 'en'): string {
  if (error === 'rate_limited') {
    return locale === 'ar'
      ? 'يرجى الانتظار دقيقة قبل إرسال طلب آخر من نفس الجوال.\nPlease wait a minute before placing another order with this phone.'
      : 'Please wait a minute before placing another order with this phone.\nيرجى الانتظار دقيقة قبل إرسال طلب آخر من نفس الجوال.';
  }
  if (error === 'invalid_item') {
    return locale === 'ar'
      ? 'أحد الأصناف لم يعد متوفرًا. أزل الصنف من السلة أو حدّث القائمة.\nAn item is no longer available. Remove it from your cart or refresh the menu.'
      : 'An item is no longer available. Remove it from your cart or refresh the menu.\nأحد الأصناف لم يعد متوفرًا. أزل الصنف من السلة أو حدّث القائمة.';
  }
  if (error === 'invalid_options') {
    return locale === 'ar'
      ? 'خيارات غير صالحة. افتح الصنف وأعد اختيار الإضافات.\nInvalid options. Open the item and select your choices again.'
      : 'Invalid options. Open the item and select your choices again.\nخيارات غير صالحة. افتح الصنف وأعد اختيار الإضافات.';
  }
  return locale === 'ar'
    ? 'تعذر إتمام الطلب. تحقق من السلة وحاول مرة أخرى.\nCould not place the order. Check your cart and try again.'
    : 'Could not place the order. Check your cart and try again.\nتعذر إتمام الطلب. تحقق من السلة وحاول مرة أخرى.';
}

export default function CartDrawer() {
  const {
    items,
    isOpen,
    closeCart,
    removeItem,
    updateQuantity,
    clearCart,
    getTotal,
    getItemCount,
  } = useCart();
  const { locale, isRTL } = useLanguage();
  const { navigate } = useNavigation();
  const {
    orderType,
    customerName,
    address,
    buildingNo,
    floorNo,
    apartmentNo,
    customerPhone,
    deliveryNotes,
    paymentMethod,
    getDeliveryFee,
  } = useDelivery();
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [showDelivery, setShowDelivery] = useState(false);
  const [checkoutBusy, setCheckoutBusy] = useState(false);
  const [checkoutErr, setCheckoutErr] = useState<string | null>(null);
  const [waFallback, setWaFallback] = useState<{ url: string; plainMessage: string } | null>(null);
  const [copyDone, setCopyDone] = useState(false);
  const { settings } = useRestaurantData();

  const subtotal = getTotal();
  const deliveryFee = getDeliveryFee(subtotal);
  const total = subtotal + deliveryFee;
  const itemCount = getItemCount();
  const isEmpty = items.length === 0;

  const isDeliveryValid = (() => {
    if (isEmpty) return false;
    const hasName = customerName.trim().length >= 2;
    const hasPhone = customerPhone.trim().length >= 10;
    if (orderType === 'delivery') {
      return hasName && hasPhone && address.trim().length >= 3;
    }
    return hasName && hasPhone;
  })();

  const handleWhatsAppCheckout = useCallback(async () => {
    setCheckoutErr(null);
    setWaFallback(null);
    setCopyDone(false);
    const lines = items.map((item) => ({
      menuItemId: item.menuItemId,
      quantity: item.quantity,
      notes: item.notes,
      optionValueIds: item.options
        .filter((o) => o.type === 'optionGroup' && o.optionValueId)
        .map((o) => o.optionValueId!),
    }));

    setCheckoutBusy(true);
    try {
      const res = await fetch('/api/orders/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName,
          customerPhone,
          orderType,
          address,
          buildingNo,
          floorNo,
          apartmentNo,
          deliveryNotes,
          paymentMethod,
          lines,
        }),
      });
      const rawText = await res.text();
      let data: unknown;
      try {
        data = rawText ? JSON.parse(rawText) : {};
      } catch {
        setCheckoutErr(
          locale === 'ar'
            ? 'استجابة غير صالحة من الخادم. حاول مرة أخرى.\nInvalid server response. Please try again.'
            : 'Invalid server response. Please try again.\nاستجابة غير صالحة من الخادم. حاول مرة أخرى.'
        );
        return;
      }
      const payload = data as
        | { ok: true; orderId: string; display: CheckoutDisplayPayload }
        | { ok: false; error?: string };

      if (!payload || typeof payload !== 'object' || !('ok' in payload) || !payload.ok) {
        const code = typeof (payload as { error?: string })?.error === 'string' ? (payload as { error: string }).error : '';
        setCheckoutErr(checkoutApiErrorMessage(code, locale));
        return;
      }

      const envNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER?.trim() ?? '';
      const fromSettings = settings.whatsappNumber?.replace(/\D/g, '') ?? '';
      const safeNumber =
        envNumber !== '' ? envNumber.replace(/\D/g, '') : fromSettings !== '' ? fromSettings : '966500000000';

      const addrParts: string[] = [];
      if (address.trim()) addrParts.push(address.trim());
      if (buildingNo.trim()) addrParts.push(`مبنى ${buildingNo.trim()}`);
      if (floorNo.trim()) addrParts.push(`طابق ${floorNo.trim()}`);
      if (apartmentNo.trim()) addrParts.push(`شقة ${apartmentNo.trim()}`);
      const addressLine = addrParts.join(' - ');

      const message = buildCheckoutWhatsAppMessage({
        restaurantNameAr: settings.nameAr,
        orderId: payload.orderId,
        customerName,
        customerPhone,
        orderType,
        addressLine,
        deliveryNotes,
        paymentMethod,
        display: payload.display,
      });
      const encodedMessage = encodeURIComponent(message);
      const waUrl = `https://wa.me/${safeNumber}?text=${encodedMessage}`;
      const win = window.open(waUrl, '_blank', 'noopener,noreferrer');
      if (!win) {
        setCheckoutErr(
          locale === 'ar'
            ? 'المتصفح منع فتح واتساب. يمكنك فتح الرابط يدويًا أو نسخ الرسالة.\nYour browser blocked the popup. Open the link manually or copy the message.'
            : 'Your browser blocked the popup. Open the link manually or copy the message.\nالمتصفح منع فتح واتساب. يمكنك فتح الرابط يدويًا أو نسخ الرسالة.'
        );
        setWaFallback({ url: waUrl, plainMessage: message });
        return;
      }
      clearCart();
    } catch {
      setCheckoutErr(
        locale === 'ar'
          ? 'حدث خطأ في الشبكة. حاول مرة أخرى.\nNetwork error. Try again.'
          : 'Network error. Try again.\nحدث خطأ في الشبكة. حاول مرة أخرى.'
      );
    } finally {
      setCheckoutBusy(false);
    }
  }, [
    items,
    customerName,
    customerPhone,
    orderType,
    address,
    buildingNo,
    floorNo,
    apartmentNo,
    deliveryNotes,
    paymentMethod,
    settings.whatsappNumber,
    settings.nameAr,
    clearCart,
    locale,
  ]);

  const handleClearCart = useCallback(() => {
    if (showClearConfirm) {
      clearCart();
      setShowClearConfirm(false);
    } else {
      setShowClearConfirm(true);
      setTimeout(() => setShowClearConfirm(false), 3000);
    }
  }, [showClearConfirm, clearCart]);

  const getItemVariantLabel = useCallback((item: CartItem) => {
    const groupOpts = item.options.filter((o) => o.type === 'optionGroup');
    if (groupOpts.length > 0) return groupOpts[0].value;
    const variantOption = item.options.find((o) => o.type === 'riceType' || o.type === 'quantity');
    return variantOption?.value ?? '';
  }, []);

  const getItemExtrasText = useCallback((item: CartItem) => {
    const groupOpts = item.options.filter((o) => o.type === 'optionGroup');
    const tail = groupOpts.slice(1).map((o) => o.value);
    const extrasOptions = item.options.filter((o) => o.type === 'extras');
    const legacy = extrasOptions.map((o) => o.value);
    const all = [...tail, ...legacy];
    if (all.length === 0) return '';
    return all.join('، ');
  }, []);

  // Render cart footer (price + checkout button) — always sticky
  const renderFooter = () => (
    <SheetFooter className="border-t border-border bg-background/95 backdrop-blur-sm px-4 sm:px-6 py-4 gap-3 shrink-0">
      {orderType === 'delivery' && !isDeliveryValid && showDelivery && (
        <motion.p
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-xs text-destructive flex items-center gap-1.5 px-1"
        >
          <AlertCircle className="size-3" />
          {locale === 'ar' ? 'يرجى إدخال الاسم والجوال، وللتوصيل أضف العنوان' : 'Please enter name and phone; add address for delivery'}
        </motion.p>
      )}
      <div className="space-y-1.5 w-full">
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground">{t(locale, 'subtotal')}</span>
          <span className="text-sm font-medium text-foreground tabular-nums">{subtotal} {t(locale, 'sar')}</span>
        </div>
        {orderType === 'delivery' && (
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">{t(locale, 'deliveryFee')}</span>
            <span className={`text-sm font-medium tabular-nums ${deliveryFee === 0 ? 'text-green-600' : 'text-foreground'}`}>
              {deliveryFee === 0 ? t(locale, 'freeDelivery') : `${deliveryFee} ${t(locale, 'sar')}`}
            </span>
          </div>
        )}
        <Separator className="!mt-2" />
        <div className="flex items-center justify-between">
          <span className="text-sm font-bold text-foreground">{t(locale, 'totalWithDelivery')}</span>
          <span className="text-xl font-bold text-primary tabular-nums">{total} {t(locale, 'sar')}</span>
        </div>
      </div>
      {checkoutErr ? (
        <p className="text-xs text-destructive px-1 whitespace-pre-line">{checkoutErr}</p>
      ) : null}
      {waFallback ? (
        <div className="flex flex-col gap-2 w-full">
          <a
            href={waFallback.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#25D366]/40 bg-[#25D366]/10 px-3 py-2.5 text-sm font-semibold text-[#128C7E] hover:bg-[#25D366]/15"
          >
            <ExternalLink className="size-4 shrink-0" />
            {locale === 'ar' ? 'فتح واتساب' : 'Open WhatsApp'}
          </a>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="w-full rounded-xl"
            onClick={() => {
              void navigator.clipboard.writeText(waFallback.plainMessage).then(() => {
                setCopyDone(true);
                setTimeout(() => setCopyDone(false), 2000);
              });
            }}
          >
            <Copy className="size-4 shrink-0" />
            {copyDone
              ? locale === 'ar'
                ? 'تم النسخ'
                : 'Copied'
              : locale === 'ar'
                ? 'نسخ الرسالة'
                : 'Copy message'}
          </Button>
        </div>
      ) : null}
      <Button
        onClick={() => void handleWhatsAppCheckout()}
        disabled={!isDeliveryValid || checkoutBusy}
        className="w-full h-12 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] disabled:bg-muted disabled:text-muted-foreground text-white text-sm font-bold shadow-lg shadow-[#25D366]/20 transition-all"
        size="lg"
      >
        <MessageCircle className="w-5 h-5" />
        {checkoutBusy ? (locale === 'ar' ? 'جاري الإرسال...' : 'Sending...') : t(locale, 'checkoutWhatsApp')}
      </Button>
    </SheetFooter>
  );

  return (
    <Sheet open={isOpen} onOpenChange={(open) => { if (!open) closeCart(); }}>
      <SheetContent
        side={isRTL ? 'left' : 'right'}
        className="w-full sm:max-w-md p-0 flex flex-col"
      >
        <SheetHeader className="px-4 sm:px-6 pt-5 pb-3 shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
                <ShoppingBag className="w-5 h-5 text-primary" />
              </div>
              <div>
                <SheetTitle className="text-lg font-bold text-foreground">{t(locale, 'cartTitle')}</SheetTitle>
                {!isEmpty && (
                  <SheetDescription className="text-xs text-muted-foreground mt-0.5">
                    {itemCount} {t(locale, 'items')}
                  </SheetDescription>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2">
              {!isEmpty && (
                <Badge variant="secondary" className="bg-primary/10 text-primary border-0 font-bold text-xs">
                  {itemCount}
                </Badge>
              )}
            </div>
          </div>
        </SheetHeader>

        <Separator className="shrink-0" />

        {/* Body area — always present, scrollable */}
        <div className="flex-1 min-h-0 overflow-y-auto overscroll-contain" style={{ WebkitOverflowScrolling: 'touch' }}>
          {isEmpty ? (
            <div className="flex-1 flex flex-col items-center justify-center px-6 py-12 text-center">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mb-5"
              >
                <ShoppingBag className="w-9 h-9 text-muted-foreground" />
              </motion.div>
              <motion.div initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 }} className="space-y-2">
                <h3 className="text-base font-semibold text-foreground">{t(locale, 'cartEmpty')}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed max-w-[240px]">{t(locale, 'cartEmptyDesc')}</p>
              </motion.div>
              <motion.div initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }} className="mt-6">
                <Button
                  onClick={() => { closeCart(); navigate('menu'); }}
                  variant="outline"
                  className="rounded-xl border-2 border-primary/30 text-primary hover:bg-primary/5 hover:border-primary/50 font-medium"
                >
                  {t(locale, 'goToMenu')}
                  <ChevronRight className="w-4 h-4 rtl:rotate-180" />
                </Button>
              </motion.div>
            </div>
          ) : (
            <>
              {/* Cart Items */}
              <div className="px-4 sm:px-6 py-3 space-y-3">
                <AnimatePresence mode="popLayout">
                  {items.map((item) => (
                    <CartItemCard
                      key={item.cartItemId}
                      item={item}
                      locale={locale}
                      isRTL={isRTL}
                      variantLabel={getItemVariantLabel(item)}
                      extrasText={getItemExtrasText(item)}
                      onQuantityChange={updateQuantity}
                      onRemove={removeItem}
                    />
                  ))}
                </AnimatePresence>
              </div>

              {/* Delivery Toggle */}
              <div className="px-4 sm:px-6 pt-2">
                <Button
                  onClick={() => setShowDelivery(!showDelivery)}
                  variant={showDelivery ? 'default' : 'outline'}
                  className={`w-full rounded-xl text-sm font-medium h-10 transition-all ${
                    showDelivery
                      ? 'bg-primary/10 text-primary border-primary/20 hover:bg-primary/15'
                      : 'border-2 border-dashed border-border hover:border-primary/30'
                  }`}
                >
                  <Truck className="w-4 h-4" />
                  {t(locale, 'deliveryTitle')}
                  {!showDelivery && !isDeliveryValid && orderType === 'delivery' && (
                    <AlertCircle className="w-4 h-4 text-destructive ms-auto" />
                  )}
                </Button>
              </div>

              {/* Delivery Info Panel */}
              <AnimatePresence>
                {showDelivery && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    className="overflow-hidden"
                  >
                    <div className="px-4 sm:px-6 pt-1">
                      <DeliveryInfo subtotal={subtotal} />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Clear Cart */}
              <div className="px-4 sm:px-6 pt-2 pb-4">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={showClearConfirm ? 'confirm' : 'clear'}
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.15 }}
                    className="w-full overflow-hidden"
                  >
                    <Button
                      onClick={handleClearCart}
                      variant={showClearConfirm ? 'destructive' : 'ghost'}
                      className={`w-full rounded-xl text-sm font-medium ${
                        showClearConfirm
                          ? ''
                          : 'text-muted-foreground hover:text-destructive hover:bg-destructive/5'
                      }`}
                      size="sm"
                    >
                      <Trash2 className="w-4 h-4" />
                      {showClearConfirm ? t(locale, 'clearCart') + ' ✓' : t(locale, 'clearCart')}
                    </Button>
                  </motion.div>
                </AnimatePresence>
              </div>
            </>
          )}
        </div>

        {/* Sticky Footer */}
        {!isEmpty && renderFooter()}
      </SheetContent>
    </Sheet>
  );
}

/* ============================================================
   CartItemCard
   ============================================================ */
interface CartItemCardProps {
  item: CartItem;
  locale: 'ar' | 'en';
  isRTL: boolean;
  variantLabel: string;
  extrasText: string;
  onQuantityChange: (cartItemId: string, quantity: number) => void;
  onRemove: (cartItemId: string) => void;
}

function CartItemCard({ item, locale, isRTL, variantLabel, extrasText, onQuantityChange, onRemove }: CartItemCardProps) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, x: isRTL ? 60 : -60, scale: 0.95 }}
      transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
      className="relative flex gap-3 p-3 rounded-2xl border border-border bg-card hover:shadow-sm transition-shadow"
    >
      <div
        className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden shrink-0 bg-muted"
        style={{
          backgroundImage: `url(${item.image})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />
      <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
        <div className="space-y-0.5">
          <div className="flex items-start justify-between gap-2">
            <h4 className="text-sm font-semibold text-foreground leading-tight truncate">{item.name}</h4>
            <button
              onClick={() => onRemove(item.cartItemId)}
              className="shrink-0 w-7 h-7 rounded-lg flex items-center justify-center text-muted-foreground hover:text-destructive hover:bg-destructive/8 transition-colors -mt-0.5"
              aria-label={t(locale, 'removeItem')}
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
          {variantLabel && (
            <p className="text-xs text-primary font-medium leading-tight truncate">{variantLabel}</p>
          )}
          {extrasText && (
            <p className="text-xs text-muted-foreground leading-tight truncate">{extrasText}</p>
          )}
          {item.notes && (
            <p className="text-xs text-gold/80 italic leading-tight truncate">{item.notes}</p>
          )}
        </div>
        <div className="flex items-center justify-between mt-1.5">
          <div className="flex items-center gap-1.5">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => onQuantityChange(item.cartItemId, item.quantity - 1)}
              disabled={item.quantity <= 1}
              className="w-7 h-7 rounded-lg border border-border bg-background flex items-center justify-center text-foreground hover:border-primary/40 hover:bg-primary/5 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <Minus className="w-3 h-3" />
            </motion.button>
            <span className="text-sm font-bold text-foreground min-w-[1.5rem] text-center tabular-nums">{item.quantity}</span>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => onQuantityChange(item.cartItemId, item.quantity + 1)}
              disabled={item.quantity >= 10}
              className="w-7 h-7 rounded-lg border border-border bg-background flex items-center justify-center text-foreground hover:border-primary/40 hover:bg-primary/5 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <Plus className="w-3 h-3" />
            </motion.button>
          </div>
          <span className="text-sm font-bold text-primary tabular-nums">{item.totalPrice} {t(locale, 'sar')}</span>
        </div>
      </div>
    </motion.div>
  );
}
