import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Locale } from './i18n';

// ============ NAVIGATION ============
export type Page = 'home' | 'menu' | 'about' | 'branches' | 'contact' | 'cart';

interface NavigationState {
  currentPage: Page;
  previousPage: Page | null;
  navigate: (page: Page) => void;
  goBack: () => void;
}

export const useNavigation = create<NavigationState>((set) => ({
  currentPage: 'home',
  previousPage: null,
  navigate: (page) =>
    set((state) => ({
      currentPage: page,
      previousPage: state.currentPage,
    })),
  goBack: () =>
    set((state) => ({
      currentPage: state.previousPage || 'home',
      previousPage: null,
    })),
}));

// ============ LANGUAGE ============
interface LanguageState {
  locale: Locale;
  isRTL: boolean;
  setLocale: (locale: Locale) => void;
  toggleLanguage: () => void;
}

export const useLanguage = create<LanguageState>((set) => ({
  locale: 'ar',
  isRTL: true,
  setLocale: (locale) =>
    set({
      locale,
      isRTL: locale === 'ar',
    }),
  toggleLanguage: () =>
    set((state) => ({
      locale: state.locale === 'ar' ? 'en' : 'ar',
      isRTL: state.locale === 'ar' ? false : true,
    })),
}));

// ============ DELIVERY ============
export type OrderType = 'delivery' | 'pickup';
export type PaymentMethod = 'cash' | 'online';

export const DELIVERY_FEE = 10;
export const FREE_DELIVERY_MIN = 100;

interface DeliveryState {
  orderType: OrderType;
  customerName: string;
  address: string;
  buildingNo: string;
  floorNo: string;
  apartmentNo: string;
  customerPhone: string;
  deliveryNotes: string;
  paymentMethod: PaymentMethod;
  setOrderType: (type: OrderType) => void;
  setCustomerName: (name: string) => void;
  setAddress: (address: string) => void;
  setBuildingNo: (no: string) => void;
  setFloorNo: (no: string) => void;
  setApartmentNo: (no: string) => void;
  setCustomerPhone: (phone: string) => void;
  setDeliveryNotes: (notes: string) => void;
  setPaymentMethod: (method: PaymentMethod) => void;
  getDeliveryFee: (subtotal: number) => number;
  resetDelivery: () => void;
}

const initialDeliveryState = {
  orderType: 'delivery' as OrderType,
  customerName: '',
  address: '',
  buildingNo: '',
  floorNo: '',
  apartmentNo: '',
  customerPhone: '',
  deliveryNotes: '',
  paymentMethod: 'cash' as PaymentMethod,
};

export const useDelivery = create<DeliveryState>()(
  persist(
    (set, get) => ({
      ...initialDeliveryState,
      setOrderType: (type) => set({ orderType: type }),
      setCustomerName: (name) => set({ customerName: name }),
      setAddress: (address) => set({ address }),
      setBuildingNo: (no) => set({ buildingNo: no }),
      setFloorNo: (no) => set({ floorNo: no }),
      setApartmentNo: (no) => set({ apartmentNo: no }),
      setCustomerPhone: (phone) => set({ customerPhone: phone }),
      setDeliveryNotes: (notes) => set({ deliveryNotes: notes }),
      setPaymentMethod: (method) => set({ paymentMethod: method }),
      getDeliveryFee: (subtotal) => {
        const { orderType } = get();
        if (orderType === 'pickup') return 0;
        if (subtotal >= FREE_DELIVERY_MIN) return 0;
        return DELIVERY_FEE;
      },
      resetDelivery: () => set(initialDeliveryState),
    }),
    {
      name: 'restaurant-delivery',
      partialize: (state) => ({
        orderType: state.orderType,
        customerName: state.customerName,
        address: state.address,
        buildingNo: state.buildingNo,
        floorNo: state.floorNo,
        apartmentNo: state.apartmentNo,
        customerPhone: state.customerPhone,
        deliveryNotes: state.deliveryNotes,
        paymentMethod: state.paymentMethod,
      }),
    }
  )
);

// ============ CART ============
export interface CartItemOption {
  type: 'quantity' | 'cookingMethod' | 'riceType' | 'size' | 'extras';
  value: string;
  priceModifier?: number;
}

export interface CartItem {
  id: string;
  cartItemId: string;
  menuItemId: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  options: CartItemOption[];
  notes: string;
  totalPrice: number;
}

interface CartState {
  items: CartItem[];
  isOpen: boolean;
  customizerItem: string | null; // menuItemId being customized
  editingCartItem: string | null; // cartItemId being edited
  addItem: (item: CartItem) => void;
  removeItem: (cartItemId: string) => void;
  updateQuantity: (cartItemId: string, quantity: number) => void;
  clearCart: () => void;
  toggleCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  openCustomizer: (menuItemId: string) => void;
  closeCustomizer: () => void;
  openEditCustomizer: (cartItemId: string) => void;
  closeEditCustomizer: () => void;
  getTotal: () => number;
  getItemCount: () => number;
}

let cartIdCounter = 0;

export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      customizerItem: null,
      editingCartItem: null,

      addItem: (item) =>
        set((state) => ({
          items: [...state.items, item],
        })),

      removeItem: (cartItemId) =>
        set((state) => ({
          items: state.items.filter((i) => i.cartItemId !== cartItemId),
        })),

      updateQuantity: (cartItemId, quantity) =>
        set((state) => ({
          items: state.items.map((item) =>
            item.cartItemId === cartItemId
              ? {
                  ...item,
                  quantity,
                  totalPrice: (item.price + item.options.reduce((acc, o) => acc + (o.priceModifier || 0), 0)) * quantity,
                }
              : item
          ),
        })),

      clearCart: () => set({ items: [] }),
      toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),
      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
      openCustomizer: (menuItemId) => set({ customizerItem: menuItemId }),
      closeCustomizer: () => set({ customizerItem: null }),
      openEditCustomizer: (cartItemId) => set({ editingCartItem: cartItemId }),
      closeEditCustomizer: () => set({ editingCartItem: null }),

      getTotal: () => get().items.reduce((total, item) => total + item.totalPrice, 0),
      getItemCount: () => get().items.reduce((count, item) => count + item.quantity, 0),
    }),
    {
      name: 'restaurant-cart',
      partialize: (state) => ({ items: state.items }),
    }
  )
);

export function generateCartId(): string {
  cartIdCounter++;
  return `cart-${Date.now()}-${cartIdCounter}`;
}
