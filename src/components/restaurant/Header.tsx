'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence, useMotionValueEvent, useScroll } from 'framer-motion';
import {
  ShoppingBag,
  Languages,
  Menu as MenuIcon,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useNavigation, useLanguage, useCart, type Page } from '@/lib/store';
import { t, type TranslationKey } from '@/lib/i18n';
import MobileNav from './MobileNav';

interface NavItem {
  page: Page;
  labelKey: TranslationKey;
}

const navItems: NavItem[] = [
  { page: 'home', labelKey: 'home' },
  { page: 'menu', labelKey: 'menu' },
  { page: 'about', labelKey: 'about' },
  { page: 'branches', labelKey: 'branches' },
  { page: 'contact', labelKey: 'contact' },
];

export default function Header() {
  const { currentPage, navigate } = useNavigation();
  const { locale, isRTL, toggleLanguage } = useLanguage();
  const { openCart, getItemCount } = useCart();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const itemCount = getItemCount();

  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, 'change', (latest) => {
    setScrolled(latest > 20);
  });

  return (
    <>
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className={`
          fixed top-0 left-0 right-0 z-50 transition-all duration-300
          ${
            scrolled
              ? 'glass border-b border-border/60 shadow-sm shadow-primary/5'
              : 'bg-transparent'
          }
        `}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-18">
            {/* Mobile hamburger */}
            <div className="flex items-center lg:hidden order-first">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setMobileNavOpen(true)}
                className="text-foreground hover:bg-primary/10 hover:text-primary"
                aria-label={t(locale, 'menu')}
              >
                <MenuIcon className="size-5" />
              </Button>
            </div>

            {/* Logo */}
            <motion.div
              className="flex items-center gap-2.5 cursor-pointer"
              onClick={() => navigate('home')}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {/* Decorative element */}
              <div className="relative flex items-center justify-center">
                <div className="absolute w-9 h-9 rounded-full bg-primary/8" />
                <div className="relative flex flex-col items-center gap-[3px]">
                  <div className="w-2 h-2 bg-gold rotate-45 rounded-[2px]" />
                  <div className="w-1.5 h-1.5 bg-primary rotate-45 rounded-[1.5px]" />
                </div>
              </div>
              <div className="flex flex-col">
                <span className="text-lg sm:text-xl font-bold text-primary leading-tight tracking-wide">
                  {locale === 'ar' ? 'الواحة' : 'Al Wahah'}
                </span>
                <span className="text-[9px] sm:text-[10px] text-muted-foreground font-medium tracking-wider uppercase leading-none">
                  {locale === 'ar' ? 'مطعم' : 'Restaurant'}
                </span>
              </div>
            </motion.div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-1">
              <AnimatePresence mode="wait">
                {navItems.map((item) => {
                  const isActive = currentPage === item.page;
                  return (
                    <motion.button
                      key={item.page}
                      onClick={() => navigate(item.page)}
                      className={`
                        relative px-3.5 py-2 rounded-lg text-sm font-medium
                        transition-colors duration-200
                        ${
                          isActive
                            ? 'text-primary'
                            : 'text-foreground/70 hover:text-primary hover:bg-primary/8'
                        }
                      `}
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                    >
                      {t(locale, item.labelKey)}
                      {isActive && (
                        <motion.div
                          layoutId="desktop-active-nav"
                          className="absolute bottom-0 left-1/2 -translate-x-1/2 w-5 h-0.5 bg-primary rounded-full"
                          transition={{
                            type: 'spring',
                            stiffness: 500,
                            damping: 35,
                          }}
                        />
                      )}
                    </motion.button>
                  );
                })}
              </AnimatePresence>
            </nav>

            {/* Actions */}
            <div className="flex items-center gap-1.5 sm:gap-2">
              {/* Language toggle */}
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={toggleLanguage}
                  className="hidden sm:flex items-center gap-1.5 text-foreground/70 hover:text-primary hover:bg-primary/8 text-xs font-medium"
                >
                  <Languages className="size-3.5" />
                  <span>{t(locale, 'language')}</span>
                </Button>
              </motion.div>

              {/* Mobile language toggle */}
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleLanguage}
                className="sm:hidden text-foreground/70 hover:text-primary hover:bg-primary/8"
                aria-label="Toggle language"
              >
                <Languages className="size-4" />
              </Button>

              {/* Cart button */}
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={openCart}
                  className="relative text-foreground/70 hover:text-primary hover:bg-primary/8"
                  aria-label={t(locale, 'cart')}
                >
                  <ShoppingBag className="size-5" />
                  <AnimatePresence mode="wait">
                    {itemCount > 0 && (
                      <motion.div
                        key={`cart-badge-${itemCount}`}
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0, opacity: 0 }}
                        transition={{
                          type: 'spring',
                          stiffness: 600,
                          damping: 25,
                        }}
                        className="absolute -top-0.5 -end-0.5"
                      >
                        <Badge className="size-[18px] min-w-[18px] p-0 flex items-center justify-center bg-gold text-gold-foreground text-[10px] border-0 font-bold leading-none">
                          {itemCount > 99 ? '99+' : itemCount}
                        </Badge>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </Button>
              </motion.div>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Spacer for fixed header */}
      <div className="h-16 sm:h-18" />

      {/* Mobile Navigation Drawer */}
      <MobileNav open={mobileNavOpen} onClose={() => setMobileNavOpen(false)} />
    </>
  );
}
