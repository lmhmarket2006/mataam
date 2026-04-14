'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Truck,
  Store,
  MapPin,
  Phone,
  User,
  Building2,
  Layers,
  DoorOpen,
  MessageSquare,
  Wallet,
  CreditCard,
  Clock,
  ChevronDown,
  ChevronUp,
  Info,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { useDelivery, useLanguage, type OrderType } from '@/lib/store';
import { t } from '@/lib/i18n';

interface DeliveryInfoProps {
  subtotal: number;
}

export default function DeliveryInfo({ subtotal }: DeliveryInfoProps) {
  const { locale, isRTL } = useLanguage();
  const {
    orderType,
    customerName,
    address,
    buildingNo,
    floorNo,
    apartmentNo,
    customerPhone,
    deliveryNotes,
    paymentMethod,
    setOrderType,
    setCustomerName,
    setAddress,
    setBuildingNo,
    setFloorNo,
    setApartmentNo,
    setCustomerPhone,
    setDeliveryNotes,
    setPaymentMethod,
    getDeliveryFee,
    freeDeliveryMinSar,
  } = useDelivery();

  const deliveryFee = getDeliveryFee(subtotal);
  const [showDetails, setShowDetails] = useState(true);

  const orderTypes: { value: OrderType; icon: React.ReactNode; label: string }[] = [
    {
      value: 'delivery',
      icon: <Truck className="size-4" />,
      label: t(locale, 'orderTypeDelivery'),
    },
    {
      value: 'pickup',
      icon: <Store className="size-4" />,
      label: t(locale, 'orderTypePickup'),
    },
  ];

  return (
    <div className="space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center">
            <Truck className="size-3.5 text-primary" />
          </div>
          <h3 className="text-sm font-bold text-foreground">
            {t(locale, 'deliveryTitle')}
          </h3>
        </div>
        <button
          onClick={() => setShowDetails(!showDetails)}
          className="text-muted-foreground hover:text-foreground transition-colors p-1"
          aria-label={showDetails ? 'Collapse' : 'Expand'}
        >
          {showDetails ? (
            <ChevronUp className="size-4" />
          ) : (
            <ChevronDown className="size-4" />
          )}
        </button>
      </div>

      <AnimatePresence initial={false}>
        {showDetails && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <div className="space-y-4">
              {/* Order Type Toggle */}
              <div className="grid grid-cols-2 gap-2">
                {orderTypes.map((type) => {
                  const isActive = orderType === type.value;
                  return (
                    <motion.button
                      key={type.value}
                      type="button"
                      whileTap={{ scale: 0.97 }}
                      onClick={() => setOrderType(type.value)}
                      className={`
                        relative flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl border-2 text-xs sm:text-sm font-medium
                        transition-all duration-200
                        ${
                          isActive
                            ? 'border-primary bg-primary/8 text-primary shadow-sm shadow-primary/10'
                            : 'border-border bg-card hover:border-primary/30 text-muted-foreground'
                        }
                      `}
                    >
                      {type.icon}
                      <span>{type.label}</span>
                      {isActive && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="absolute -top-1 -end-1 w-4 h-4 rounded-full bg-primary flex items-center justify-center"
                        >
                          <span className="text-[8px] text-primary-foreground">✓</span>
                        </motion.div>
                      )}
                    </motion.button>
                  );
                })}
              </div>

              {/* Delivery Details - only when delivery */}
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-foreground flex items-center gap-1.5">
                  <User className="size-3 text-primary" />
                  {locale === 'ar' ? 'اسم العميل' : 'Customer Name'}
                  <span className="text-destructive">*</span>
                </label>
                <Input
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder={locale === 'ar' ? 'أدخل الاسم' : 'Enter customer name'}
                  dir={isRTL ? 'rtl' : 'ltr'}
                  className="text-sm h-10 rounded-lg border-2 border-border focus:border-primary/50"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-foreground flex items-center gap-1.5">
                  <Phone className="size-3 text-primary" />
                  {t(locale, 'customerPhone')}
                  <span className="text-destructive">*</span>
                </label>
                <div dir="ltr" className="text-start">
                  <Input
                    value={customerPhone}
                    onChange={(e) => {
                      const val = e.target.value.replace(/[^0-9+]/g, '');
                      setCustomerPhone(val);
                    }}
                    placeholder="05XXXXXXXX"
                    className="text-sm h-10 rounded-lg border-2 border-border focus:border-primary/50"
                    maxLength={12}
                  />
                </div>
              </div>

              <AnimatePresence mode="wait">
                {orderType === 'delivery' && (
                  <motion.div
                    key="delivery-fields"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-3"
                  >
                    {/* Delivery Address */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-foreground flex items-center gap-1.5">
                        <MapPin className="size-3 text-primary" />
                        {t(locale, 'deliveryAddress')}
                        <span className="text-destructive">*</span>
                      </label>
                      <Input
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        placeholder={t(locale, 'deliveryAddressPlaceholder')}
                        dir={isRTL ? 'rtl' : 'ltr'}
                        className="text-sm h-10 rounded-lg border-2 border-border focus:border-primary/50"
                      />
                    </div>

                    {/* Building / Floor / Apartment - Row */}
                    <div className="grid grid-cols-3 gap-2">
                      <div className="space-y-1.5">
                        <label className="text-[10px] sm:text-xs font-medium text-foreground flex items-center gap-1">
                          <Building2 className="size-3 text-primary/70" />
                          {t(locale, 'buildingNo')}
                        </label>
                        <Input
                          value={buildingNo}
                          onChange={(e) => setBuildingNo(e.target.value)}
                          placeholder={t(locale, 'buildingNoPlaceholder')}
                          dir={isRTL ? 'rtl' : 'ltr'}
                          className="text-sm h-10 rounded-lg border-2 border-border focus:border-primary/50"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] sm:text-xs font-medium text-foreground flex items-center gap-1">
                          <Layers className="size-3 text-primary/70" />
                          {t(locale, 'floorNo')}
                        </label>
                        <Input
                          value={floorNo}
                          onChange={(e) => setFloorNo(e.target.value)}
                          placeholder={t(locale, 'floorNoPlaceholder')}
                          dir={isRTL ? 'rtl' : 'ltr'}
                          className="text-sm h-10 rounded-lg border-2 border-border focus:border-primary/50"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] sm:text-xs font-medium text-foreground flex items-center gap-1">
                          <DoorOpen className="size-3 text-primary/70" />
                          {t(locale, 'apartmentNo')}
                        </label>
                        <Input
                          value={apartmentNo}
                          onChange={(e) => setApartmentNo(e.target.value)}
                          placeholder={t(locale, 'apartmentNoPlaceholder')}
                          dir={isRTL ? 'rtl' : 'ltr'}
                          className="text-sm h-10 rounded-lg border-2 border-border focus:border-primary/50"
                        />
                      </div>
                    </div>

                    {/* Delivery Notes */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-foreground flex items-center gap-1.5">
                        <MessageSquare className="size-3 text-primary/70" />
                        {t(locale, 'deliveryNotes')}
                      </label>
                      <Textarea
                        value={deliveryNotes}
                        onChange={(e) => setDeliveryNotes(e.target.value)}
                        placeholder={t(locale, 'deliveryNotesPlaceholder')}
                        dir={isRTL ? 'rtl' : 'ltr'}
                        className="text-sm min-h-[56px] resize-none rounded-lg border-2 border-border focus:border-primary/50"
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Pickup info */}
              <AnimatePresence mode="wait">
                {orderType === 'pickup' && (
                  <motion.div
                    key="pickup-info"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="rounded-xl bg-primary/5 border border-primary/10 p-3 space-y-2"
                  >
                    <div className="flex items-center gap-2 text-sm">
                      <Store className="size-4 text-primary" />
                      <span className="font-medium text-foreground">
                        {locale === 'ar' ? 'العنوان' : 'Address'}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {locale === 'ar'
                        ? 'الرياض - طريق الملك فهد، حي العليا'
                        : 'Riyadh - King Fahd Road, Olaya District'}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Payment Method */}
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-foreground flex items-center gap-1.5">
                  <Wallet className="size-3 text-primary" />
                  {t(locale, 'paymentMethod')}
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <motion.button
                    type="button"
                    whileTap={{ scale: 0.97 }}
                    onClick={() => setPaymentMethod('cash')}
                    className={`
                      flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl border-2 text-xs sm:text-sm font-medium
                      transition-all duration-200
                      ${
                        paymentMethod === 'cash'
                          ? 'border-primary bg-primary/8 text-primary'
                          : 'border-border bg-card hover:border-primary/30 text-muted-foreground'
                      }
                    `}
                  >
                    <Wallet className="size-3.5" />
                    {t(locale, 'cashOnDelivery')}
                  </motion.button>
                  <motion.button
                    type="button"
                    whileTap={{ scale: 0.97 }}
                    onClick={() => setPaymentMethod('online')}
                    className={`
                      flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl border-2 text-xs sm:text-sm font-medium
                      transition-all duration-200
                      ${
                        paymentMethod === 'online'
                          ? 'border-primary bg-primary/8 text-primary'
                          : 'border-border bg-card hover:border-primary/30 text-muted-foreground'
                      }
                    `}
                  >
                    <CreditCard className="size-3.5" />
                    {t(locale, 'onlinePayment')}
                  </motion.button>
                </div>
              </div>

              {/* Delivery Info Summary */}
              <div className="rounded-xl bg-muted/50 border border-border/50 p-3 space-y-2">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Clock className="size-3.5" />
                  <span>{t(locale, 'deliveryTime')}: </span>
                  <span className="font-semibold text-foreground">
                    {orderType === 'delivery'
                      ? t(locale, 'estimatedDelivery')
                      : t(locale, 'estimatedPickup')}
                  </span>
                </div>
                {orderType === 'delivery' && deliveryFee > 0 && (
                  <div className="flex items-center gap-1.5 text-[10px] sm:text-xs text-muted-foreground">
                    <Info className="size-3" />
                    <span>
                      {t(locale, 'freeDeliveryAbove')} {freeDeliveryMinSar} {t(locale, 'sar')}
                    </span>
                  </div>
                )}
                {deliveryFee === 0 && orderType === 'delivery' && (
                  <Badge className="bg-green-100 text-green-700 border-0 text-[10px] px-2 py-0.5 self-start">
                    {t(locale, 'freeDelivery')} ✓
                  </Badge>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <Separator />
    </div>
  );
}
