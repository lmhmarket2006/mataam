'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Phone,
  MapPin,
  Clock,
  Send,
  MessageCircle,
  CheckCircle2,
  Instagram,
  Twitter,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
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

/* ------------------------------------------------------------------ */
/*  Social links                                                       */
/* ------------------------------------------------------------------ */
interface SocialLink {
  name: string;
  icon: React.ReactNode;
  href: string;
  color: string;
  hoverBg: string;
}

const socialLinks: SocialLink[] = [
  {
    name: 'Instagram',
    icon: <Instagram className="size-5" />,
    href: '#',
    color: 'text-pink-600',
    hoverBg: 'hover:bg-pink-50 dark:hover:bg-pink-950/40',
  },
  {
    name: 'X (Twitter)',
    icon: <Twitter className="size-5" />,
    href: '#',
    color: 'text-foreground',
    hoverBg: 'hover:bg-accent',
  },
  {
    name: 'Snapchat',
    icon: <MessageCircle className="size-5" />,
    href: '#',
    color: 'text-yellow-500',
    hoverBg: 'hover:bg-yellow-50 dark:hover:bg-yellow-950/40',
  },
  {
    name: 'TikTok',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="size-5" aria-hidden="true">
        <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 00-.79-.05A6.34 6.34 0 003.15 15.2a6.34 6.34 0 0010.86 4.46V12.7a8.28 8.28 0 005.58 2.14V11.4a4.83 4.83 0 01-3.77-1.43V6.69h3.77z" />
      </svg>
    ),
    href: '#',
    color: 'text-foreground',
    hoverBg: 'hover:bg-accent',
  },
];

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */
export default function ContactPage() {
  const { locale, isRTL } = useLanguage();
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Just UI - simulate submission
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormData({ name: '', email: '', phone: '', message: '' });
    }, 3000);
  };

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

        {/* Decorative circles */}
        <div className="absolute -top-24 -start-24 w-80 h-80 rounded-full bg-gold/10 blur-3xl" />
        <div className="absolute -bottom-24 -end-24 w-96 h-96 rounded-full bg-amber-400/8 blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28 lg:py-32 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* Phone icon decoration */}
            <div className="flex justify-center mb-6">
              <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-sm flex items-center justify-center">
                <Phone className="size-7 text-gold" />
              </div>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-4 leading-tight">
              {t(locale, 'contactTitle')}
            </h1>
            <p className="text-lg sm:text-xl text-white/70 max-w-2xl mx-auto leading-relaxed">
              {t(locale, 'contactSubtitle')}
            </p>
          </motion.div>
        </div>
      </section>

      {/* ============================================================ */}
      {/*  CONTACT FORM + INFO                                          */}
      {/* ============================================================ */}
      <section className="py-16 sm:py-20 lg:py-28 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12">
            {/* -------------------------------------------------------- */}
            {/*  FORM (takes 3 cols on desktop)                          */}
            {/* -------------------------------------------------------- */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-80px' }}
              custom={0}
              variants={fadeUp}
              className="lg:col-span-3"
            >
              <Card className="border-border/60 overflow-hidden">
                <div className="h-1 bg-gradient-to-r from-primary via-gold to-primary" />

                <CardContent className="p-6 sm:p-8 lg:p-10">
                  <div className="mb-8">
                    <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">
                      {locale === 'ar' ? 'أرسل لنا رسالة' : 'Send Us a Message'}
                    </h2>
                    <p className="text-muted-foreground text-sm">
                      {locale === 'ar'
                        ? 'سنقوم بالرد عليكم في أقرب وقت ممكن'
                        : "We'll get back to you as soon as possible"}
                    </p>
                  </div>

                  {submitted ? (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="flex flex-col items-center justify-center py-12 text-center gap-4"
                    >
                      <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                        <CheckCircle2 className="size-8 text-emerald-600" />
                      </div>
                      <p className="text-lg font-semibold text-foreground">
                        {t(locale, 'messageSent')}
                      </p>
                    </motion.div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-5">
                      {/* Name & Email row */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <div className="space-y-2">
                          <Label htmlFor="contact-name" className="text-sm font-medium">
                            {t(locale, 'contactName')}
                          </Label>
                          <Input
                            id="contact-name"
                            type="text"
                            placeholder={locale === 'ar' ? 'أدخل اسمك' : 'Enter your name'}
                            value={formData.name}
                            onChange={(e) => handleChange('name', e.target.value)}
                            className="h-11 bg-background"
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="contact-email" className="text-sm font-medium">
                            {t(locale, 'contactEmail')}
                          </Label>
                          <Input
                            id="contact-email"
                            type="email"
                            placeholder={locale === 'ar' ? 'أدخل بريدك الإلكتروني' : 'Enter your email'}
                            value={formData.email}
                            onChange={(e) => handleChange('email', e.target.value)}
                            className="h-11 bg-background"
                            required
                          />
                        </div>
                      </div>

                      {/* Phone */}
                      <div className="space-y-2">
                        <Label htmlFor="contact-phone" className="text-sm font-medium">
                          {t(locale, 'contactPhone')}
                        </Label>
                        <Input
                          id="contact-phone"
                          type="tel"
                          dir="ltr"
                          placeholder="+966 5XX XXX XXXX"
                          value={formData.phone}
                          onChange={(e) => handleChange('phone', e.target.value)}
                          className="h-11 bg-background text-start"
                        />
                      </div>

                      {/* Message */}
                      <div className="space-y-2">
                        <Label htmlFor="contact-message" className="text-sm font-medium">
                          {t(locale, 'contactMessage')}
                        </Label>
                        <Textarea
                          id="contact-message"
                          placeholder={t(locale, 'contactMessagePlaceholder')}
                          value={formData.message}
                          onChange={(e) => handleChange('message', e.target.value)}
                          className="min-h-[140px] bg-background resize-none"
                          required
                        />
                      </div>

                      {/* Submit */}
                      <Button
                        type="submit"
                        className="w-full h-11 sm:h-12 text-base font-semibold bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-200"
                      >
                        <Send className={`size-4 ${isRTL ? 'ms-2' : 'me-2'}`} />
                        {t(locale, 'contactSend')}
                      </Button>
                    </form>
                  )}
                </CardContent>
              </Card>
            </motion.div>

            {/* -------------------------------------------------------- */}
            {/*  INFO SIDEBAR (takes 2 cols on desktop)                  */}
            {/* -------------------------------------------------------- */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-80px' }}
              custom={1}
              variants={fadeUp}
              className="lg:col-span-2 space-y-6"
            >
              {/* Contact Information Card */}
              <Card className="border-border/60 overflow-hidden">
                <div className="h-1 bg-gradient-to-r from-gold to-primary" />
                <CardContent className="p-6 sm:p-8 space-y-5">
                  <h3 className="text-lg font-bold text-foreground">
                    {t(locale, 'contactInfo')}
                  </h3>

                  <div className="space-y-4">
                    {/* Phone */}
                    <a
                      href="tel:+966548599988"
                      className="flex items-start gap-3.5 p-3 rounded-xl hover:bg-amber-50 dark:hover:bg-amber-950/20 transition-colors group"
                    >
                      <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/30 flex items-center justify-center shrink-0 group-hover:bg-blue-100 dark:group-hover:bg-blue-950/50 transition-colors">
                        <Phone className="size-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground font-medium mb-0.5">
                          {t(locale, 'contactPhone')}
                        </p>
                        <p className="text-sm font-semibold text-foreground text-start" dir="ltr">
                          +966 548 599 988
                        </p>
                      </div>
                    </a>

                    {/* Address */}
                    <div className="flex items-start gap-3.5 p-3 rounded-xl hover:bg-amber-50 dark:hover:bg-amber-950/20 transition-colors">
                      <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/30 flex items-center justify-center shrink-0">
                        <MapPin className="size-5 text-amber-600" />
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground font-medium mb-0.5">
                          {t(locale, 'contactAddress')}
                        </p>
                        <p className="text-sm text-foreground leading-relaxed">
                          {locale === 'ar'
                            ? 'طريق الملك فهد، حي العليا، الرياض'
                            : 'King Fahd Road, Olaya District, Riyadh'}
                        </p>
                      </div>
                    </div>

                    {/* Hours */}
                    <div className="flex items-start gap-3.5 p-3 rounded-xl hover:bg-amber-50 dark:hover:bg-amber-950/20 transition-colors">
                      <div className="w-10 h-10 rounded-xl bg-violet-50 dark:bg-violet-950/30 flex items-center justify-center shrink-0">
                        <Clock className="size-5 text-violet-600" />
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground font-medium mb-0.5">
                          {t(locale, 'contactHours')}
                        </p>
                        <p className="text-sm text-foreground">
                          {locale === 'ar' ? 'يومياً 11:00 ص - 2:00 ص' : 'Daily 11:00 AM - 2:00 AM'}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Social Media Card */}
              <Card className="border-border/60 overflow-hidden">
                <div className="h-1 bg-gradient-to-r from-gold via-pink-400 to-gold" />
                <CardContent className="p-6 sm:p-8 space-y-5">
                  <h3 className="text-lg font-bold text-foreground">
                    {t(locale, 'socialMedia')}
                  </h3>

                  <div className="grid grid-cols-2 gap-3">
                    {socialLinks.map((link) => (
                      <a
                        key={link.name}
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`
                          flex items-center gap-3 p-3 rounded-xl border border-border/40
                          ${link.hoverBg} transition-all duration-200 hover:border-border hover:shadow-sm
                        `}
                      >
                        <div className={link.color}>
                          {link.icon}
                        </div>
                        <span className="text-sm font-medium text-foreground">
                          {link.name}
                        </span>
                      </a>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* WhatsApp CTA */}
              <motion.a
                href="https://wa.me/966548599988"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="block"
              >
                <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-green-500 to-green-600 p-6 sm:p-8 text-white shadow-lg shadow-green-500/20">
                  {/* Background pattern */}
                  <div className="absolute inset-0 opacity-10">
                    <svg className="w-full h-full" viewBox="0 0 200 200">
                      <circle cx="100" cy="100" r="80" fill="none" stroke="white" strokeWidth="1" />
                      <circle cx="100" cy="100" r="60" fill="none" stroke="white" strokeWidth="1" />
                      <circle cx="100" cy="100" r="40" fill="none" stroke="white" strokeWidth="1" />
                    </svg>
                  </div>

                  <div className="relative flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center shrink-0">
                      <MessageCircle className="size-7" />
                    </div>
                    <div>
                      <p className="font-bold text-lg leading-tight">
                        {locale === 'ar' ? 'تواصل عبر واتساب' : 'Chat on WhatsApp'}
                      </p>
                      <p className="text-white/80 text-sm mt-0.5">
                        {locale === 'ar'
                          ? 'أسرع طريقة للتواصل معنا'
                          : 'The fastest way to reach us'}
                      </p>
                    </div>
                  </div>

                  {/* Arrow indicator */}
                  <div className="mt-4 flex items-center gap-2 text-white/70 text-sm">
                    <span dir="ltr" className="text-start">wa.me/966548599988</span>
                  </div>
                </div>
              </motion.a>
            </motion.div>
          </div>
        </div>
      </section>
    </main>
  );
}
