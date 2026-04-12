export interface MenuItem {
  id: string;
  nameAr: string;
  nameEn: string;
  descAr: string;
  descEn: string;
  price: number;
  image: string;
  category: string;
  isPopular?: boolean;
  isNew?: boolean;
  isBestSeller?: boolean;
  isSpicy?: boolean;
  options?: MenuItemOptions;
}

export interface MenuItemOptions {
  hasQuantity?: boolean;       // quarter/half/whole chicken
  hasCookingMethod?: boolean;  // mandi/madhbii/madghoot/madfoun
  hasRiceType?: boolean;       // shaabi/mandi/bukhari/muthallath
  hasSize?: boolean;           // small/medium/large
  hasMeatQuantity?: boolean;   // nafer/quarter/half/whole goat
  hasExtras?: boolean;
  extras?: ExtraItem[];
  priceVariants?: PriceVariant[];
}

export interface PriceVariant {
  labelAr: string;
  labelEn: string;
  price: number;
  type: 'rice' | 'meat-qty';
}

export interface ExtraItem {
  id: string;
  nameAr: string;
  nameEn: string;
  price: number;
}

export interface MenuCategory {
  id: string;
  nameAr: string;
  nameEn: string;
  icon: string;
  items: MenuItem[];
}

export interface Branch {
  id: string;
  nameAr: string;
  nameEn: string;
  cityAr: string;
  cityEn: string;
  addressAr: string;
  addressEn: string;
  phone: string;
  hoursAr: string;
  hoursEn: string;
  lat: number;
  lng: number;
}

export interface Review {
  id: string;
  nameAr: string;
  nameEn: string;
  rating: number;
  commentAr: string;
  commentEn: string;
  date: string;
}

export const branches: Branch[] = [
  {
    id: 'branch-1',
    nameAr: 'فرع العليا',
    nameEn: 'Olaya Branch',
    cityAr: 'الرياض',
    cityEn: 'Riyadh',
    addressAr: 'طريق الملك فهد، حي العليا، الرياض',
    addressEn: 'King Fahd Road, Olaya District, Riyadh',
    phone: '+966548599988',
    hoursAr: 'يومياً 11:00 ص - 2:00 ص',
    hoursEn: 'Daily 11:00 AM - 2:00 AM',
    lat: 24.6877,
    lng: 46.7219,
  },
  {
    id: 'branch-2',
    nameAr: 'فرع النرجس',
    nameEn: 'Narcissus Branch',
    cityAr: 'الرياض',
    cityEn: 'Riyadh',
    addressAr: 'شارع الأمير محمد بن عبدالعزيز، حي النرجس',
    addressEn: 'Prince Mohammed bin Abdulaziz St., Narcissus District',
    phone: '+966548599988',
    hoursAr: 'يومياً 11:00 ص - 1:00 ص',
    hoursEn: 'Daily 11:00 AM - 1:00 AM',
    lat: 24.7136,
    lng: 46.6753,
  },
  {
    id: 'branch-3',
    nameAr: 'فرع جدة',
    nameEn: 'Jeddah Branch',
    cityAr: 'جدة',
    cityEn: 'Jeddah',
    addressAr: 'شارع فلسطين، حي الروضة، جدة',
    addressEn: 'Palestine Street, Rawdah District, Jeddah',
    phone: '+966548599988',
    hoursAr: 'يومياً 11:00 ص - 2:00 ص',
    hoursEn: 'Daily 11:00 AM - 2:00 AM',
    lat: 21.5433,
    lng: 39.1728,
  },
  {
    id: 'branch-4',
    nameAr: 'فرع الدمام',
    nameEn: 'Dammam Branch',
    cityAr: 'الدمام',
    cityEn: 'Dammam',
    addressAr: 'شارع الأمير سلطان، حي الشاطئ، الدمام',
    addressEn: 'Prince Sultan St., Corniche District, Dammam',
    phone: '+966548599988',
    hoursAr: 'يومياً 11:30 ص - 1:00 ص',
    hoursEn: 'Daily 11:30 AM - 1:00 AM',
    lat: 26.3927,
    lng: 49.9777,
  },
];

