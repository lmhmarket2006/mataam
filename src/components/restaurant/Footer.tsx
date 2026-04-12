'use client';

import React from 'react';
import { motion } from 'framer-motion';
import {
  Phone,
  MapPin,
  Clock,
  Instagram,
  Twitter,
  MessageCircle,
} from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { useLanguage, useNavigation, type Page } from '@/lib/store';
import { t, type TranslationKey } from '@/lib/i18n';

interface FooterLinkItem {
  page: Page;
  labelKey: TranslationKey;
}

const quickLinks: FooterLinkItem[] = [
  { page: 'home', labelKey: 'home' },
  { page: 'menu', labelKey: 'menu' },
  { page: 'about', labelKey: 'about' },
  { page: 'branches', labelKey: 'branches' },
  { page: 'contact', labelKey: 'contact' },
];

interface SocialLink {
  name: string;
  icon: React.ReactNode;
  href: string;
}

const socialLinks: SocialLink[] = [
  {
    name: 'Instagram',
    icon: <Instagram className="size-4" />,
    href: '#',
  },
  {
    name: 'X (Twitter)',
    icon: <Twitter className="size-4" />,
    href: '#',
  },
  {
    name: 'Snapchat',
    icon: <MessageCircle className="size-4" />,
    href: '#',
  },
  {
    name: 'TikTok',
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="currentColor"
        className="size-4"
        aria-hidden="true"
      >
        <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 00-.79-.05A6.34 6.34 0 003.15 15.2a6.34 6.34 0 0010.86 4.46V12.7a8.28 8.28 0 005.58 2.14V11.4a4.83 4.83 0 01-3.77-1.43V6.69h3.77z" />
      </svg>
    ),
    href: '#',
  },
];

export default function Footer() {
  const { locale, isRTL } = useLanguage();
  const { navigate } = useNavigation();

  return (
    <footer className="mt-auto bg-primary text-primary-foreground pb-[env(safe-area-inset-bottom)]">
      {/* Decorative top border */}
      <div className="h-1 bg-gradient-to-r from-gold/60 via-gold to-gold/60" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main footer content */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10 py-10 lg:py-14">
          {/* Column 1: Logo & Description */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="sm:col-span-2 lg:col-span-1"
          >
            <div className="flex items-center gap-2.5 mb-4">
              {/* Decorative element */}
              <div className="relative flex items-center justify-center">
                <div className="absolute w-9 h-9 rounded-full bg-primary-foreground/10" />
                <div className="relative flex flex-col items-center gap-[3px]">
                  <div className="w-2 h-2 bg-gold rotate-45 rounded-[2px]" />
                  <div className="w-1.5 h-1.5 bg-primary-foreground/60 rotate-45 rounded-[1.5px]" />
                </div>
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-bold leading-tight tracking-wide">
                  {locale === 'ar' ? 'الواحة' : 'Al Wahah'}
                </span>
                <span className="text-[9px] text-primary-foreground/60 font-medium tracking-wider uppercase leading-none">
                  {locale === 'ar' ? 'مطعم' : 'Restaurant'}
                </span>
              </div>
            </div>
            <p className="text-primary-foreground/70 text-sm leading-relaxed max-w-xs">
              {t(locale, 'footerDescription')}
            </p>
          </motion.div>

          {/* Column 2: Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <h3 className="text-sm font-semibold mb-4 text-gold">
              {t(locale, 'footerQuickLinks')}
            </h3>
            <ul className="space-y-2.5">
              {quickLinks.map((item) => (
                <li key={item.page}>
                  <button
                    onClick={() => {
                      navigate(item.page);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="text-primary-foreground/70 text-sm hover:text-gold transition-colors duration-200 rtl:hover:-translate-x-1 ltr:hover:translate-x-1 inline-block"
                  >
                    {t(locale, item.labelKey)}
                  </button>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Column 3: Contact Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h3 className="text-sm font-semibold mb-4 text-gold">
              {t(locale, 'footerContactInfo')}
            </h3>
            <ul className="space-y-3.5">
              {/* Phone */}
              <li>
                <a
                  href="tel:+966548599988"
                  className="flex items-start gap-2.5 text-primary-foreground/70 text-sm hover:text-gold transition-colors duration-200 group"
                >
                  <Phone className="size-4 mt-0.5 text-gold/60 group-hover:text-gold transition-colors" />
                  <div dir="ltr" className="text-start">
                    +966 548 599 988
                  </div>
                </a>
              </li>

              {/* Address */}
              <li>
                <div className="flex items-start gap-2.5 text-primary-foreground/70 text-sm">
                  <MapPin className="size-4 mt-0.5 text-gold/60 shrink-0" />
                  <span>
                    {locale === 'ar'
                      ? 'الرياض - طريق الملك فهد، حي العليا'
                      : 'Riyadh - King Fahd Road, Olaya District'}
                  </span>
                </div>
              </li>

              {/* Hours */}
              <li>
                <div className="flex items-start gap-2.5 text-primary-foreground/70 text-sm">
                  <Clock className="size-4 mt-0.5 text-gold/60 shrink-0" />
                  <span>
                    {locale === 'ar'
                      ? 'يومياً 11:00 ص - 2:00 ص'
                      : 'Daily 11:00 AM - 2:00 AM'}
                  </span>
                </div>
              </li>
            </ul>
          </motion.div>

          {/* Column 4: Social Media */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <h3 className="text-sm font-semibold mb-4 text-gold">
              {t(locale, 'footerSocial')}
            </h3>
            <div className="flex items-center gap-3">
              {socialLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={link.name}
                  className="
                    flex items-center justify-center w-10 h-10 rounded-xl
                    bg-primary-foreground/10 text-primary-foreground/80
                    hover:bg-gold hover:text-gold-foreground
                    transition-all duration-200 hover:scale-110 hover:shadow-lg hover:shadow-gold/20
                  "
                >
                  {link.icon}
                </a>
              ))}
            </div>

            {/* WhatsApp order CTA */}
            <motion.a
              href="https://wa.me/966548599988"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="
                mt-6 flex items-center justify-center gap-2
                w-full px-4 py-2.5 rounded-xl
                bg-green-600 text-white text-sm font-medium
                hover:bg-green-500 transition-colors duration-200
                shadow-md shadow-green-900/30
              "
            >
              <MessageCircle className="size-4" />
              <span>
                {locale === 'ar' ? 'اطلب عبر واتساب' : 'Order via WhatsApp'}
              </span>
            </motion.a>
          </motion.div>
        </div>

        {/* Bottom bar */}
        <Separator className="bg-primary-foreground/10" />
        <div className="py-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-primary-foreground/50 text-xs">
          <p>
            &copy; {new Date().getFullYear()} {t(locale, 'restaurantName')} — {t(locale, 'footerRights')}
          </p>
          <div className="flex items-center gap-4">
            <button className="hover:text-gold transition-colors duration-200">
              {t(locale, 'footerPrivacy')}
            </button>
            <span className="text-primary-foreground/20">|</span>
            <button className="hover:text-gold transition-colors duration-200">
              {t(locale, 'footerTerms')}
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
