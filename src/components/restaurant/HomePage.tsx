'use client';

import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import {
  Leaf,
  Flame,
  Truck,
  BadgeDollarSign,
  Star,
  MapPin,
  Clock,
  ChevronLeft,
  ChevronRight,
  Plus,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useNavigation, useLanguage, useCart } from '@/lib/store';
import { t, type TranslationKey } from '@/lib/i18n';
import { popularItems, branches, reviews, type MenuItem } from '@/lib/menu-data';

// ==============================
// ANIMATION VARIANTS
// ==============================
const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] as const },
  }),
};

const staggerContainer = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.12 },
  },
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.92 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const },
  },
};

// ==============================
// SECTION HEADING
// ==============================
function SectionHeading({
  title,
  subtitle,
}: {
  title: string;
  subtitle?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });

  return (
    <div ref={ref} className="text-center mb-10 sm:mb-14">
      <motion.h2
        variants={fadeUp}
        initial="hidden"
        animate={isInView ? 'visible' : 'hidden'}
        className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground"
      >
        {title}
      </motion.h2>
      {subtitle && (
        <motion.p
          variants={fadeUp}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          custom={1}
          className="mt-3 text-muted-foreground text-sm sm:text-base max-w-xl mx-auto"
        >
          {subtitle}
        </motion.p>
      )}
      <motion.div
        variants={fadeUp}
        initial="hidden"
        animate={isInView ? 'visible' : 'hidden'}
        custom={2}
        className="mt-4 mx-auto w-16 h-1 rounded-full bg-gradient-to-r from-gold to-primary"
      />
    </div>
  );
}