export const reviews: Review[] = [
  {
    id: 'review-1',
    nameAr: 'أبو عبدالله',
    nameEn: 'Abu Abdullah',
    rating: 5,
    commentAr: 'أفضل مطعم مندي جربته! الطعم أصيل والخدمة ممتازة. أنصح الجميع بتجربته.',
    commentEn: "Best mandi restaurant I've tried! The taste is authentic and the service is excellent. Highly recommended.",
    date: '2024-12-15',
  },
  {
    id: 'review-2',
    nameAr: 'سارة أحمد',
    nameEn: 'Sara Ahmed',
    rating: 5,
    commentAr: 'وجبة عائلية رائعة! الأكل لذيذ والكميات كبيرة. سنعود بالتأكيد.',
    commentEn: 'Amazing family meal! The food is delicious and portions are generous. We will definitely come back.',
    date: '2024-12-10',
  },
  {
    id: 'review-3',
    nameAr: 'محمد العتيبي',
    nameEn: 'Mohammed Al-Otaibi',
    rating: 5,
    commentAr: 'المندي عندهم شيء ثاني! الرز بشاور طيّب جداً. الأسعار معقولة.',
    commentEn: 'Their mandi is something else! The bukhari rice is very good. Prices are reasonable.',
    date: '2024-11-28',
  },
  {
    id: 'review-4',
    nameAr: 'فاطمة الزهراني',
    nameEn: 'Fatimah Al-Zahrani',
    rating: 5,
    commentAr: 'المضغوط عندهم لا يعلى عليه! صوصاتهم مميزة والسلطة طازجة.',
    commentEn: 'Their madghoot is unmatched! Their sauces are special and the salad is fresh.',
    date: '2024-11-20',
  },
  {
    id: 'review-5',
    nameAr: 'خالد الشمري',
    nameEn: 'Khalid Al-Shammari',
    rating: 5,
    commentAr: 'أفضل مطعم سعودي يمني في الرياض! المكان نظيف والخدمة سريعة.',
    commentEn: 'Best Saudi-Yemeni restaurant in Riyadh! The place is clean and service is fast.',
    date: '2024-11-15',
  },
];

// ============================
// RICE PRICE VARIANTS (shared)
// ============================
const chickenRiceVariants: PriceVariant[] = [
  { labelAr: 'نص رز شعبي', labelEn: 'Half Shaabi Rice', price: 25, type: 'rice' },
  { labelAr: 'نص رز مندي', labelEn: 'Half Mandi Rice', price: 26, type: 'rice' },
  { labelAr: 'نص رز بشاور', labelEn: 'Half Bukhari Rice', price: 27, type: 'rice' },
  { labelAr: 'نص رز مثلوث', labelEn: 'Half Muthallath Rice', price: 29, type: 'rice' },
];

const meatRiceVariants: PriceVariant[] = [
  { labelAr: 'نفر رز شعبي', labelEn: 'Nafer Shaabi Rice', price: 88, type: 'rice' },
  { labelAr: 'نفر رز مندي', labelEn: 'Nafer Mandi Rice', price: 89, type: 'rice' },
  { labelAr: 'نفر رز بشاور', labelEn: 'Nafer Bukhari Rice', price: 89, type: 'rice' },
];

const meatGoatVariants: PriceVariant[] = [
  { labelAr: 'ربع تيس', labelEn: 'Quarter Goat', price: 352, type: 'meat-qty' },
  { labelAr: 'نصف تيس', labelEn: 'Half Goat', price: 730, type: 'meat-qty' },
  { labelAr: 'تيس كامل', labelEn: 'Whole Goat', price: 1460, type: 'meat-qty' },
];

