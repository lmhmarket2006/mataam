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
import { ScrollArea } from '@/components/ui/scroll-area';
import { useCart, useLanguage, useNavigation, type CartItem } from '@/lib/store';
import { t } from '@/lib/i18n';

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
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  const total = getTotal();
  const itemCount = getItemCount();
  const isEmpty = items.length === 0;

  // Format WhatsApp message
  const formatWhatsAppMessage = useCallback(() => {
    const lines: string[] = [];
    lines.push('🍽️ طلب جديد من مطعم الواحة');
    lines.push('');
    lines.push('📋 الأصناف:');

    items.forEach((item, index) => {
      // Find selected variant label from options
      const variantOption = item.options.find(
        (o) => o.type === 'riceType' || o.type === 'quantity'
      );
      const variantLabel = variantOption ? ` - ${variantOption.value}` : '';

      lines.push(
        `${index + 1}. ${item.name}${variantLabel} × ${item.quantity} = ${item.totalPrice} ر.س`
      );

      // Show extras
      const extrasOptions = item.options.filter((o) => o.type === 'extras');
      if (extrasOptions.length > 0) {
        const extrasNames = extrasOptions.map((o) => o.value).join('، ');
        lines.push(`   الإضافات: ${extrasNames}`);
      }

      // Show notes
      if (item.notes) {
        lines.push(`   ملاحظات: ${item.notes}`);
      }
    });

    lines.push('');
    lines.push(`💰 الإجمالي: ${total} ر.س`);

    return lines.join('\n');
  }, [items, total]);

  // Handle WhatsApp checkout
  const handleWhatsAppCheckout = useCallback(() => {
    const message = formatWhatsAppMessage();
    const encodedMessage = encodeURIComponent(message);
    const url = `https://wa.me/966548599988?text=${encodedMessage}`;
    window.open(url, '_blank');
  }, [formatWhatsAppMessage]);

  // Handle clear cart with confirmation
  const handleClearCart = useCallback(() => {
    if (showClearConfirm) {
      clearCart();
      setShowClearConfirm(false);
    } else {
      setShowClearConfirm(true);
      setTimeout(() => setShowClearConfirm(false), 3000);
    }
  }, [showClearConfirm, clearCart]);

  // Get display label for a cart item's selected variant
  const getItemVariantLabel = useCallback((item: CartItem) => {
    const variantOption = item.options.find(
      (o) => o.type === 'riceType' || o.type === 'quantity'
    );
    return variantOption?.value ?? '';
  }, []);

  // Get extras text for a cart item
  const getItemExtrasText = useCallback((item: CartItem) => {
    const extrasOptions = item.options.filter((o) => o.type === 'extras');
    if (extrasOptions.length === 0) return '';
    return extrasOptions.map((o) => o.value).join('، ');
  }, []);

  return (
    <Sheet open={isOpen} onOpenChange={(open) => { if (!open) closeCart(); }}>
      <SheetContent
        side={isRTL ? 'left' : 'right'}
        className="w-full sm:max-w-md p-0 flex flex-col"
      >
        {/* ============ HEADER ============ */}
        <SheetHeader className="px-4 sm:px-6 pt-5 pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
                <ShoppingBag className="w-5 h-5 text-primary" />
              </div>
              <div>
                <SheetTitle className="text-lg font-bold text-foreground">
                  {t(locale, 'cartTitle')}
                </SheetTitle>
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

        <Separator />

        {/* ============ CART CONTENT ============ */}
        <div className="flex-1 overflow-hidden flex flex-col">
          {isEmpty ? (
            /* ====== EMPTY STATE ====== */
            <div className="flex-1 flex flex-col items-center justify-center px-6 py-12 text-center">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mb-5"
              >
                <ShoppingBag className="w-9 h-9 text-muted-foreground" />
              </motion.div>
              <motion.div
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.1 }}
                className="space-y-2"
              >
                <h3 className="text-base font-semibold text-foreground">
                  {t(locale, 'cartEmpty')}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed max-w-[240px]">
                  {t(locale, 'cartEmptyDesc')}
                </p>
              </motion.div>
              <motion.div
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="mt-6"
              >
                <Button
                  onClick={() => {
                    closeCart();
                    navigate('menu');
                  }}
                  variant="outline"
                  className="rounded-xl border-2 border-primary/30 text-primary hover:bg-primary/5 hover:border-primary/50 font-medium"
                >
                  {t(locale, 'goToMenu')}
                  <ChevronRight className="w-4 h-4 rtl:rotate-180" />
                </Button>
              </motion.div>
            </div>
          ) : (
            /* ====== CART ITEMS LIST ====== */
            <ScrollArea className="flex-1">
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
            </ScrollArea>
          )}
        </div>

        {/* ============ FOOTER ============ */}
        {!isEmpty && (
          <SheetFooter className="border-t border-border bg-background/95 backdrop-blur-sm px-4 sm:px-6 py-4 gap-3">
            {/* Subtotal */}
            <div className="flex items-center justify-between w-full">
              <span className="text-sm font-medium text-muted-foreground">
                {t(locale, 'subtotal')}
              </span>
              <span className="text-xl font-bold text-primary tabular-nums">
                {total} {t(locale, 'sar')}
              </span>
            </div>

            {/* WhatsApp Checkout */}
            <Button
              onClick={handleWhatsAppCheckout}
              className="w-full h-12 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-white text-sm font-bold shadow-lg shadow-[#25D366]/20 transition-all"
              size="lg"
            >
              <MessageCircle className="w-5 h-5" />
              {t(locale, 'checkoutWhatsApp')}
            </Button>

            {/* Clear Cart */}
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
                  {showClearConfirm
                    ? t(locale, 'clearCart') + ' ✓'
                    : t(locale, 'clearCart')}
                </Button>
              </motion.div>
            </AnimatePresence>
          </SheetFooter>
        )}
      </SheetContent>
    </Sheet>
  );
}

