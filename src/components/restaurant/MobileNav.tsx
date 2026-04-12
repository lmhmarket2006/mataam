'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Home,
  UtensilsCrossed,
  Info,
  MapPin,
  Phone,
  ShoppingBag,
  Languages,
  X,
} from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { useNavigation, useLanguage, useCart, type Page } from '@/lib/store';
import { t, type TranslationKey } from '@/lib/i18n';

interface MobileNavProps {
  open: boolean;
  onClose: () => void;
}

interface NavItem {
  page: Page;
  labelKey: TranslationKey;
  icon: React.ReactNode;
}

const navItems: NavItem[] = [
  { page: 'home', labelKey: 'home', icon: <Home className="size-5" /> },
  { page: 'menu', labelKey: 'menu', icon: <UtensilsCrossed className="size-5" /> },
  { page: 'about', labelKey: 'about', icon: <Info className="size-5" /> },
  { page: 'branches', labelKey: 'branches', icon: <MapPin className="size-5" /> },
  { page: 'contact', labelKey: 'contact', icon: <Phone className="size-5" /> },
];

export default function MobileNav({ open, onClose }: MobileNavProps) {
  const { currentPage, navigate } = useNavigation();
  const { locale, isRTL, toggleLanguage } = useLanguage();
  const { openCart, getItemCount } = useCart();
  const itemCount = getItemCount();

  const handleNavClick = (page: Page) => {
    navigate(page);
    onClose();
  };

  const handleCartClick = () => {
    onClose();
    setTimeout(() => openCart(), 300);
  };

  const sheetSide = isRTL ? 'right' : 'left';

  return (
    <Sheet open={open} onOpenChange={(v) => !v && onClose()}>
      <SheetContent
        side={sheetSide}
        className="w-[300px] sm:w-[340px] bg-gradient-to-b from-secondary/50 to-background border-border p-0"
      >
        {/* Header with logo */}
        <SheetHeader className="px-6 pt-8 pb-4">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="flex items-center gap-3"
          >
            {/* Decorative diamond */}
            <div className="flex flex-col items-center gap-1">
              <div className="w-2 h-2 bg-gold rotate-45 rounded-sm" />
              <div className="w-1.5 h-1.5 bg-primary/40 rotate-45 rounded-sm" />
            </div>
            <div>
              <SheetTitle className="text-xl font-bold text-primary tracking-wide">
                {locale === 'ar' ? 'الواحة' : 'Al Wahah'}
              </SheetTitle>
              <SheetDescription className="text-xs text-muted-foreground mt-0.5">
                {t(locale, 'restaurantSlogan')}
              </SheetDescription>
            </div>
          </motion.div>
        </SheetHeader>

        <Separator className="opacity-50" />

        {/* Navigation links */}
        <nav className="flex-1 px-3 py-4 overflow-y-auto">
          <AnimatePresence mode="wait">
            {open && (
              <motion.ul
                initial="hidden"
                animate="visible"
                variants={{
                  hidden: {},
                  visible: {
                    transition: { staggerChildren: 0.06 },
                  },
                }}
                className="space-y-1"
              >
                {navItems.map((item) => {
                  const isActive = currentPage === item.page;
                  return (
                    <motion.li
                      key={item.page}
                      variants={{
                        hidden: { opacity: 0, x: isRTL ? 20 : -20 },
                        visible: { opacity: 1, x: 0 },
                      }}
                      transition={{ duration: 0.3, ease: 'easeOut' }}
                    >
                      <button
                        onClick={() => handleNavClick(item.page)}
                        className={`
                          w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium
                          transition-all duration-200 group
                          ${
                            isActive
                              ? 'bg-primary text-primary-foreground shadow-md shadow-primary/20'
                              : 'text-foreground/80 hover:bg-primary/10 hover:text-primary'
                          }
                        `}
                      >
                        <span
                          className={`transition-colors duration-200 ${
                            isActive
                              ? 'text-primary-foreground'
                              : 'text-primary/70 group-hover:text-primary'
                          }`}
                        >
                          {item.icon}
                        </span>
                        <span>{t(locale, item.labelKey)}</span>
                        {isActive && (
                          <motion.div
                            layoutId="mobile-active-indicator"
                            className="ms-auto w-1.5 h-1.5 rounded-full bg-primary-foreground"
                            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                          />
                        )}
                      </button>
                    </motion.li>
                  );
                })}

                {/* Cart link */}
                <motion.li
                  variants={{
                    hidden: { opacity: 0, x: isRTL ? 20 : -20 },
                    visible: { opacity: 1, x: 0 },
                  }}
                  transition={{ duration: 0.3, ease: 'easeOut' }}
                >
                  <button
                    onClick={handleCartClick}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-foreground/80 hover:bg-gold/15 hover:text-gold-foreground transition-all duration-200 group"
                  >
                    <span className="relative text-primary/70 group-hover:text-gold transition-colors duration-200">
                      <ShoppingBag className="size-5" />
                      {itemCount > 0 && (
                        <Badge className="absolute -top-2 -end-2 size-5 p-0 flex items-center justify-center bg-gold text-gold-foreground text-[10px] border-0 font-bold">
                          {itemCount}
                        </Badge>
                      )}
                    </span>
                    <span>{t(locale, 'cart')}</span>
                  </button>
                </motion.li>
              </motion.ul>
            )}
          </AnimatePresence>
        </nav>

        <Separator className="opacity-50" />

        {/* Footer section with language toggle */}
        <div className="px-4 py-5">
          <motion.button
            initial={{ opacity: 0, y: 10 }}
            animate={open ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.4, delay: 0.4 }}
            onClick={() => {
              toggleLanguage();
              onClose();
            }}
            className="
              w-full flex items-center justify-center gap-2.5 px-4 py-3 rounded-xl
              bg-primary/8 text-primary font-medium text-sm
              hover:bg-primary/15 transition-all duration-200
              border border-primary/10
            "
          >
            <Languages className="size-4" />
            <span>{t(locale, 'language')}</span>
          </motion.button>

          {/* Decorative bottom element */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={open ? { opacity: 1 } : {}}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="flex items-center justify-center gap-2 mt-4 text-muted-foreground/50"
          >
            <div className="w-8 h-px bg-border" />
            <div className="w-1.5 h-1.5 bg-gold/50 rotate-45 rounded-sm" />
            <div className="w-8 h-px bg-border" />
          </motion.div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
