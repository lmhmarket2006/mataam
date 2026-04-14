'use client';

import React, { useState, useMemo, useEffect, useCallback } from 'react';
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
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useCart, useLanguage, generateCartId, type CartItemOption } from '@/lib/store';
import { t } from '@/lib/i18n';
import { useRestaurantData } from '@/contexts/restaurant-data-context';
import type { PublicMenuItem, PublicOptionGroup } from '@/lib/public-menu-types';

function emptySelection(item: PublicMenuItem | undefined): Record<string, Set<string>> {
  const m: Record<string, Set<string>> = {};
  if (!item) return m;
  for (const g of item.optionGroups) {
    m[g.id] = new Set();
  }
  return m;
}

function selectionValid(item: PublicMenuItem, sel: Record<string, Set<string>>): boolean {
  for (const g of item.optionGroups) {
    const picked = [...(sel[g.id] ?? [])];
    if (g.selectionType === 'SINGLE') {
      if (picked.length > 1) return false;
      if (g.isRequired && picked.length === 0) return false;
    } else {
      const max = g.maxSelect ?? g.values.length;
      const min = g.isRequired ? (g.minSelect ?? 1) : (g.minSelect ?? 0);
      if (picked.length > max || picked.length < min) return false;
    }
  }
  return true;
}

