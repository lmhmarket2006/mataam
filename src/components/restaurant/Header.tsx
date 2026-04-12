'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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

  const isHomePage = currentPage === 'home';
  // On non-home pages, always show solid background
  const shouldShowGlass = scrolled || !isHomePage;
  // When on home page and not scrolled, use white text for dark hero overlay
  const useWhiteText = isHomePage && !scrolled;

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    // Check initial scroll position
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Scroll to top on page change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
  }, [currentPage]);

  return (
    <>
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className={`
          fixed top-0 left-0 right-0 z-50 transition-all duration-300
          ${
            shouldShowGlass
              ? 'bg-background/90 backdrop-blur-xl border-b border-border/60 shadow-sm shadow-primary/5'
              : 'bg-transparent'
          }
        `}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-[72px]">
            {/* Mobile hamburger */}
            <div className="flex items-center lg:hidden order-first">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setMobileNavOpen(true)}
                className={`${useWhiteText ? 'text-white hover:bg-white/10 hover:text-white' : 'text-foreground hover:bg-primary/10 hover:text-primary'}`}
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
                <div className={`absolute w-9 h-9 rounded-full ${useWhiteText ? 'bg-white/20' : 'bg-primary/8'}`} />
                <div className="relative flex flex-col items-center gap-[3px]">
                  <div className={`w-2 h-2 rotate-45 rounded-[2px] ${useWhiteText ? 'bg-gold' : 'bg-gold'}`} />
                  <div className={`w-1.5 h-1.5 rotate-45 rounded-[1.5px] ${useWhiteText ? 'bg-white' : 'bg-primary'}`} />
                </div>
              </div>
              <div className="flex flex-col">
                <span className={`text-lg sm:text-xl font-bold leading-tight tracking-wide ${useWhiteText ? 'text-white' : 'text-primary'}`}>
                  {locale === 'ar' ? 'الواحة' : 'Al Wahah'}
                </span>
                <span className={`text-[9px] sm:text-[10px] font-medium tracking-wider uppercase leading-none ${useWhiteText ? 'text-white/70' : 'text-muted-foreground'}`}>
                  {locale === 'ar' ? 'مطعم' : 'Restaurant'}
                </span>
              </div>
            </motion.div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-1">
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
                        useWhiteText
                          ? isActive
                            ? 'text-white'
                            : 'text-white/70 hover:text-white hover:bg-white/10'
                          : isActive
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
                        className={`absolute bottom-0 left-1/2 -translate-x-1/2 w-5 h-0.5 rounded-full ${useWhiteText ? 'bg-gold' : 'bg-primary'}`}
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
            </nav>

            {/* Actions */}
            <div className="flex items-center gap-1.5 sm:gap-2">
              {/* Language toggle */}
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={toggleLanguage}
                  className={`hidden sm:flex items-center gap-1.5 text-xs font-medium ${useWhiteText ? 'text-white/70 hover:text-white hover:bg-white/10' : 'text-foreground/70 hover:text-primary hover:bg-primary/8'}`}
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
                className={`sm:hidden ${useWhiteText ? 'text-white/70 hover:text-white hover:bg-white/10' : 'text-foreground/70 hover:text-primary hover:bg-primary/8'}`}
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
                  className={`relative ${useWhiteText ? 'text-white/70 hover:text-white hover:bg-white/10' : 'text-foreground/70 hover:text-primary hover:bg-primary/8'}`}
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
      <div className="h-16 sm:h-[72px]" />

      {/* Mobile Navigation Drawer */}
      <MobileNav open={mobileNavOpen} onClose={() => setMobileNavOpen(false)} />
    </>
  );
}
