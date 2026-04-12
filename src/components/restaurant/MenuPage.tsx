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
import { menuCategories, type MenuItem, type MenuCategory } from '@/lib/menu-data';

// ==============================
// ANIMATION VARIANTS
// ==============================
const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] },
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
    transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] },
  },
};

// ==============================
// MENU ITEM CARD
// ==============================
function MenuItemCard({ item, index }: { item: MenuItem; index: number }) {
  const { locale } = useLanguage();
  const { openCustomizer } = useCart();

  const name = locale === 'ar' ? item.nameAr : item.nameEn;
  const desc = locale === 'ar' ? item.descAr : item.descEn;
  const hasPriceVariants = item.options?.priceVariants && item.options.priceVariants.length > 0;
  const lowestPrice = hasPriceVariants
    ? Math.min(...item.options!.priceVariants!.map((v) => v.price))
    : item.price;

  return (
    <motion.div
      variants={scaleIn}
      custom={index}
      className="card-hover bg-card rounded-2xl border overflow-hidden shadow-sm"
    >
      {/* Image */}
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={item.image}
          alt={name}
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
          loading="lazy"
        />
        {/* Badges */}
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

      {/* Content */}
      <div className="p-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-bold text-foreground text-sm sm:text-base leading-snug">
            {name}
          </h3>
        </div>
        <p className="mt-1.5 text-muted-foreground text-xs leading-relaxed line-clamp-2">
          {desc}
        </p>

        {/* Price & Add button */}
        <div className="mt-3 flex items-center justify-between gap-3">
          <div>
            {hasPriceVariants ? (
              <div className="flex items-baseline gap-1">
                <span className="text-xs text-muted-foreground">
                  {locale === 'ar' ? 'ابدأ من' : 'From'}
                </span>
                <span className="text-lg font-extrabold text-primary">
                  {lowestPrice}
                </span>
                <span className="text-xs text-muted-foreground">
                  {t(locale, 'sar')}
                </span>
              </div>
            ) : (
              <div className="flex items-baseline gap-1">
                <span className="text-lg font-extrabold text-primary">
                  {item.price}
                </span>
                <span className="text-xs text-muted-foreground">
                  {t(locale, 'sar')}
                </span>
              </div>
            )}
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
  category: MenuCategory;
  filteredItems: MenuItem[];
}) {
  const { locale } = useLanguage();
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-40px' });

  const catName = locale === 'ar' ? category.nameAr : category.nameEn;
  const catItems = filteredItems.filter((item) => item.category === category.id);

  if (catItems.length === 0) return null;

  return (
    <div ref={sectionRef} id={`cat-${category.id}`} className="scroll-mt-36">
      {/* Category Header */}
      <motion.div
        variants={fadeUp}
        initial="hidden"
        animate={isInView ? 'visible' : 'hidden'}
        className="flex items-center gap-3 mb-5"
      >
        <span className="text-2xl">{category.icon}</span>
        <h2 className="text-xl sm:text-2xl font-bold text-foreground">{catName}</h2>
        <div className="flex-1 h-px bg-border" />
        <span className="text-xs text-muted-foreground font-medium">
          {catItems.length} {locale === 'ar' ? 'صنف' : 'items'}
        </span>
      </motion.div>

      {/* Items Grid */}
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate={isInView ? 'visible' : 'hidden'}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5"
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
      const headerOffset = 140;
      const elementPosition = section.getBoundingClientRect().top + window.scrollY;
      window.scrollTo({ top: elementPosition - headerOffset, behavior: 'smooth' });
    }
  };

  return (
    <div className="sticky top-16 sm:top-[4.5rem] z-30 bg-background/80 backdrop-blur-lg border-b border-border/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Start fade */}
        <AnimatePresence>
          {showFadeStart && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className={`absolute top-0 bottom-0 w-8 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none ${
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
              className={`absolute top-0 bottom-0 w-8 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none ${
                locale === 'ar' ? 'left-0' : 'right-0'
              }`}
            />
          )}
        </AnimatePresence>

        <div
          ref={scrollRef}
          className="flex gap-1 overflow-x-auto no-scrollbar py-3"
        >
          {menuCategories.map((cat) => {
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                data-cat={cat.id}
                onClick={() => handleCategoryClick(cat.id)}
                className={`
                  flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium
                  whitespace-nowrap transition-all duration-200 shrink-0
                  ${
                    isActive
                      ? 'bg-primary text-primary-foreground shadow-md shadow-primary/20'
                      : 'bg-secondary/50 text-foreground/70 hover:bg-secondary hover:text-foreground'
                  }
                `}
              >
                <span className="text-base">{cat.icon}</span>
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
  const { locale } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('cat_chicken');

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
      <section className="py-10 sm:py-14 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="text-center"
          >
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-foreground">
              {t(locale, 'menuTitle')}
            </h1>
            <p className="mt-3 text-muted-foreground text-sm sm:text-base max-w-xl mx-auto">
              {t(locale, 'menuSubtitle')}
            </p>
            <div className="mt-4 mx-auto w-16 h-1 rounded-full bg-gradient-to-r from-gold to-primary" />
          </motion.div>

          {/* Search Bar */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-8 max-w-lg mx-auto relative"
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
      <section className="py-8 sm:py-12 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {hasResults ? (
            <div className="space-y-14 sm:space-y-16 lg:space-y-20">
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
