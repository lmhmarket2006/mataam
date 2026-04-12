'use client';

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus, Check, UtensilsCrossed } from 'lucide-react';
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerFooter,
  DrawerClose,
} from '@/components/ui/drawer';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useCart, useLanguage, generateCartId, type CartItemOption } from '@/lib/store';
import { t } from '@/lib/i18n';
import { allMenuItems, type MenuItem, type PriceVariant } from '@/lib/menu-data';

export default function ItemCustomizer() {
  const { customizerItem, closeCustomizer, addItem } = useCart();
  const { locale, isRTL } = useLanguage();

  // Form state
  const [selectedVariant, setSelectedVariant] = useState<PriceVariant | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedExtras, setSelectedExtras] = useState<Set<string>>(new Set());
  const [notes, setNotes] = useState('');
  const [isAdded, setIsAdded] = useState(false);

  // Find the menu item
  const menuItem: MenuItem | undefined = useMemo(
    () => allMenuItems.find((item) => item.id === customizerItem),
    [customizerItem]
  );

  // Reset form when item changes
  React.useEffect(() => {
    setSelectedVariant(null);
    setQuantity(1);
    setSelectedExtras(new Set());
    setNotes('');
    setIsAdded(false);
  }, [customizerItem]);

  // Group price variants by type
  const riceVariants = useMemo(
    () => menuItem?.options?.priceVariants?.filter((v) => v.type === 'rice') ?? [],
    [menuItem]
  );

  const meatQtyVariants = useMemo(
    () => menuItem?.options?.priceVariants?.filter((v) => v.type === 'meat-qty') ?? [],
    [menuItem]
  );

  const hasVariants = (riceVariants.length > 0 || meatQtyVariants.length > 0);

  // Calculate base price from selected variant or item price
  const basePrice = selectedVariant?.price ?? menuItem?.price ?? 0;

  // Calculate extras total
  const extrasTotal = useMemo(() => {
    if (!menuItem?.options?.extras) return 0;
    return menuItem.options.extras
      .filter((e) => selectedExtras.has(e.id))
      .reduce((sum, e) => sum + e.price, 0);
  }, [menuItem, selectedExtras]);

  // Total price
  const totalPrice = (basePrice + extrasTotal) * quantity;

  // Handle extra toggle
  function toggleExtra(extraId: string) {
    setSelectedExtras((prev) => {
      const next = new Set(prev);
      if (next.has(extraId)) {
        next.delete(extraId);
      } else {
        next.add(extraId);
      }
      return next;
    });
  }

  // Handle quantity change
  function handleQuantityChange(delta: number) {
    setQuantity((prev) => Math.min(10, Math.max(1, prev + delta)));
  }

  // Handle add to cart
  function handleAddToCart() {
    if (!menuItem) return;

    // Build options array
    const options: CartItemOption[] = [];

    if (selectedVariant) {
      const optionType = selectedVariant.type === 'rice' ? 'riceType' : 'quantity';
      options.push({
        type: optionType,
        value: locale === 'ar' ? selectedVariant.labelAr : selectedVariant.labelEn,
        priceModifier: selectedVariant.price - (menuItem.price || 0),
      });
    }

    // Add selected extras
    if (menuItem.options?.extras) {
      for (const extra of menuItem.options.extras) {
        if (selectedExtras.has(extra.id)) {
          options.push({
            type: 'extras',
            value: locale === 'ar' ? extra.nameAr : extra.nameEn,
            priceModifier: extra.price,
          });
        }
      }
    }

    const cartItem = {
      id: menuItem.id,
      cartItemId: generateCartId(),
      menuItemId: menuItem.id,
      name: locale === 'ar' ? menuItem.nameAr : menuItem.nameEn,
      price: basePrice,
      image: menuItem.image,
      quantity,
      options,
      notes,
      totalPrice,
    };

    addItem(cartItem);
    setIsAdded(true);

    setTimeout(() => {
      setIsAdded(false);
      closeCustomizer();
    }, 800);
  }

  if (!menuItem) return null;

  const itemName = locale === 'ar' ? menuItem.nameAr : menuItem.nameEn;
  const itemDesc = locale === 'ar' ? menuItem.descAr : menuItem.descEn;
  const extras = menuItem.options?.extras ?? [];

  return (
    <Drawer
      open={!!customizerItem}
      onOpenChange={(open) => {
        if (!open) closeCustomizer();
      }}
      direction={isRTL ? 'right' : 'left'}
      handleOnly
    >
      <DrawerContent className="max-h-[92vh] bg-background">
        <ScrollArea className="h-full max-h-[calc(92vh-80px)]">
          <div className="pb-2">
            {/* Item Image */}
            <div className="relative w-full h-48 sm:h-56 overflow-hidden">
              <div
                className="absolute inset-0 bg-cover bg-center"
                style={{
                  backgroundImage: `url(${menuItem.image})`,
                  backgroundColor: 'oklch(0.92 0.03 65)',
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
              <div className="absolute bottom-0 inset-x-0 p-4 sm:p-6">
                <DrawerTitle className="text-xl sm:text-2xl font-bold text-foreground mb-1">
                  {itemName}
                </DrawerTitle>
                <DrawerDescription className="text-sm text-foreground/70 line-clamp-2">
                  {itemDesc}
                </DrawerDescription>
              </div>
              {/* Close button overlay */}
              <DrawerClose asChild>
                <button
                  className="absolute top-3 end-3 z-10 w-8 h-8 rounded-full bg-background/80 backdrop-blur-sm flex items-center justify-center text-foreground/70 hover:text-foreground hover:bg-background transition-colors"
                  aria-label="Close"
                >
                  <span className="text-lg leading-none">&times;</span>
                </button>
              </DrawerClose>
            </div>

            <div className="px-4 sm:px-6 pt-2 pb-4 space-y-5">
              {/* ============ PRICE VARIANTS ============ */}
              {hasVariants && (
                <div className="space-y-3">
                  {/* Rice Variants */}
                  {riceVariants.length > 0 && (
                    <div className="space-y-2">
                      <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                        <span className="w-1 h-4 rounded-full bg-primary" />
                        {t(locale, 'riceType')}
                      </h3>
                      <div className="grid grid-cols-2 gap-2">
                        {riceVariants.map((variant) => {
                          const isSelected = selectedVariant?.labelAr === variant.labelAr;
                          const label = locale === 'ar' ? variant.labelAr : variant.labelEn;
                          return (
                            <motion.button
                              key={variant.labelAr}
                              type="button"
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              onClick={() => setSelectedVariant(variant)}
                              className={`
                                relative flex items-center justify-between px-3 py-2.5 rounded-xl border-2 text-sm font-medium
                                transition-all duration-200 cursor-pointer
                                ${
                                  isSelected
                                    ? 'border-primary bg-primary/8 text-primary shadow-sm shadow-primary/10'
                                    : 'border-border bg-card hover:border-primary/40 hover:bg-primary/4 text-foreground'
                                }
                              `}
                            >
                              <span className="truncate me-2">{label}</span>
                              <span className="shrink-0 text-xs font-bold">
                                {variant.price} {t(locale, 'sar')}
                              </span>
                              {isSelected && (
                                <motion.div
                                  initial={{ scale: 0 }}
                                  animate={{ scale: 1 }}
                                  className="absolute -top-1.5 -end-1.5 w-5 h-5 rounded-full bg-primary flex items-center justify-center"
                                >
                                  <Check className="w-3 h-3 text-primary-foreground" />
                                </motion.div>
                              )}
                            </motion.button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Meat Quantity Variants */}
                  {meatQtyVariants.length > 0 && (
                    <div className="space-y-2">
                      <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                        <span className="w-1 h-4 rounded-full bg-gold" />
                        {t(locale, 'quantity')}
                      </h3>
                      <div className="grid grid-cols-1 gap-2">
                        {meatQtyVariants.map((variant) => {
                          const isSelected = selectedVariant?.labelAr === variant.labelAr;
                          const label = locale === 'ar' ? variant.labelAr : variant.labelEn;
                          return (
                            <motion.button
                              key={variant.labelAr}
                              type="button"
                              whileHover={{ scale: 1.01 }}
                              whileTap={{ scale: 0.99 }}
                              onClick={() => setSelectedVariant(variant)}
                              className={`
                                relative flex items-center justify-between px-4 py-3 rounded-xl border-2 text-sm font-medium
                                transition-all duration-200 cursor-pointer
                                ${
                                  isSelected
                                    ? 'border-gold bg-gold/8 text-gold-foreground shadow-sm shadow-gold/10'
                                    : 'border-border bg-card hover:border-gold/40 hover:bg-gold/4 text-foreground'
                                }
                              `}
                            >
                              <span className="truncate me-2">{label}</span>
                              <span className="shrink-0 text-xs font-bold">
                                {variant.price} {t(locale, 'sar')}
                              </span>
                              {isSelected && (
                                <motion.div
                                  initial={{ scale: 0 }}
                                  animate={{ scale: 1 }}
                                  className="absolute -top-1.5 -end-1.5 w-5 h-5 rounded-full bg-gold flex items-center justify-center"
                                >
                                  <Check className="w-3 h-3 text-gold-foreground" />
                                </motion.div>
                              )}
                            </motion.button>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* ============ QUANTITY CONTROL ============ */}
              <div className="space-y-2">
                <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                  <span className="w-1 h-4 rounded-full bg-primary" />
                  {t(locale, 'quantity')}
                </h3>
                <div className="flex items-center gap-3">
                  <motion.button
                    type="button"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => handleQuantityChange(-1)}
                    disabled={quantity <= 1}
                    className="w-10 h-10 rounded-xl border-2 border-border bg-card flex items-center justify-center text-foreground hover:border-primary/40 hover:bg-primary/5 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    <Minus className="w-4 h-4" />
                  </motion.button>
                  <span className="text-xl font-bold text-foreground min-w-[2rem] text-center tabular-nums">
                    {quantity}
                  </span>
                  <motion.button
                    type="button"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => handleQuantityChange(1)}
                    disabled={quantity >= 10}
                    className="w-10 h-10 rounded-xl border-2 border-border bg-card flex items-center justify-center text-foreground hover:border-primary/40 hover:bg-primary/5 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    <Plus className="w-4 h-4" />
                  </motion.button>
                </div>
              </div>

              {/* ============ EXTRAS ============ */}
              {extras.length > 0 && (
                <div className="space-y-2">
                  <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                    <span className="w-1 h-4 rounded-full bg-gold" />
                    {t(locale, 'extras')}
                  </h3>
                  <div className="space-y-2">
                    {extras.map((extra) => {
                      const isChecked = selectedExtras.has(extra.id);
                      const extraName = locale === 'ar' ? extra.nameAr : extra.nameEn;
                      return (
                        <motion.label
                          key={extra.id}
                          htmlFor={`extra-${extra.id}-${menuItem.id}`}
                          className={`
                            flex items-center gap-3 px-3 py-2.5 rounded-xl border-2 cursor-pointer
                            transition-all duration-200
                            ${
                              isChecked
                                ? 'border-gold bg-gold/5'
                                : 'border-border bg-card hover:border-gold/30'
                            }
                          `}
                          whileTap={{ scale: 0.99 }}
                        >
                          <Checkbox
                            id={`extra-${extra.id}-${menuItem.id}`}
                            checked={isChecked}
                            onCheckedChange={() => toggleExtra(extra.id)}
                            className="border-gold data-[state=checked]:bg-gold data-[state=checked]:border-gold"
                          />
                          <span className="flex-1 text-sm font-medium text-foreground">
                            {extraName}
                          </span>
                          <span className="text-xs font-semibold text-muted-foreground">
                            +{extra.price} {t(locale, 'sar')}
                          </span>
                        </motion.label>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* ============ NOTES ============ */}
              <div className="space-y-2">
                <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                  <span className="w-1 h-4 rounded-full bg-primary" />
                  {t(locale, 'notes')}
                </h3>
                <Textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder={t(locale, 'notesPlaceholder')}
                  className="min-h-[72px] resize-none rounded-xl border-2 border-border bg-card text-sm focus:border-primary/50 transition-colors"
                  dir={isRTL ? 'rtl' : 'ltr'}
                />
              </div>
            </div>
          </div>
        </ScrollArea>

        {/* ============ ADD TO CART FOOTER ============ */}
        <DrawerFooter className="border-t border-border bg-background/95 backdrop-blur-sm px-4 sm:px-6 py-3 gap-0">
          {/* Price summary */}
          <div className="flex items-center justify-between w-full mb-2">
            <span className="text-sm text-muted-foreground">{t(locale, 'total')}</span>
            <span className="text-lg font-bold text-primary tabular-nums">
              {totalPrice} {t(locale, 'sar')}
            </span>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={isAdded ? 'added' : 'add'}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="w-full"
            >
              {isAdded ? (
                <div className="w-full h-12 rounded-xl bg-green-500 text-white flex items-center justify-center gap-2 text-sm font-semibold">
                  <Check className="w-5 h-5" />
                  {t(locale, 'added')}
                </div>
              ) : (
                <Button
                  onClick={handleAddToCart}
                  className="w-full h-12 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground text-base font-bold shadow-lg shadow-primary/20 transition-all"
                  size="lg"
                >
                  <UtensilsCrossed className="w-5 h-5" />
                  {t(locale, 'addToCart')}
                </Button>
              )}
            </motion.div>
          </AnimatePresence>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
