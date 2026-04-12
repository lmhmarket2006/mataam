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
  const { orderType, address, buildingNo, floorNo, apartmentNo, customerPhone, deliveryNotes, paymentMethod, getDeliveryFee } = useDelivery();
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [showDelivery, setShowDelivery] = useState(false);

  const subtotal = getTotal();
  const deliveryFee = getDeliveryFee(subtotal);
  const total = subtotal + deliveryFee;
  const itemCount = getItemCount();
  const isEmpty = items.length === 0;

  const isDeliveryValid = (() => {
    if (isEmpty) return false;
    if (orderType === 'delivery') {
      return address.trim().length >= 3 && customerPhone.length >= 10;
    }
    return true;
  })();

  const formatWhatsAppMessage = useCallback(() => {
    const lines: string[] = [];
    lines.push('🍽️ طلب جديد من مطعم الواحة');
    lines.push('');
    lines.push(`📦 نوع الطلب: ${orderType === 'delivery' ? '🚗 توصيل' : '🏪 استلام'}`);
    lines.push('');
    if (orderType === 'delivery') {
      lines.push('📍 تفاصيل التوصيل:');
      lines.push(`   العنوان: ${address}`);
      if (buildingNo) lines.push(`   رقم المبنى: ${buildingNo}`);
      if (floorNo) lines.push(`   الطابق: ${floorNo}`);
      if (apartmentNo) lines.push(`   الشقة: ${apartmentNo}`);
      lines.push(`   الجوال: ${customerPhone}`);
      if (deliveryNotes) lines.push(`   ملاحظات: ${deliveryNotes}`);
    }
    lines.push(`💳 طريقة الدفع: ${paymentMethod === 'cash' ? 'الدفع عند الاستلام' : 'الدفع الإلكتروني'}`);
    lines.push('');
    lines.push('📋 الأصناف:');
    items.forEach((item, index) => {
      const variantOption = item.options.find(
        (o) => o.type === 'riceType' || o.type === 'quantity'
      );
      const variantLabel = variantOption ? ` - ${variantOption.value}` : '';
      lines.push(`${index + 1}. ${item.name}${variantLabel} × ${item.quantity} = ${item.totalPrice} ر.س`);
      const extrasOptions = item.options.filter((o) => o.type === 'extras');
      if (extrasOptions.length > 0) {
        const extrasNames = extrasOptions.map((o) => o.value).join('، ');
        lines.push(`   الإضافات: ${extrasNames}`);
      }
      if (item.notes) {
        lines.push(`   ملاحظات: ${item.notes}`);
      }
    });
    lines.push('');
    lines.push(`💰 المجموع: ${subtotal} ر.س`);
    if (deliveryFee > 0) {
      lines.push(`🚗 رسوم التوصيل: ${deliveryFee} ر.س`);
    } else if (orderType === 'delivery') {
      lines.push('🚗 التوصيل: مجاناً ✅');
    }
    lines.push(`💵 الإجمالي: ${total} ر.س`);
    return lines.join('\n');
  }, [items, total, subtotal, deliveryFee, orderType, address, buildingNo, floorNo, apartmentNo, customerPhone, deliveryNotes, paymentMethod]);

  const handleWhatsAppCheckout = useCallback(() => {
    const message = formatWhatsAppMessage();
    const encodedMessage = encodeURIComponent(message);
    const url = `https://wa.me/966548599988?text=${encodedMessage}`;
    window.open(url, '_blank');
  }, [formatWhatsAppMessage]);

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
    const variantOption = item.options.find(
      (o) => o.type === 'riceType' || o.type === 'quantity'
    );
    return variantOption?.value ?? '';
  }, []);

  const getItemExtrasText = useCallback((item: CartItem) => {
    const extrasOptions = item.options.filter((o) => o.type === 'extras');
    if (extrasOptions.length === 0) return '';
    return extrasOptions.map((o) => o.value).join('، ');
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
          {locale === 'ar' ? 'يرجى إدخال العنوان ورقم الجوال' : 'Please enter address and phone number'}
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
      <Button
        onClick={handleWhatsAppCheckout}
        disabled={!isDeliveryValid}
        className="w-full h-12 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] disabled:bg-muted disabled:text-muted-foreground text-white text-sm font-bold shadow-lg shadow-[#25D366]/20 transition-all"
        size="lg"
      >
        <MessageCircle className="w-5 h-5" />
        {t(locale, 'checkoutWhatsApp')}
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
        <div className="flex-1 min-h-0 overflow-y-auto">
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