// ==============================
// 1. HERO SECTION
// ==============================
function HeroSection() {
  const { locale } = useLanguage();
  const { navigate } = useNavigation();

  return (
    <section className="relative min-h-[70vh] sm:min-h-[80vh] flex items-center overflow-hidden -mt-16 sm:-mt-[72px] pt-[calc(4rem+env(safe-area-inset-top))] sm:pt-[calc(4.5rem+env(safe-area-inset-top))]">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src="/images/hero-bg.jpg"
          alt={t(locale, 'heroTitle')}
          className="w-full h-full object-cover"
        />
        {/* Dark gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/70" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-black/10" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-16 sm:py-20">
        <div className="max-w-2xl">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Badge className="bg-gold/20 text-gold border-gold/30 text-xs px-3 py-1 mb-6 backdrop-blur-sm">
              <Star className="size-3 fill-gold text-gold me-1.5" />
              {t(locale, 'restaurantSlogan')}
            </Badge>
          </motion.div>

          {/* Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-tight"
          >
            {t(locale, 'heroTitle')}
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.55 }}
            className="mt-5 text-base sm:text-lg text-white/80 leading-relaxed max-w-lg"
          >
            {t(locale, 'heroSubtitle')}
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
            className="mt-8 flex flex-col sm:flex-row gap-3"
          >
            <Button
              size="lg"
              onClick={() => navigate('menu')}
              className="bg-gold text-gold-foreground hover:bg-gold/90 text-base px-8 py-6 rounded-xl shadow-lg shadow-gold/25 transition-all"
            >
              {t(locale, 'heroCta')}
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => navigate('menu')}
              className="bg-white/10 text-white border-white/20 hover:bg-white/20 backdrop-blur-sm text-base px-8 py-6 rounded-xl transition-all"
            >
              {t(locale, 'heroSecondaryCta')}
            </Button>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.9 }}
            className="mt-12 flex items-center gap-8 sm:gap-12"
          >
            {[
              { value: '+4', label: locale === 'ar' ? 'فروع' : 'Branches' },
              { value: '4.9', label: locale === 'ar' ? 'تقييم' : 'Rating' },
              { value: '+10K', label: locale === 'ar' ? 'عميل سعيد' : 'Happy Clients' },
            ].map((stat) => (
              <div key={stat.label}>
                <p className="text-2xl sm:text-3xl font-bold text-gold">{stat.value}</p>
                <p className="text-xs sm:text-sm text-white/60 mt-0.5">{stat.label}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-background to-transparent z-10" />
    </section>
  );
}

// ==============================
// 2. POPULAR DISHES SECTION
// ==============================
function PopularDishesSection() {
  const { locale } = useLanguage();
  const { openCustomizer } = useCart();
  const { navigate } = useNavigation();

  return (
    <section className="py-12 sm:py-16 lg:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          title={t(locale, 'popularDishes')}
          subtitle={t(locale, 'popularDishesSubtitle')}
        />

        {/* Responsive grid: 2 cols on mobile, 3 on tablet, 4 on desktop */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 lg:gap-5"
        >
          {popularItems.map((item, i) => (
            <PopularItemCard
              key={item.id}
              item={item}
              index={i}
              onAdd={openCustomizer}
            />
          ))}
        </motion.div>

        {/* View All button */}
        <div className="mt-8 sm:mt-10 text-center">
          <Button
            variant="outline"
            size="lg"
            onClick={() => navigate('menu')}
            className="rounded-xl px-6 sm:px-8"
          >
            {t(locale, 'viewAll')}
          </Button>
        </div>
      </div>
    </section>
  );
}

function PopularItemCard({
  item,
  index,
  onAdd,
}: {
  item: MenuItem;
  index: number;
  onAdd: (id: string) => void;
}) {
  const { locale } = useLanguage();

  const name = locale === 'ar' ? item.nameAr : item.nameEn;
  const desc = locale === 'ar' ? item.descAr : item.descEn;

  return (
    <motion.div
      variants={scaleIn}
      custom={index}
      className="card-hover bg-card rounded-xl sm:rounded-2xl border overflow-hidden shadow-sm"
    >
      {/* Image */}
      <div className="relative aspect-[4/3] sm:aspect-[4/3] overflow-hidden">
        <img
          src={item.image}
          alt={name}
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
          loading="lazy"
        />
        {/* Badges */}
        <div className="absolute top-3 start-3 flex flex-col gap-1.5">
          {item.isBestSeller && (
            <Badge className="bg-gold text-gold-foreground text-[9px] sm:text-[10px] px-1.5 sm:px-2 py-0.5 shadow-md">
              {t(locale, 'bestSeller')}
            </Badge>
          )}
          {item.isNew && (
            <Badge className="bg-green-600 text-white text-[9px] sm:text-[10px] px-1.5 sm:px-2 py-0.5 shadow-md">
              {t(locale, 'newItem')}
            </Badge>
          )}
          {item.isSpicy && (
            <Badge className="bg-red-500 text-white text-[9px] sm:text-[10px] px-1.5 sm:px-2 py-0.5 shadow-md">
              {t(locale, 'spicy')}
            </Badge>
          )}
        </div>
        {/* Price overlay */}
        <div className="absolute bottom-2 sm:bottom-3 end-2 sm:end-3">
          <Badge className="bg-black/70 text-white backdrop-blur-sm text-[11px] sm:text-sm px-2 sm:px-2.5 py-0.5 sm:py-1 font-bold">
            {item.price} {t(locale, 'sar')}
          </Badge>
        </div>
      </div>

      {/* Content */}
      <div className="p-2.5 sm:p-4">
        <h3 className="font-bold text-foreground text-xs sm:text-base leading-snug line-clamp-1 sm:line-clamp-2">{name}</h3>
        <p className="mt-1 text-muted-foreground text-[10px] sm:text-xs leading-relaxed line-clamp-1 sm:line-clamp-2">
          {desc}
        </p>
        <Button
          size="sm"
          onClick={() => onAdd(item.id)}
          className="mt-2 sm:mt-3 w-full bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg text-[10px] sm:text-xs h-8 sm:h-9"
        >
          <Plus className="size-3 sm:size-3.5" />
          <span className="hidden sm:inline">{t(locale, 'addToCart')}</span>
        </Button>
      </div>
    </motion.div>
  );
}

// ==============================
// 3. FEATURES SECTION
// ==============================
function FeaturesSection() {
  const { locale } = useLanguage();

  const features = [
    {
      icon: Leaf,
      titleKey: 'feature1Title' as TranslationKey,
      descKey: 'feature1Desc' as TranslationKey,
      gradient: 'from-green-50 to-emerald-50',
      iconBg: 'bg-green-100 text-green-600',
    },
    {
      icon: Flame,
      titleKey: 'feature2Title' as TranslationKey,
      descKey: 'feature2Desc' as TranslationKey,
      gradient: 'from-orange-50 to-amber-50',
      iconBg: 'bg-orange-100 text-orange-600',
    },
    {
      icon: Truck,
      titleKey: 'feature3Title' as TranslationKey,
      descKey: 'feature3Desc' as TranslationKey,
      gradient: 'from-blue-50 to-sky-50',
      iconBg: 'bg-blue-100 text-blue-600',
    },
    {
      icon: BadgeDollarSign,
      titleKey: 'feature4Title' as TranslationKey,
      descKey: 'feature4Desc' as TranslationKey,
      gradient: 'from-purple-50 to-fuchsia-50',
      iconBg: 'bg-purple-100 text-purple-600',
    },
  ];

  return (
    <section className="py-16 sm:py-20 lg:py-24 bg-warm/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          title={t(locale, 'featuresTitle')}
          subtitle={t(locale, 'featuresSubtitle')}
        />

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5"
        >
          {features.map((feature) => (
            <motion.div
              key={feature.titleKey}
              variants={fadeUp}
              className="card-hover bg-card rounded-2xl p-5 sm:p-6 border shadow-sm text-center"
            >
              <div
                className={`inline-flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 rounded-xl ${feature.iconBg} mb-4`}
              >
                <feature.icon className="size-6 sm:size-7" />
              </div>
              <h3 className="font-bold text-foreground text-sm sm:text-base">
                {t(locale, feature.titleKey)}
              </h3>
              <p className="mt-2 text-muted-foreground text-xs sm:text-sm leading-relaxed">
                {t(locale, feature.descKey)}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

// ==============================
// 4. OFFERS SECTION
// ==============================
function OffersSection() {
  const { locale } = useLanguage();
  const { navigate } = useNavigation();

  const offers = [
    {
      titleKey: 'familyOffer' as TranslationKey,
      descKey: 'familyOfferDesc' as TranslationKey,
      priceKey: 'familyOfferPrice' as TranslationKey,
      gradient: 'from-primary via-primary/90 to-primary/80',
      emoji: '👨‍👩‍👧‍👦',
      popular: true,
    },
    {
      titleKey: 'coupleOffer' as TranslationKey,
      descKey: 'coupleOfferDesc' as TranslationKey,
      priceKey: 'coupleOfferPrice' as TranslationKey,
      gradient: 'from-gold via-gold/90 to-gold/80',
      emoji: '👫',
      popular: false,
    },
    {
      titleKey: 'lunchOffer' as TranslationKey,
      descKey: 'lunchOfferDesc' as TranslationKey,
      priceKey: 'lunchOfferPrice' as TranslationKey,
      gradient: 'from-emerald-600 via-emerald-600/90 to-emerald-500',
      emoji: '☀️',
      popular: false,
    },
  ];

  return (
    <section className="py-16 sm:py-20 lg:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          title={t(locale, 'offersTitle')}
          subtitle={t(locale, 'offersSubtitle')}
        />

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
        >
          {offers.map((offer, i) => (
            <motion.div
              key={offer.titleKey}
              variants={fadeUp}
              custom={i}
              className={`relative card-hover rounded-2xl p-6 sm:p-7 overflow-hidden bg-gradient-to-br ${offer.gradient} text-white shadow-lg`}
            >
              {/* Decorative circle */}
              <div className="absolute -top-8 -end-8 w-32 h-32 rounded-full bg-white/10" />
              <div className="absolute -bottom-4 -start-4 w-24 h-24 rounded-full bg-white/5" />

              <div className="relative z-10">
                {/* Popular badge */}
                {offer.popular && (
                  <Badge className="absolute -top-1 -end-1 bg-white/20 text-white border-white/30 text-[10px] backdrop-blur-sm">
                    ⭐ {locale === 'ar' ? 'الأكثر طلباً' : 'Most Popular'}
                  </Badge>
                )}

                <span className="text-3xl sm:text-4xl block mb-4">{offer.emoji}</span>
                <h3 className="text-lg sm:text-xl font-bold">{t(locale, offer.titleKey)}</h3>
                <p className="mt-2 text-white/80 text-sm leading-relaxed">
                  {t(locale, offer.descKey)}
                </p>
                <div className="mt-5 flex items-center justify-between">
                  <div>
                    <span className="text-3xl sm:text-4xl font-extrabold">
                      {t(locale, offer.priceKey)}
                    </span>
                    <span className="text-white/70 text-sm ms-1">{t(locale, 'sar')}</span>
                  </div>
                  <Button
                    size="lg"
                    onClick={() => navigate('menu')}
                    className="bg-white text-foreground hover:bg-white/90 rounded-xl shadow-md text-sm font-bold"
                  >
                    {t(locale, 'orderNow')}
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

// ==============================
// 5. BRANCHES PREVIEW SECTION
// ==============================
function BranchesPreviewSection() {
  const { locale } = useLanguage();
  const { navigate } = useNavigation();

  const previewBranches = branches.slice(0, 2);

  return (
    <section className="py-16 sm:py-20 lg:py-24 bg-warm/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          title={t(locale, 'branchesTitle')}
          subtitle={t(locale, 'branchesSubtitle')}
        />

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          className="grid grid-cols-1 sm:grid-cols-2 gap-5"
        >
          {previewBranches.map((branch, i) => (
            <motion.div
              key={branch.id}
              variants={fadeUp}
              custom={i}
              className="card-hover bg-card rounded-2xl border p-6 shadow-sm"
            >
              <div className="flex items-start gap-4">
                {/* Branch icon */}
                <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                  <MapPin className="size-5 text-primary" />
                </div>

                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-foreground text-base">
                    {locale === 'ar' ? branch.nameAr : branch.nameEn}
                  </h3>
                  <p className="text-muted-foreground text-sm mt-0.5">
                    {locale === 'ar' ? branch.cityAr : branch.cityEn}
                  </p>
                </div>
              </div>

              <div className="mt-4 space-y-2.5">
                <div className="flex items-start gap-2.5 text-sm text-muted-foreground">
                  <MapPin className="size-4 mt-0.5 flex-shrink-0 text-primary/60" />
                  <span className="leading-relaxed">
                    {locale === 'ar' ? branch.addressAr : branch.addressEn}
                  </span>
                </div>
                <div className="flex items-center gap-2.5 text-sm text-muted-foreground">
                  <Clock className="size-4 flex-shrink-0 text-primary/60" />
                  <span>
                    {locale === 'ar' ? branch.hoursAr : branch.hoursEn}
                  </span>
                </div>
              </div>

              <Button
                variant="outline"
                size="sm"
                className="mt-4 w-full rounded-lg"
                onClick={() => navigate('branches')}
              >
                {t(locale, 'branchDirections')}
              </Button>
            </motion.div>
          ))}
        </motion.div>

        {/* View All Branches */}
        <div className="mt-10 text-center">
          <Button
            size="lg"
            onClick={() => navigate('branches')}
            className="rounded-xl px-8"
          >
            {t(locale, 'viewAllBranches')}
          </Button>
        </div>
      </div>
    </section>
  );
}

// ==============================
// 6. REVIEWS SECTION
// ==============================
function ReviewsSection() {
  const { locale } = useLanguage();
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: 'left' | 'right') => {
    if (!scrollRef.current) return;
    const amount = dir === 'left' ? -300 : 300;
    scrollRef.current.scrollBy({ left: amount, behavior: 'smooth' });
  };

  return (
    <section className="py-16 sm:py-20 lg:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          title={t(locale, 'reviewsTitle')}
          subtitle={t(locale, 'reviewsSubtitle')}
        />

        {/* Mobile scroll container */}
        <div className="relative overflow-x-clip">
          <div
            ref={scrollRef}
            className="flex gap-4 overflow-x-auto no-scrollbar pb-4 -mx-4 px-4 lg:mx-0 lg:px-0 lg:grid lg:grid-cols-3 lg:gap-5 lg:overflow-visible"
          >
            {reviews.map((review, i) => (
              <motion.div
                key={review.id}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-30px' }}
                custom={i}
                className="card-hover min-w-[280px] lg:min-w-0 bg-card rounded-2xl border p-5 sm:p-6 shadow-sm"
              >
                {/* Stars */}
                <div className="flex items-center gap-0.5">
                  {Array.from({ length: 5 }).map((_, j) => (
                    <Star
                      key={j}
                      className={`size-4 ${
                        j < review.rating
                          ? 'fill-gold text-gold'
                          : 'fill-muted text-muted'
                      }`}
                    />
                  ))}
                </div>

                {/* Comment */}
                <p className="mt-4 text-foreground text-sm leading-relaxed">
                  {locale === 'ar' ? review.commentAr : review.commentEn}
                </p>

                {/* Reviewer */}
                <div className="mt-4 pt-4 border-t border-border/60 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-primary font-bold text-sm">
                      {(locale === 'ar' ? review.nameAr : review.nameEn).charAt(0)}
                    </span>
                  </div>
                  <div>
                    <p className="font-semibold text-foreground text-sm">
                      {locale === 'ar' ? review.nameAr : review.nameEn}
                    </p>
                    <p className="text-muted-foreground text-xs">{review.date}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ==============================
// MAIN HOME PAGE
// ==============================
export default function HomePage() {
  return (
    <main className="flex-1">
      <HeroSection />
      <PopularDishesSection />
      <FeaturesSection />
      <OffersSection />
      <BranchesPreviewSection />
      <ReviewsSection />
    </main>
  );
}
