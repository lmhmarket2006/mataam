'use client';

import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  MapPin,
  Phone,
  Clock,
  Navigation,
  ShoppingBag,
  ExternalLink,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useLanguage, useNavigation } from '@/lib/store';
import { t, type TranslationKey } from '@/lib/i18n';
import { branches, type Branch } from '@/lib/menu-data';

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

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */
function isBranchOpen(branch: Branch): boolean {
  // All branches close between 1:00 AM - 2:00 AM
  const now = new Date();
  const hours = now.getHours();
  return hours >= 11 || hours === 0; // Open 11 AM to 1-2 AM
}

function getGoogleMapsUrl(lat: number, lng: number): string {
  return `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
}

/* ------------------------------------------------------------------ */
/*  Branch Card                                                        */
/* ------------------------------------------------------------------ */
function BranchCard({ branch, index }: { branch: Branch; index: number }) {
  const { locale, isRTL } = useLanguage();
  const { navigate } = useNavigation();
  const isOpen = isBranchOpen(branch);

  const name = locale === 'ar' ? branch.nameAr : branch.nameEn;
  const city = locale === 'ar' ? branch.cityAr : branch.cityEn;
  const address = locale === 'ar' ? branch.addressAr : branch.addressEn;
  const hours = locale === 'ar' ? branch.hoursAr : branch.hoursEn;

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-50px' }}
      custom={index}
      variants={fadeUp}
    >
      <Card className="h-full border-border/60 hover:border-gold/30 hover:shadow-xl hover:shadow-gold/5 hover:-translate-y-1 transition-all duration-300 overflow-hidden group">
        {/* Top accent bar */}
        <div className="h-1 bg-gradient-to-r from-primary via-gold to-primary" />

        <CardContent className="p-5 sm:p-6 flex flex-col gap-4">
          {/* Header: name + status */}
          <div className="flex items-start justify-between gap-3">
            <div>
              <h3 className="text-xl sm:text-2xl font-bold text-foreground leading-tight">
                {name}
              </h3>
              <div className="flex items-center gap-1.5 mt-1.5 text-muted-foreground">
                <MapPin className="size-3.5 text-gold shrink-0" />
                <span className="text-sm font-medium">{city}</span>
              </div>
            </div>
            <Badge
              className={`shrink-0 text-[11px] font-semibold px-2.5 py-0.5 border-0 ${
                isOpen
                  ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400'
                  : 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400'
              }`}
            >
              <span
                className={`inline-block w-1.5 h-1.5 rounded-full me-1.5 ${
                  isOpen ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'
                }`}
              />
              {isOpen ? t(locale, 'branchOpen') : t(locale, 'branchClosed')}
            </Badge>
          </div>

          <Separator className="bg-border/40" />

          {/* Info rows */}
          <div className="space-y-3">
            {/* Address */}
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center shrink-0 mt-0.5">
                <MapPin className="size-4 text-amber-600" />
              </div>
              <div className="min-w-0">
                <p className="text-xs text-muted-foreground font-medium mb-0.5">
                  {t(locale, 'branchAddress')}
                </p>
                <p className="text-sm text-foreground leading-snug">{address}</p>
              </div>
            </div>

            {/* Phone */}
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center shrink-0 mt-0.5">
                <Phone className="size-4 text-blue-600" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground font-medium mb-0.5">
                  {t(locale, 'branchPhone')}
                </p>
                <a
                  href={`tel:${branch.phone}`}
                  className="text-sm text-foreground hover:text-primary transition-colors"
                  dir="ltr"
                >
                  {branch.phone}
                </a>
              </div>
            </div>

            {/* Hours */}
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-violet-50 flex items-center justify-center shrink-0 mt-0.5">
                <Clock className="size-4 text-violet-600" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground font-medium mb-0.5">
                  {t(locale, 'branchWorkHours')}
                </p>
                <p className="text-sm text-foreground">{hours}</p>
              </div>
            </div>
          </div>

          <Separator className="bg-border/40" />

          {/* Action buttons */}
          <div className="flex items-center gap-3">
            <a
              href={getGoogleMapsUrl(branch.lat, branch.lng)}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1"
            >
              <Button
                variant="outline"
                className="w-full flex items-center justify-center gap-2 h-10 text-sm font-medium hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all duration-200"
              >
                <Navigation className="size-4" />
                {t(locale, 'branchDirections')}
              </Button>
            </a>
            <Button
              className="flex-1 flex items-center justify-center gap-2 h-10 text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90"
              onClick={() => navigate('menu')}
            >
              <ShoppingBag className="size-4" />
              {t(locale, 'branchOrder')}
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */
export default function BranchesPage() {
  const { locale, isRTL } = useLanguage();

  return (
    <main className="min-h-screen" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* ============================================================ */}
      {/*  HEADER SECTION                                               */}
      {/* ============================================================ */}
      <section className="relative overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary/90 to-amber-900/80" />

        {/* Decorative pattern */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />

        {/* Decorative elements */}
        <div className="absolute -top-20 -end-20 w-72 h-72 rounded-full bg-gold/10 blur-3xl" />
        <div className="absolute -bottom-20 -start-20 w-80 h-80 rounded-full bg-amber-400/8 blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28 lg:py-32 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* Map icon decoration */}
            <div className="flex justify-center mb-6">
              <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-sm flex items-center justify-center">
                <MapPin className="size-7 text-gold" />
              </div>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-4 leading-tight">
              {t(locale, 'branchesPageTitle')}
            </h1>
            <p className="text-lg sm:text-xl text-white/70 max-w-2xl mx-auto leading-relaxed">
              {t(locale, 'branchesPageSubtitle')}
            </p>

            {/* Branch count badge */}
            <div className="mt-6 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm">
              <MapPin className="size-4 text-gold" />
              <span className="text-white/90 text-sm font-medium">
                {branches.length}{' '}
                {locale === 'ar' ? 'فروع في المملكة' : 'branches in Saudi Arabia'}
              </span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ============================================================ */}
      {/*  BRANCH CARDS GRID                                            */}
      {/* ============================================================ */}
      <section className="py-16 sm:py-20 lg:py-28 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
            {branches.map((branch, i) => (
              <BranchCard key={branch.id} branch={branch} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/*  MAP / DIRECTIONS SECTION                                     */}
      {/* ============================================================ */}
      <section className="py-16 sm:py-20 bg-gradient-to-b from-amber-50/60 to-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            custom={0}
            variants={fadeUp}
            className="text-center mb-10"
          >
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-3">
              {locale === 'ar' ? 'اعثر على أقرب فرع' : 'Find the Nearest Branch'}
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              {locale === 'ar'
                ? 'اضغط على الفرع للحصول على الاتجاهات عبر خرائط جوجل'
                : 'Click on any branch to get directions via Google Maps'}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {branches.map((branch, i) => {
              const name = locale === 'ar' ? branch.nameAr : branch.nameEn;
              return (
                <motion.a
                  key={branch.id}
                  href={getGoogleMapsUrl(branch.lat, branch.lng)}
                  target="_blank"
                  rel="noopener noreferrer"
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  custom={i}
                  variants={fadeUp}
                  className="group"
                >
                  <div className="flex items-center gap-3 p-4 rounded-xl border border-border/60 bg-card hover:border-gold/40 hover:shadow-md hover:shadow-gold/5 transition-all duration-200">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-gold/15 transition-colors">
                      <ExternalLink className="size-4 text-primary group-hover:text-gold transition-colors" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-foreground truncate group-hover:text-primary transition-colors">
                        {name}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">
                        {locale === 'ar' ? 'فتح في خرائط جوجل' : 'Open in Google Maps'}
                      </p>
                    </div>
                  </div>
                </motion.a>
              );
            })}
          </div>
        </div>
      </section>
    </main>
  );
}