const commonExtras: ExtraItem[] = [
  { id: 'ext-sauce', nameAr: 'صوص', nameEn: 'Sauce', price: 3 },
  { id: 'ext-salad', nameAr: 'سلطة خضار', nameEn: 'Green Salad', price: 8 },
  { id: 'ext-soup', nameAr: 'شوربة', nameEn: 'Soup', price: 5 },
  { id: 'ext-bread', nameAr: 'خبز', nameEn: 'Bread', price: 3 },
];

export const allMenuItems: MenuItem[] = [
  // ========================================
  // قسم الدجاج (CHICKEN)
  // ========================================
  {
    id: 'chicken-madhbii',
    nameAr: 'دجاج مظبي',
    nameEn: 'Chicken Madhbii',
    descAr: 'دجاج مظبي بالطريقة التقليدية مع خيار نوع الرز',
    descEn: 'Traditional chicken madhbii with your choice of rice',
    price: 25,
    image: '/images/chicken-madhbii.jpg',
    category: 'cat_chicken',
    isPopular: true,
    isBestSeller: true,
    options: {
      hasRiceType: true,
      hasExtras: true,
      extras: commonExtras,
      priceVariants: chickenRiceVariants,
    },
  },
  {
    id: 'chicken-madfoun',
    nameAr: 'دجاج مدفون',
    nameEn: 'Chicken Madfoun',
    descAr: 'دجاج مدفون على الطريقة اليمنية الأصيلة مع خيار الرز',
    descEn: 'Authentic Yemeni-style chicken madfoun with rice options',
    price: 25,
    image: '/images/chicken-madfoun.jpg',
    category: 'cat_chicken',
    isPopular: true,
    options: {
      hasRiceType: true,
      hasExtras: true,
      extras: commonExtras,
      priceVariants: chickenRiceVariants,
    },
  },
  {
    id: 'chicken-mandi',
    nameAr: 'دجاج مندي',
    nameEn: 'Chicken Mandi',
    descAr: 'دجاج مندي تقليدي معطر بالتوابل والبهارات',
    descEn: 'Traditional chicken mandi with aromatic spices',
    price: 25,
    image: '/images/chicken-mandi.jpg',
    category: 'cat_chicken',
    isBestSeller: true,
    options: {
      hasRiceType: true,
      hasExtras: true,
      extras: commonExtras,
      priceVariants: chickenRiceVariants,
    },
  },
  {
    id: 'chicken-grilled',
    nameAr: 'شواية',
    nameEn: 'Grilled Chicken',
    descAr: 'دجاج مشوي على الفحم مع خيار نوع الرز',
    descEn: 'Charcoal grilled chicken with your choice of rice',
    price: 25,
    image: '/images/grilled-chicken.jpg',
    category: 'cat_chicken',
    isPopular: true,
    options: {
      hasRiceType: true,
      hasExtras: true,
      extras: commonExtras,
      priceVariants: chickenRiceVariants,
    },
  },
  {
    id: 'chicken-madghoot',
    nameAr: 'دجاج مضغوط',
    nameEn: 'Chicken Madghoot',
    descAr: 'دجاج مضغوط على الطريقة اليمنية',
    descEn: 'Yemeni-style chicken madghoot',
    price: 25,
    image: '/images/chicken-madghoot.jpg',
    category: 'cat_chicken',
    options: {
      hasExtras: true,
      extras: commonExtras,
    },
  },
  {
    id: 'chicken-maqlouba',
    nameAr: 'مقلوبة',
    nameEn: 'Maqlouba',
    descAr: 'مقلوبة دجاج تقليدية بالخضار والأرز',
    descEn: 'Traditional chicken maqlouba with vegetables and rice',
    price: 33,
    image: '/images/maqlouba.jpg',
    category: 'cat_chicken',
    isNew: true,
    options: {
      hasExtras: true,
      extras: commonExtras,
    },
  },
  {
    id: 'chicken-kushta',
    nameAr: 'كشتة',
    nameEn: 'Kushta',
    descAr: 'كشتة دجاج تقليدية شهية',
    descEn: 'Traditional delicious chicken kushta',
    price: 25,
    image: '/images/kushta.jpg',
    category: 'cat_chicken',
    options: {
      hasExtras: true,
      extras: commonExtras,
    },
  },

  // ========================================
  // قسم اللحوم (MEAT)
  // ========================================
  {
    id: 'meat-madfoun',
    nameAr: 'مدفون لحم',
    nameEn: 'Meat Madfoun',
    descAr: 'لحم مدفون تقليدي مع خيار نوع الرز أو كمية التيس',
    descEn: 'Traditional meat madfoun with rice or goat quantity options',
    price: 88,
    image: '/images/meat-madfoun.jpg',
    category: 'cat_meat',
    isBestSeller: true,
    options: {
      hasMeatQuantity: true,
      hasRiceType: true,
      hasExtras: true,
      extras: commonExtras,
      priceVariants: [...meatRiceVariants, ...meatGoatVariants],
    },
  },
  {
    id: 'meat-mandi',
    nameAr: 'مندي لحم',
    nameEn: 'Meat Mandi',
    descAr: 'مندي لحم أصيل معطر بالتوابل والبهارات',
    descEn: 'Authentic meat mandi with aromatic spices',
    price: 88,
    image: '/images/meat-mandi.jpg',
    category: 'cat_meat',
    isPopular: true,
    isBestSeller: true,
    options: {
      hasMeatQuantity: true,
      hasRiceType: true,
      hasExtras: true,
      extras: commonExtras,
      priceVariants: [...meatRiceVariants, ...meatGoatVariants],
    },
  },
  {
    id: 'meat-madghoot',
    nameAr: 'مضغوط لحم',
    nameEn: 'Meat Madghoot',
    descAr: 'لحم مضغوط بالطريقة اليمنية الأصلية',
    descEn: 'Original Yemeni-style meat madghoot',
    price: 88,
    image: '/images/meat-madghoot.jpg',
    category: 'cat_meat',
    isPopular: true,
    options: {
      hasMeatQuantity: true,
      hasRiceType: true,
      hasExtras: true,
      extras: commonExtras,
      priceVariants: [...meatRiceVariants, ...meatGoatVariants],
    },
  },
  {
    id: 'meat-madghoot-kushta',
    nameAr: 'مضغوط كشتة',
    nameEn: 'Madghoot Kushta',
    descAr: 'مضغوط كشتة لحم شهي ومميز',
    descEn: 'Special and delicious meat madghoot kushta',
    price: 88,
    image: '/images/madghoot-kushta.jpg',
    category: 'cat_meat',
    isNew: true,
    options: {
      hasMeatQuantity: true,
      hasRiceType: true,
      hasExtras: true,
      extras: commonExtras,
      priceVariants: [...meatRiceVariants, ...meatGoatVariants],
    },
  },

  // ========================================
  // قسم الإيدامات (SIDE DISHES)
  // ========================================
  {
    id: 'side-jareesh',
    nameAr: 'جريش',
    nameEn: 'Jareesh',
    descAr: 'جريش تقليدي بالمرق',
    descEn: 'Traditional jareesh with broth',
    price: 10,
    image: '/images/jareesh.jpg',
    category: 'cat_sides',
    isPopular: true,
    options: {
      hasSize: true,
      priceVariants: [
        { labelAr: 'كبير', labelEn: 'Large', price: 10, type: 'rice' },
        { labelAr: 'صغير', labelEn: 'Small', price: 7, type: 'rice' },
      ],
    },
  },
  {
    id: 'side-qarshan',
    nameAr: 'قرصان',
    nameEn: 'Qarshan',
    descAr: 'قرصان تقليدي شهي',
    descEn: 'Traditional delicious qarshan',
    price: 10,
    image: '/images/qarshan.jpg',
    category: 'cat_sides',
    options: {
      hasSize: true,
      priceVariants: [
        { labelAr: 'كبير', labelEn: 'Large', price: 10, type: 'rice' },
        { labelAr: 'صغير', labelEn: 'Small', price: 7, type: 'rice' },
      ],
    },
  },
  {
    id: 'side-mushakel',
    nameAr: 'إيدام مشكل',
    nameEn: 'Mixed Eidam',
    descAr: 'إيدام مشكل بالخضار واللحم',
    descEn: 'Mixed eidam with vegetables and meat',
    price: 10,
    image: '/images/eidam-mushakel.jpg',
    category: 'cat_sides',
    options: {
      hasSize: true,
      priceVariants: [
        { labelAr: 'كبير', labelEn: 'Large', price: 10, type: 'rice' },
        { labelAr: 'صغير', labelEn: 'Small', price: 7, type: 'rice' },
      ],
    },
  },
  {
    id: 'side-molokhia',
    nameAr: 'ملوخية',
    nameEn: 'Molokhia',
    descAr: 'ملوخية تقليدية بالدجاج أو اللحم',
    descEn: 'Traditional molokhia with chicken or meat',
    price: 10,
    image: '/images/molokhia.jpg',
    category: 'cat_sides',
    isPopular: true,
    options: {
      hasSize: true,
      priceVariants: [
        { labelAr: 'كبير', labelEn: 'Large', price: 10, type: 'rice' },
        { labelAr: 'صغير', labelEn: 'Small', price: 7, type: 'rice' },
      ],
    },
  },
  {
    id: 'side-sambosa',
    nameAr: 'سمبوسة',
    nameEn: 'Sambosa',
    descAr: 'سمبوسة مقرمشة بالحشوة الشهية',
    descEn: 'Crispy sambosa with delicious filling',
    price: 2,
    image: '/images/sambosa.jpg',
    category: 'cat_sides',
    isBestSeller: true,
  },
  {
    id: 'side-kashna',
    nameAr: 'كشنه',
    nameEn: 'Kashna',
    descAr: 'كشنه تقليدية لذيذة',
    descEn: 'Traditional delicious kashna',
    price: 4,
    image: '/images/kashna.jpg',
    category: 'cat_sides',
  },

  // ========================================
  // قسم السلطات (SALADS)
  // ========================================
  {
    id: 'salad-green',
    nameAr: 'سلطة خضار',
    nameEn: 'Green Salad',
    descAr: 'سلطة خضار طازجة مع الطماطم والخيار والبصل',
    descEn: 'Fresh green salad with tomatoes, cucumbers and onions',
    price: 8,
    image: '/images/green-salad.jpg',
    category: 'cat_salads',
    isPopular: true,
  },
  {
    id: 'salad-laban',
    nameAr: 'سلطة لبن',
    nameEn: 'Yogurt Salad',
    descAr: 'سلطة لبن طازجة بالنعناع والخيار',
    descEn: 'Fresh yogurt salad with mint and cucumber',
    price: 6,
    image: '/images/laban-salad.jpg',
    category: 'cat_salads',
  },
  {
    id: 'salad-spicy-green',
    nameAr: 'سلطة حار (أخضر)',
    nameEn: 'Spicy Green Salad',
    descAr: 'سلطة حارة بالفلفل الأخضر والطماطم',
    descEn: 'Spicy salad with green chili and tomatoes',
    price: 4,
    image: '/images/spicy-green-salad.jpg',
    category: 'cat_salads',
    isSpicy: true,
  },
  {
    id: 'salad-spicy-red',
    nameAr: 'سلطة حار (أحمر)',
    nameEn: 'Spicy Red Salad',
    descAr: 'سلطة حارة بالفلفل الأحمر',
    descEn: 'Spicy salad with red chili',
    price: 4,
    image: '/images/spicy-red-salad.jpg',
    category: 'cat_salads',
    isSpicy: true,
  },
  {
    id: 'salad-red-plain',
    nameAr: 'سلطة احمر عادي',
    nameEn: 'Plain Red Salad',
    descAr: 'سلطة حمراء عادية بالطماطم',
    descEn: 'Plain red salad with tomatoes',
    price: 4,
    image: '/images/red-salad.jpg',
    category: 'cat_salads',
  },
  {
    id: 'salad-tahina',
    nameAr: 'سلطة طحينة',
    nameEn: 'Tahina Salad',
    descAr: 'سلطة طحينة كريمية شهية',
    descEn: 'Creamy delicious tahina salad',
    price: 4,
    image: '/images/tahina-salad.jpg',
    category: 'cat_salads',
  },

  // ========================================
  // قسم المشروبات (DRINKS)
  // ========================================
  {
    id: 'drink-soda',
    nameAr: 'مشروب غازي',
    nameEn: 'Soft Drink',
    descAr: 'مشروب غازي بارد (بيبسي / كولا / سفن أب)',
    descEn: 'Chilled soft drink (Pepsi / Cola / 7UP)',
    price: 3,
    image: '/images/soft-drink.jpg',
    category: 'cat_drinks',
    isBestSeller: true,
  },
  {
    id: 'drink-laban',
    nameAr: 'لبن القرية',
    nameEn: 'Village Yogurt',
    descAr: 'لبن القرية الطازج والمرطّب',
    descEn: 'Fresh chilled village yogurt',
    price: 3,
    image: '/images/village-laban.jpg',
    category: 'cat_drinks',
    isPopular: true,
  },
  {
    id: 'drink-water',
    nameAr: 'ماء 600 مل',
    nameEn: 'Water 600ml',
    descAr: 'مياه معدنية باردة',
    descEn: 'Chilled mineral water',
    price: 1,
    image: '/images/water.jpg',
    category: 'cat_drinks',
  },

  // ========================================
  // قسم الحلويات (DESSERTS)
  // ========================================
  {
    id: 'dessert-kunafa',
    nameAr: 'كنافة',
    nameEn: 'Kunafa',
    descAr: 'كنافة ناعمة بالجبنة والقطر',
    descEn: 'Soft kunafa with cheese and syrup',
    price: 11,
    image: '/images/kunafa.jpg',
    category: 'cat_desserts',
    isPopular: true,
    isBestSeller: true,
  },
  {
    id: 'dessert-cream',
    nameAr: 'كريمة (فرن)',
    nameEn: 'Baked Cream',
    descAr: 'كريمة فرن طازجة بالقشطة',
    descEn: 'Fresh baked cream',
    price: 10,
    image: '/images/baked-cream.jpg',
    category: 'cat_desserts',
  },
  {
    id: 'dessert-cream-small',
    nameAr: 'كريمة (فرن) صغيرة',
    nameEn: 'Small Baked Cream',
    descAr: 'كريمة فرن صغيرة بالقشطة',
    descEn: 'Small baked cream',
    price: 8,
    image: '/images/baked-cream-small.jpg',
    category: 'cat_desserts',
  },
];

export const menuCategories: MenuCategory[] = [
  { id: 'cat_chicken', nameAr: 'الدجاج', nameEn: 'Chicken', icon: '🍗', items: allMenuItems.filter(i => i.category === 'cat_chicken') },
  { id: 'cat_meat', nameAr: 'اللحوم', nameEn: 'Meat', icon: '🥩', items: allMenuItems.filter(i => i.category === 'cat_meat') },
  { id: 'cat_sides', nameAr: 'الإيدامات', nameEn: 'Side Dishes', icon: '🍲', items: allMenuItems.filter(i => i.category === 'cat_sides') },
  { id: 'cat_salads', nameAr: 'السلطات', nameEn: 'Salads', icon: '🥗', items: allMenuItems.filter(i => i.category === 'cat_salads') },
  { id: 'cat_drinks', nameAr: 'المشروبات', nameEn: 'Drinks', icon: '🥤', items: allMenuItems.filter(i => i.category === 'cat_drinks') },
  { id: 'cat_desserts', nameAr: 'الحلويات', nameEn: 'Desserts', icon: '🍮', items: allMenuItems.filter(i => i.category === 'cat_desserts') },
];

export const popularItems = allMenuItems.filter(item => item.isPopular || item.isBestSeller);