/* ============================================================
   CartItemCard - Individual cart item component
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

function CartItemCard({
  item,
  locale,
  isRTL,
  variantLabel,
  extrasText,
  onQuantityChange,
  onRemove,
}: CartItemCardProps) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, x: isRTL ? 60 : -60, scale: 0.95 }}
      transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
      className="relative flex gap-3 p-3 rounded-2xl border border-border bg-card hover:shadow-sm transition-shadow"
    >
      {/* Item Image */}
      <div
        className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden shrink-0 bg-muted"
        style={{
          backgroundImage: `url(${item.image})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />

      {/* Item Details */}
      <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
        <div className="space-y-0.5">
          <div className="flex items-start justify-between gap-2">
            <h4 className="text-sm font-semibold text-foreground leading-tight truncate">
              {item.name}
            </h4>
            <button
              onClick={() => onRemove(item.cartItemId)}
              className="shrink-0 w-7 h-7 rounded-lg flex items-center justify-center text-muted-foreground hover:text-destructive hover:bg-destructive/8 transition-colors -mt-0.5"
              aria-label={t(locale, 'removeItem')}
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Variant label */}
          {variantLabel && (
            <p className="text-xs text-primary font-medium leading-tight truncate">
              {variantLabel}
            </p>
          )}

          {/* Extras */}
          {extrasText && (
            <p className="text-xs text-muted-foreground leading-tight truncate">
              {extrasText}
            </p>
          )}

          {/* Notes */}
          {item.notes && (
            <p className="text-xs text-gold/80 italic leading-tight truncate">
              {item.notes}
            </p>
          )}
        </div>

        {/* Quantity & Price */}
        <div className="flex items-center justify-between mt-1.5">
          {/* Quantity Controls */}
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
            <span className="text-sm font-bold text-foreground min-w-[1.5rem] text-center tabular-nums">
              {item.quantity}
            </span>
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

          {/* Item Total */}
          <span className="text-sm font-bold text-primary tabular-nums">
            {item.totalPrice} {t(locale, 'sar')}
          </span>
        </div>
      </div>
    </motion.div>
  );
}
