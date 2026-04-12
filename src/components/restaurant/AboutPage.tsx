'use client';

import React, { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import {
  Target,
  Eye,
  Shield,
  Heart,
  Leaf,
  Award,
  ChevronDown,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useLanguage } from '@/lib/store';
import { t, type TranslationKey } from '@/lib/i18n';

/* ------------------------------------------------------------------ */
/*  Animations                                                         */
/* ------------------------------------------------------------------ */
const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: i * 0.1 },
  }),
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.92 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
  },
};

/* ------------------------------------------------------------------ */
/*  Counter hook                                                       */
/* ------------------------------------------------------------------ */
function useCounter(end: number, duration = 2000, startOnView = true) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-50px' });
  const started = useRef(false);

  useEffect(() => {
    if (!startOnView || inView) {
      if (started.current) return;
      started.current = true;
      let startTime: number | null = null;
      const step = (timestamp: number) => {
        if (!startTime) startTime = timestamp;
        const progress = Math.min((timestamp - startTime) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        setCount(Math.floor(eased * end));
        if (progress < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    }
  }, [end, duration, startOnView, inView]);

  return { count, ref };
}

/* ------------------------------------------------------------------ */
/*  Values data                                                        */
/* ------------------------------------------------------------------ */
const valuesData = [
  { icon: Shield, titleKey: 'aboutQuality' as TranslationKey, descKey: 'aboutQualityDesc' as TranslationKey, color: 'text-amber-600' },
  { icon: Heart, titleKey: 'aboutAuthenticity' as TranslationKey, descKey: 'aboutAuthenticityDesc' as TranslationKey, color: 'text-rose-500' },
  { icon: Leaf, titleKey: 'aboutFreshness' as TranslationKey, descKey: 'aboutFreshnessDesc' as TranslationKey, color: 'text-emerald-600' },
  { icon: Award, titleKey: 'aboutService' as TranslationKey, descKey: 'aboutServiceDesc' as TranslationKey, color: 'text-amber-700' },
];

/* ------------------------------------------------------------------ */
/*  Stats data                                                         */
/* ------------------------------------------------------------------ */
const statsData = [
  { value: 15, suffix: '+', key: 'aboutStatYears' as TranslationKey, fallbackAr: 'سنوات خبرة', fallbackEn: 'Years Experience' },
  { value: 4, suffix: '', key: 'aboutStatBranches' as TranslationKey, fallbackAr: 'فروع', fallbackEn: 'Branches' },
  { value: 50000, suffix: '+', key: 'aboutStatCustomers' as TranslationKey, fallbackAr: 'عميل سعيد', fallbackEn: 'Happy Customers' },
  { value: 40, suffix: '+', key: 'aboutStatDishes' as TranslationKey, fallbackAr: 'طبق مميز', fallbackEn: 'Special Dishes' },
];

/* ------------------------------------------------------------------ */
/*  Stat Counter Component                                             */
/* ------------------------------------------------------------------ */
function StatCounter({ value, suffix, labelAr, labelEn, index }: {
  value: number;
  suffix: string;
  labelAr: string;
  labelEn: string;
  index: number;
}) {
  const { locale } = useLanguage();
  const { count, ref } = useCounter(value, 2200);

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      custom={index}
      variants={fadeUp}
      className="text-center"
    >
      <div className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gold mb-2 tabular-nums">
        {count.toLocaleString()}
        <span className="text-gold/70">{suffix}</span>
      </div>
      <p className="text-primary-foreground/70 text-sm sm:text-base font-medium">
        {locale === 'ar' ? labelAr : labelEn}
      </p>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */
export default function AboutPage() {
  const { locale, isRTL } = useLanguage();

  return (
    <main className="min-h-screen" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* ============================================================ */}
      {/*  HERO / HEADER SECTION                                        */}
      {/* ============================================================ */}
      <section className="relative overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary/90 to-amber-900/80" />

        {/* Decorative pattern overlay */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />

        {/* Decorative circles */}
        <div className="absolute -top-20 -start-20 w-72 h-72 rounded-full bg-gold/10 blur-3xl" />
        <div className="absolute -bottom-20 -end-20 w-96 h-96 rounded-full bg-amber-400/10 blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28 lg:py-36 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* Gold diamond */}
            <div className="flex justify-center mb-6">
              <div className="w-3 h-3 bg-gold rotate-45 rounded-sm" />
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-4 leading-tight">
              {t(locale, 'aboutTitle')}
            </h1>
            <p className="text-lg sm:text-xl text-white/75 max-w-2xl mx-auto leading-relaxed">
              {t(locale, 'aboutSubtitle')}
            </p>
          </motion.div>

          {/* Scroll indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.6 }}
            className="mt-12"
          >
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              className="flex justify-center"
            >
              <ChevronDown className="size-6 text-white/40" />
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ============================================================ */}
      {/*  STORY SECTION                                                */}
      {/* ============================================================ */}
      <section className="py-16 sm:py-20 lg:py-28 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            {/* Image side */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-80px' }}
              variants={scaleIn}
              className="relative"
            >
              <div className="relative rounded-2xl overflow-hidden shadow-2xl shadow-primary/10 aspect-[4/3]">
                <img
                  src="/images/hero-bg.jpg"
                  alt={locale === 'ar' ? 'مطعم الواحة' : 'Al Wahah Restaurant'}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    (target.parentElement as HTMLElement).classList.add('bg-gradient-to-br', 'from-amber-100', 'to-amber-200');
                  }}
                />
                {/* Decorative overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent" />
              </div>

              {/* Floating accent card */}
              <motion.div
                initial={{ opacity: 0, x: isRTL ? 30 : -30, y: 20 }}
                whileInView={{ opacity: 1, x: 0, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="absolute -bottom-6 ${isRTL ? '-start-6' : '-end-6'} bg-white rounded-xl shadow-xl p-4 flex items-center gap-3 border border-border/50"
                style={{ [isRTL ? 'left' : 'right']: '-1.5rem' }}
              >
                <div className="w-12 h-12 rounded-full bg-gold/15 flex items-center justify-center shrink-0">
                  <div className="w-3 h-3 bg-gold rotate-45 rounded-sm" />
                </div>
                <div>
                  <p className="text-sm font-bold text-primary">
                    {locale === 'ar' ? 'منذ 2009' : 'Since 2009'}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {locale === 'ar' ? 'أكثر من 15 عاماً من التميّز' : 'Over 15 years of excellence'}
                  </p>
                </div>
              </motion.div>
            </motion.div>

            {/* Text side */}
            <div className="space-y-6">
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-80px' }}
                custom={0}
                variants={fadeUp}
              >
                <span className="text-sm font-semibold text-gold tracking-wide uppercase">
                  {locale === 'ar' ? 'قصتنا' : 'Our Story'}
                </span>
                <h2 className="text-3xl sm:text-4xl font-bold text-foreground mt-2 leading-tight">
                  {locale === 'ar' ? 'رحلة الطعم الأصيل' : 'A Journey of Authentic Flavor'}
                </h2>
              </motion.div>

              {(['aboutP1', 'aboutP2', 'aboutP3'] as TranslationKey[]).map((key, i) => (
                <motion.p
                  key={key}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: '-50px' }}
                  custom={i + 1}
                  variants={fadeUp}
                  className="text-muted-foreground leading-relaxed text-base sm:text-[17px]"
                >
                  {t(locale, key)}
                </motion.p>
              ))}

              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                custom={4}
                variants={fadeUp}
                className="pt-2"
              >
                <div className="h-px w-16 bg-gold/40 rounded-full" />
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/*  MISSION & VISION SECTION                                     */}
      {/* ============================================================ */}
      <section className="py-16 sm:py-20 lg:py-24 bg-gradient-to-b from-amber-50/80 to-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section heading */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            custom={0}
            variants={fadeUp}
            className="text-center mb-12 sm:mb-16"
          >
            <span className="text-sm font-semibold text-gold tracking-wide uppercase">
              {locale === 'ar' ? 'من نكون' : 'Who We Are'}
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mt-2">
              {locale === 'ar' ? 'رسالتنا ورؤيتنا' : 'Our Mission & Vision'}
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
            {/* Mission Card */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-50px' }}
              custom={0}
              variants={fadeUp}
            >
              <Card className="relative overflow-hidden border-border/60 hover:border-gold/30 hover:shadow-lg hover:shadow-gold/5 transition-all duration-300 h-full">
                <div className="absolute top-0 start-0 w-1 h-full bg-gradient-to-b from-gold to-amber-500 rounded-e" />
                <CardContent className="p-6 sm:p-8 flex flex-col items-start gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-gold/10 flex items-center justify-center shrink-0">
                    <Target className="size-7 text-gold" />
                  </div>
                  <div>
                    <h3 className="text-xl sm:text-2xl font-bold text-foreground mb-3">
                      {t(locale, 'aboutMissionTitle')}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed text-[15px] sm:text-base">
                      {t(locale, 'aboutMissionDesc')}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Vision Card */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-50px' }}
              custom={1}
              variants={fadeUp}
            >
              <Card className="relative overflow-hidden border-border/60 hover:border-gold/30 hover:shadow-lg hover:shadow-gold/5 transition-all duration-300 h-full">
                <div className="absolute top-0 start-0 w-1 h-full bg-gradient-to-b from-primary to-amber-700 rounded-e" />
                <CardContent className="p-6 sm:p-8 flex flex-col items-start gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0">
                    <Eye className="size-7 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-xl sm:text-2xl font-bold text-foreground mb-3">
                      {t(locale, 'aboutVisionTitle')}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed text-[15px] sm:text-base">
                      {t(locale, 'aboutVisionDesc')}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/*  VALUES SECTION                                               */}
      {/* ============================================================ */}
      <section className="py-16 sm:py-20 lg:py-28 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section heading */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            custom={0}
            variants={fadeUp}
            className="text-center mb-12 sm:mb-16"
          >
            <span className="text-sm font-semibold text-gold tracking-wide uppercase">
              {t(locale, 'aboutValuesTitle')}
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mt-2">
              {locale === 'ar' ? 'ما يميّزنا' : 'What Sets Us Apart'}
            </h2>
          </motion.div>

          {/* Values grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {valuesData.map((item, i) => {
              const IconComp = item.icon;
              return (
                <motion.div
                  key={item.titleKey}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: '-50px' }}
                  custom={i}
                  variants={fadeUp}
                >
                  <Card className="h-full text-center border-border/60 hover:border-gold/30 hover:shadow-lg hover:shadow-gold/5 hover:-translate-y-1 transition-all duration-300">
                    <CardContent className="p-6 sm:p-8 flex flex-col items-center gap-4">
                      <div className="w-16 h-16 rounded-2xl bg-amber-50 flex items-center justify-center shrink-0">
                        <IconComp className={`size-8 ${item.color}`} />
                      </div>
                      <h3 className="text-lg font-bold text-foreground">
                        {t(locale, item.titleKey)}
                      </h3>
                      <p className="text-muted-foreground text-sm leading-relaxed">
                        {t(locale, item.descKey)}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/*  STATS SECTION                                                */}
      {/* ============================================================ */}
      <section className="py-16 sm:py-20 lg:py-24 bg-primary text-primary-foreground relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute inset-0 opacity-[0.03]">
          <div
            className="w-full h-full"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='1' fill-rule='evenodd'%3E%3Cpath d='M0 40L40 0H20L0 20M40 40V20L20 40'/%3E%3C/g%3E%3C/svg%3E")`,
            }}
          />
        </div>
        <div className="absolute -top-24 start-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-full bg-gold/10 blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            custom={0}
            variants={fadeUp}
            className="text-center mb-12"
          >
            <h2 className="text-3xl sm:text-4xl font-bold">
              {locale === 'ar' ? 'الواحة بالأرقام' : 'Al Wahah in Numbers'}
            </h2>
          </motion.div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {statsData.map((stat, i) => (
              <StatCounter
                key={i}
                value={stat.value}
                suffix={stat.suffix}
                labelAr={stat.fallbackAr}
                labelEn={stat.fallbackEn}
                index={i}
              />
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