export default function ItemCustomizer() {
  const { allMenuItems } = useRestaurantData();
  const { customizerItem, closeCustomizer, addItem } = useCart();
  const { locale, isRTL } = useLanguage();

  const menuItem = useMemo(
    () => allMenuItems.find((item) => item.id === customizerItem),
    [allMenuItems, customizerItem]
  );

  const [groupSelection, setGroupSelection] = useState<Record<string, Set<string>>>({});
  const [quantity, setQuantity] = useState(1);
  const [notes, setNotes] = useState('');
  const [isAdded, setIsAdded] = useState(false);

  useEffect(() => {
    setGroupSelection(emptySelection(menuItem));
    setQuantity(1);
    setNotes('');
    setIsAdded(false);
  }, [customizerItem, menuItem]);

  const unitPrice = useMemo(() => {
    if (!menuItem) return 0;
    let p = menuItem.price;
    for (const g of menuItem.optionGroups) {
      const set = groupSelection[g.id] ?? new Set();
      for (const vid of set) {
        const v = g.values.find((x) => x.id === vid);
        if (v) p += v.priceModifierSar;
      }
    }
    return p;
  }, [menuItem, groupSelection]);

  const totalPrice = unitPrice * quantity;
  const canAdd = menuItem ? selectionValid(menuItem, groupSelection) : false;

  const pickSingle = useCallback((g: PublicOptionGroup, valueId: string) => {
    setGroupSelection((prev) => ({
      ...prev,
      [g.id]: new Set([valueId]),
    }));
  }, []);

  const toggleMulti = useCallback((g: PublicOptionGroup, valueId: string) => {
    setGroupSelection((prev) => {
      const cur = new Set(prev[g.id] ?? []);
      if (cur.has(valueId)) cur.delete(valueId);
      else cur.add(valueId);
      return { ...prev, [g.id]: cur };
    });
  }, []);

  function handleQuantityChange(delta: number) {
    setQuantity((prev) => Math.min(10, Math.max(1, prev + delta)));
  }

  function handleAddToCart() {
    if (!menuItem || !canAdd) return;

    const options: CartItemOption[] = [];
    for (const g of menuItem.optionGroups) {
      const set = groupSelection[g.id] ?? new Set();
      for (const vid of set) {
        const v = g.values.find((x) => x.id === vid);
        if (!v) continue;
        options.push({
          type: 'optionGroup',
          value: locale === 'ar' ? `${g.nameAr}: ${v.nameAr}` : `${g.nameEn}: ${v.nameEn}`,
          priceModifier: v.priceModifierSar,
          optionValueId: v.id,
        });
      }
    }

    const cartItem = {
      id: menuItem.id,
      cartItemId: generateCartId(),
      menuItemId: menuItem.id,
      name: locale === 'ar' ? menuItem.nameAr : menuItem.nameEn,
      price: menuItem.price,
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
  const hasOptionGroups = menuItem.optionGroups.length > 0;

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
                <DrawerTitle className="text-xl sm:text-2xl font-bold text-foreground mb-1">{itemName}</DrawerTitle>
                <DrawerDescription className="text-sm text-foreground/70 line-clamp-2">{itemDesc}</DrawerDescription>
              </div>
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
              {hasOptionGroups &&
                menuItem.optionGroups.map((g) => (
                  <div key={g.id} className="space-y-2">
                    <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                      <span className="w-1 h-4 rounded-full bg-primary" />
                      {locale === 'ar' ? g.nameAr : g.nameEn}
                      {g.isRequired ? (
                        <span className="text-[10px] text-destructive font-normal">*</span>
                      ) : null}
                    </h3>
                    {g.selectionType === 'SINGLE' ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {g.values.map((v) => {
                          const picked = groupSelection[g.id] ?? new Set();
                          const isSelected = picked.has(v.id);
                          const label = locale === 'ar' ? v.nameAr : v.nameEn;
                          const showPrice = v.priceModifierSar > 0;
                          return (
                            <motion.button
                              key={v.id}
                              type="button"
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              onClick={() => pickSingle(g, v.id)}
                              className={`
                                relative flex items-center justify-between px-3 py-2.5 rounded-xl border-2 text-sm font-medium gap-2
                                transition-all duration-200 cursor-pointer
                                ${
                                  isSelected
                                    ? 'border-primary bg-primary/8 text-primary shadow-sm shadow-primary/10'
                                    : 'border-border bg-card hover:border-primary/40 hover:bg-primary/4 text-foreground'
                                }
                              `}
                            >
                              <span className="flex-1 text-start">{label}</span>
                              {showPrice ? (
                                <span className="shrink-0 text-xs font-bold">
                                  +{v.priceModifierSar} {t(locale, 'sar')}
                                </span>
                              ) : null}
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
                    ) : (
                      <div className="space-y-2">
                        {g.values.map((v) => {
                          const picked = groupSelection[g.id] ?? new Set();
                          const isChecked = picked.has(v.id);
                          const label = locale === 'ar' ? v.nameAr : v.nameEn;
                          return (
                            <motion.label
                              key={v.id}
                              htmlFor={`og-${g.id}-${v.id}`}
                              className={`
                                flex items-center gap-3 px-3 py-2.5 rounded-xl border-2 cursor-pointer min-w-0
                                transition-all duration-200
                                ${
                                  isChecked ? 'border-gold bg-gold/5' : 'border-border bg-card hover:border-gold/30'
                                }
                              `}
                              whileTap={{ scale: 0.99 }}
                            >
                              <Checkbox
                                id={`og-${g.id}-${v.id}`}
                                checked={isChecked}
                                onCheckedChange={() => toggleMulti(g, v.id)}
                                className="border-gold data-[state=checked]:bg-gold data-[state=checked]:border-gold"
                              />
                              <span className="flex-1 text-sm font-medium min-w-0 break-words">{label}</span>
                              {v.priceModifierSar > 0 ? (
                                <span className="text-xs font-semibold text-muted-foreground">
                                  +{v.priceModifierSar} {t(locale, 'sar')}
                                </span>
                              ) : null}
                            </motion.label>
                          );
                        })}
                      </div>
                    )}
                  </div>
                ))}

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
                  <span className="text-xl font-bold text-foreground min-w-[2rem] text-center tabular-nums">{quantity}</span>
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

        <DrawerFooter className="border-t border-border bg-background/95 backdrop-blur-sm px-4 sm:px-6 py-3 gap-0">
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
                  disabled={!canAdd}
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
