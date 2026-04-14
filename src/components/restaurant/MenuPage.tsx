'use client';

import React, { useState, useRef, useEffect, useMemo } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import {
  Search,
  Plus,
  X,
  Star,
  Flame,
  Sparkles,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { useNavigation, useLanguage, useCart } from '@/lib/store';
import { t } from '@/lib/i18n';
import { useRestaurantData } from '@/contexts/restaurant-data-context';
import type { PublicMenuItem, PublicMenuCategory } from '@/lib/public-menu-types';

// ==============================
// ANIMATION VARIANTS
// ==============================
const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] as const },
  }),
};

const staggerContainer = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.06 },
  },
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.94 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] as const },
  },
};

// ==============================
// MENU ITEM CARD (Mobile-first)
// ==============================
function MenuItemCard({ item, index }: { item: PublicMenuItem; index: number }) {
  const { locale } = useLanguage();
  const { openCustomizer } = useCart();

  const name = locale === 'ar' ? item.nameAr : item.nameEn;
  const desc = locale === 'ar' ? item.descAr : item.descEn;
  const hasPriceVariants = item.optionGroups.length > 0;
  const lowestPrice = item.price;

  return (
    <motion.div
      variants={scaleIn}
      custom={index}
      className="card-hover bg-card rounded-2xl border overflow-hidden shadow-sm"
    >
      {/* Desktop: vertical card (image on top) */}
      <div className="sm:block hidden">
        <div className="relative aspect-[4/3] overflow-hidden">
          <img
            src={item.image}
            alt={name}
            className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
            loading="lazy"
          />
          <div className="absolute top-3 start-3 flex flex-col gap-1.5">
            {item.isBestSeller && (
              <Badge className="bg-gold text-gold-foreground text-[10px] px-2 py-0.5 shadow-md">
                <Star className="size-2.5 fill-gold text-gold me-1" />
                {t(locale, 'bestSeller')}
              </Badge>
            )}
            {item.isNew && (
              <Badge className="bg-green-600 text-white text-[10px] px-2 py-0.5 shadow-md">
                <Sparkles className="size-2.5 me-1" />
                {t(locale, 'newItem')}
              </Badge>
            )}
            {item.isSpicy && (
              <Badge className="bg-red-500 text-white text-[10px] px-2 py-0.5 shadow-md">
                <Flame className="size-2.5 me-1" />
                {t(locale, 'spicy')}
              </Badge>
            )}
          </div>
        </div>
        <div className="p-4">
          <h3 className="font-bold text-foreground text-sm sm:text-base leading-snug">{name}</h3>
          <p className="mt-1.5 text-muted-foreground text-xs leading-relaxed line-clamp-2">{desc}</p>
          <div className="mt-3 flex items-center justify-between gap-3">
            <div className="flex items-baseline gap-1">
              {hasPriceVariants && (
                <span className="text-xs text-muted-foreground">{locale === 'ar' ? 'ابدأ من' : 'From'}</span>
              )}
              <span className="text-lg font-extrabold text-primary">{hasPriceVariants ? lowestPrice : item.price}</span>
              <span className="text-xs text-muted-foreground">{t(locale, 'sar')}</span>
            </div>
            <Button
              size="sm"
              onClick={() => openCustomizer(item.id)}
              className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg text-xs shrink-0"
            >
              <Plus className="size-3.5" />
              {t(locale, 'addToCart')}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile: horizontal card (image on side) */}
      <div className="sm:hidden flex gap-3 p-3">
        {/* Image */}
        <div className="relative w-28 h-28 rounded-xl overflow-hidden shrink-0">
          <img
            src={item.image}
            alt={name}
            className="w-full h-full object-cover"
            loading="lazy"
          />
          <div className="absolute top-1.5 start-1.5 flex flex-col gap-1">
            {item.isBestSeller && (
              <Badge className="bg-gold text-gold-foreground text-[8px] px-1.5 py-0 shadow-sm">
                <Star className="size-2 fill-gold text-gold me-0.5" />
                {t(locale, 'bestSeller')}
              </Badge>
            )}
            {item.isNew && (
              <Badge className="bg-green-600 text-white text-[8px] px-1.5 py-0 shadow-sm">جديد</Badge>
            )}
            {item.isSpicy && (
              <Badge className="bg-red-500 text-white text-[8px] px-1.5 py-0 shadow-sm">حار</Badge>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
          <div>
            <h3 className="font-bold text-foreground text-sm leading-snug truncate">{name}</h3>
            <p className="mt-1 text-muted-foreground text-[11px] leading-relaxed line-clamp-2">{desc}</p>
          </div>
          <div className="mt-2 flex items-center justify-between gap-2">
            <div className="flex items-baseline gap-0.5">
              {hasPriceVariants && (
                <span className="text-[10px] text-muted-foreground">{locale === 'ar' ? 'من' : 'From'}</span>
              )}
              <span className="text-base font-extrabold text-primary">{hasPriceVariants ? lowestPrice : item.price}</span>
              <span className="text-[10px] text-muted-foreground">{t(locale, 'sar')}</span>
            </div>
            <Button
              size="sm"
              onClick={() => openCustomizer(item.id)}
              className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg text-xs px-3 h-9 shrink-0"
            >
              <Plus className="size-3.5" />
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ==============================
// CATEGORY SECTION
// ==============================
function CategorySection({
  category,
  filteredItems,
}: {
  category: PublicMenuCategory;
  filteredItems: PublicMenuItem[];
}) {
  const { locale } = useLanguage();
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-40px' });

  const catName = locale === 'ar' ? category.nameAr : category.nameEn;
  const catItems = filteredItems.filter((item) => item.category === category.id);

  if (catItems.length === 0) return null;

  return (
    <div ref={sectionRef} id={`cat-${category.id}`} className="scroll-mt-32 sm:scroll-mt-36">
      {/* Category Header */}
      <motion.div
        variants={fadeUp}
        initial="hidden"
        animate={isInView ? 'visible' : 'hidden'}
        className="flex items-center gap-3 mb-4 sm:mb-5"
      >
        <span className="text-xl sm:text-2xl">{category.icon}</span>
        <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-foreground">{catName}</h2>
        <div className="flex-1 h-px bg-border" />
        <span className="text-[11px] sm:text-xs text-muted-foreground font-medium">
          {catItems.length} {locale === 'ar' ? 'صنف' : 'items'}
        </span>
      </motion.div>

      {/* Items Grid */}
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate={isInView ? 'visible' : 'hidden'}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-5"
      >
        {catItems.map((item, i) => (
          <MenuItemCard key={item.id} item={item} index={i} />
        ))}
      </motion.div>
    </div>
  );
}

// ==============================
// STICKY CATEGORY NAVIGATION
// ==============================
function CategoryNav({
  activeCategory,
  onSelectCategory,
}: {
  activeCategory: string;
  onSelectCategory: (id: string) => void;
}) {
  const { locale } = useLanguage();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showFadeStart, setShowFadeStart] = useState(false);
  const [showFadeEnd, setShowFadeEnd] = useState(true);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    const checkFade = () => {
      setShowFadeStart(el.scrollLeft > 10);
      setShowFadeEnd(el.scrollLeft < el.scrollWidth - el.clientWidth - 10);
    };

    checkFade();
    el.addEventListener('scroll', checkFade, { passive: true });
    window.addEventListener('resize', checkFade);

    return () => {
      el.removeEventListener('scroll', checkFade);
      window.removeEventListener('resize', checkFade);
    };
  }, []);

  // Scroll active tab into view
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const activeEl = el.querySelector(`[data-cat="${activeCategory}"]`);
    if (activeEl) {
      activeEl.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'center',
      });
    }
  }, [activeCategory]);

  const handleCategoryClick = (id: string) => {
    onSelectCategory(id);

    // Scroll the page to the category section
    const section = document.getElementById(`cat-${id}`);
    if (section) {
      const headerOffset = 120;
      const elementPosition = section.getBoundingClientRect().top + window.scrollY;
      window.scrollTo({ top: elementPosition - headerOffset, behavior: 'smooth' });
    }
  };

  return (
    <div className="sticky top-14 sm:top-16 z-30 bg-background/90 backdrop-blur-lg border-b border-border/60">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 relative">
        {/* Start fade */}
        <AnimatePresence>
          {showFadeStart && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className={`absolute top-0 bottom-0 w-6 sm:w-8 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none ${
                locale === 'ar' ? 'right-0' : 'left-0'
              }`}
            />
          )}
        </AnimatePresence>

        {/* End fade */}
        <AnimatePresence>
          {showFadeEnd && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className={`absolute top-0 bottom-0 w-6 sm:w-8 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none ${
                locale === 'ar' ? 'left-0' : 'right-0'
              }`}
            />
          )}
        </AnimatePresence>

        <div
          ref={scrollRef}
          className="flex gap-1 sm:gap-1.5 overflow-x-auto no-scrollbar py-2.5 sm:py-3"
        >
          {menuCategories.map((cat) => {
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                data-cat={cat.id}
                onClick={() => handleCategoryClick(cat.id)}
                className={`
                  flex items-center gap-1 sm:gap-1.5 px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-medium
                  whitespace-nowrap transition-all duration-200 shrink-0
                  ${
                    isActive
                      ? 'bg-primary text-primary-foreground shadow-md shadow-primary/20'
                      : 'bg-secondary/50 text-foreground/70 hover:bg-secondary hover:text-foreground'
                  }
                `}
              >
                <span className="text-sm sm:text-base">{cat.icon}</span>
                <span>{locale === 'ar' ? cat.nameAr : cat.nameEn}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ==============================
// MAIN MENU PAGE
// ==============================
export default function MenuPage() {
  const { menuCategories } = useRestaurantData();
  const { locale } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const defaultCatId = menuCategories[0]?.id ?? '';
  const [activeCategory, setActiveCategory] = useState(defaultCatId);

  useEffect(() => {
    if (defaultCatId && !menuCategories.some((c) => c.id === activeCategory)) {
      setActiveCategory(defaultCatId);
    }
  }, [menuCategories, activeCategory, defaultCatId]);

  // Filter items by search
  const filteredItems = useMemo(() => {
    if (!searchQuery.trim()) return menuCategories.flatMap((c) => c.items);

    const query = searchQuery.trim().toLowerCase();
    return menuCategories
      .flatMap((c) => c.items)
      .filter(
        (item) =>
          item.nameAr.toLowerCase().includes(query) ||
          item.nameEn.toLowerCase().includes(query)
      );
  }, [searchQuery]);

  // Check if we have any results
  const hasResults = filteredItems.length > 0;

  // Determine which categories have matching items
  const categoriesWithItems = menuCategories.filter((cat) =>
    filteredItems.some((item) => item.category === cat.id)
  );

  // Derive effective active category (fallback to first available when current has no items)
  const effectiveActiveCategory = useMemo(() => {
    if (categoriesWithItems.find((c) => c.id === activeCategory)) {
      return activeCategory;
    }
    return categoriesWithItems.length > 0 ? categoriesWithItems[0].id : activeCategory;
  }, [activeCategory, categoriesWithItems]);

  return (
    <main className="flex-1">
      {/* Header Section */}
      <section className="py-6 sm:py-10 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="text-center"
          >
            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-foreground">
              {t(locale, 'menuTitle')}
            </h1>
            <p className="mt-2 sm:mt-3 text-muted-foreground text-sm sm:text-base max-w-xl mx-auto">
              {t(locale, 'menuSubtitle')}
            </p>
            <div className="mt-3 sm:mt-4 mx-auto w-16 h-1 rounded-full bg-gradient-to-r from-gold to-primary" />
          </motion.div>

          {/* Search Bar */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-5 sm:mt-8 max-w-lg mx-auto relative"
          >
            <Search className="absolute start-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t(locale, 'searchMenu')}
              className={`ps-10 pe-10 h-11 sm:h-12 rounded-xl bg-secondary/30 border-border/60 text-sm ${
                locale === 'ar' ? 'text-right' : 'text-left'
              }`}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute end-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Clear search"
              >
                <X className="size-4" />
              </button>
            )}
          </motion.div>
        </div>
      </section>

      {/* Category Navigation (Sticky) */}
      <CategoryNav
        activeCategory={effectiveActiveCategory}
        onSelectCategory={setActiveCategory}
      />

      {/* Menu Content */}
      <section className="py-6 sm:py-12 lg:py-16">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          {hasResults ? (
            <div className="space-y-10 sm:space-y-16 lg:space-y-20">
              {categoriesWithItems.map((cat) => (
                <CategorySection
                  key={cat.id}
                  category={cat}
                  filteredItems={filteredItems}
                />
              ))}
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
              className="text-center py-20"
            >
              <div className="mx-auto w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-5">
                <Search className="size-7 text-muted-foreground" />
              </div>
              <p className="text-lg font-semibold text-foreground">
                {t(locale, 'noResults')}
              </p>
              <p className="mt-2 text-sm text-muted-foreground">
                {locale === 'ar'
                  ? 'جرب البحث بكلمات أخرى'
                  : 'Try searching with different keywords'}
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSearchQuery('')}
                className="mt-5 rounded-lg"
              >
                <X className="size-3.5" />
                {locale === 'ar' ? 'مسح البحث' : 'Clear Search'}
              </Button>
            </motion.div>
          )}
        </div>
      </section>
    </main>
  );
}
