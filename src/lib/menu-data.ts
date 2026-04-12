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
  options?: {
    hasQuantity?: boolean;    // quarter/half/whole
    hasCookingMethod?: boolean; // mandi/madhbii/madghoot/madfoun
    hasRiceType?: boolean;    // bukhari/spicy/plain
    hasSize?: boolean;        // small/medium/large
    hasExtras?: boolean;      // sauce/salad/soup/bread
    extras?: { id: string; nameAr: string; nameEn: string; price: number }[];
  };
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
    commentEn: 'Best mandi restaurant I\'ve tried! The taste is authentic and the service is excellent. Highly recommended.',
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
    rating: 4,
    commentAr: 'المندي عندهم شيء ثاني! الرز بيشاور طيّب جداً. الأسعار معقولة.',
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

export const allMenuItems: MenuItem[] = [
  // ======= CHICKEN =======
  {
    id: 'chicken-1',
    nameAr: 'ربع دجاجة مع رز',
    nameEn: 'Quarter Chicken with Rice',
    descAr: 'ربع دجاجة مشوية مع رز بختيارك وسلطة',
    descEn: 'Quarter grilled chicken with rice of your choice and salad',
    price: 28,
    image: '/images/quarter-chicken.jpg',
    category: 'cat_chicken',
    isPopular: true,
    options: {
      hasRiceType: true,
      hasExtras: true,
      extras: [
        { id: 'ext-sauce', nameAr: 'صوص', nameEn: 'Sauce', price: 2 },
        { id: 'ext-salad', nameAr: 'سلطة', nameEn: 'Salad', price: 5 },
        { id: 'ext-soup', nameAr: 'شوربة', nameEn: 'Soup', price: 5 },
        { id: 'ext-bread', nameAr: 'خبز', nameEn: 'Bread', price: 2 },
      ],
    },
  },
  {
    id: 'chicken-2',
    nameAr: 'نصف دجاجة مع رز',
    nameEn: 'Half Chicken with Rice',
    descAr: 'نصف دجاجة مشوية مع رز بختيارك وسلطة',
    descEn: 'Half grilled chicken with rice of your choice and salad',
    price: 42,
    image: '/images/half-chicken.jpg',
    category: 'cat_chicken',
    isPopular: true,
    isBestSeller: true,
    options: {
      hasRiceType: true,
      hasExtras: true,
      extras: [
        { id: 'ext-sauce', nameAr: 'صوص', nameEn: 'Sauce', price: 2 },
        { id: 'ext-salad', nameAr: 'سلطة', nameEn: 'Salad', price: 5 },
        { id: 'ext-soup', nameAr: 'شوربة', nameEn: 'Soup', price: 5 },
        { id: 'ext-bread', nameAr: 'خبز', nameEn: 'Bread', price: 2 },
      ],
    },
  },
  {
    id: 'chicken-3',
    nameAr: 'دجاجة كاملة مع رز',
    nameEn: 'Whole Chicken with Rice',
    descAr: 'دجاجة كاملة مشوية مع رز بختيارك وسلطة ومشروب',
    descEn: 'Whole grilled chicken with rice of your choice, salad and drink',
    price: 65,
    image: '/images/whole-chicken.jpg',
    category: 'cat_chicken',
    options: {
      hasRiceType: true,
      hasExtras: true,
      extras: [
        { id: 'ext-sauce', nameAr: 'صوص', nameEn: 'Sauce', price: 2 },
        { id: 'ext-salad', nameAr: 'سلطة', nameEn: 'Salad', price: 5 },
        { id: 'ext-soup', nameAr: 'شوربة', nameEn: 'Soup', price: 5 },
        { id: 'ext-bread', nameAr: 'خبز', nameEn: 'Bread', price: 2 },
      ],
    },
  },
  {
    id: 'chicken-4',
    nameAr: 'دجاج مشوي مقبل',
    nameEn: 'Seasoned Grilled Chicken',
    descAr: 'دجاج مشوي بالتتبيلة الخاصة مع رز وسلطة',
    descEn: 'Grilled chicken with special marinade, rice and salad',
    price: 35,
    image: '/images/grilled-chicken.jpg',
    category: 'cat_chicken',
    isNew: true,
    options: {
      hasQuantity: true,
      hasRiceType: true,
      hasExtras: true,
      extras: [
        { id: 'ext-sauce', nameAr: 'صوص', nameEn: 'Sauce', price: 2 },
        { id: 'ext-salad', nameAr: 'سلطة', nameEn: 'Salad', price: 5 },
        { id: 'ext-soup', nameAr: 'شوربة', nameEn: 'Soup', price: 5 },
        { id: 'ext-bread', nameAr: 'خبز', nameEn: 'Bread', price: 2 },
      ],
    },
  },

  // ======= MEAT =======
  {
    id: 'meat-1',
    nameAr: 'نفر لحم',
    nameEn: 'Meat Plate',
    descAr: 'قطع لحم مشوية على الفحم مع رز وسلطة',
    descEn: 'Charcoal grilled meat cuts with rice and salad',
    price: 55,
    image: '/images/meat-plate.jpg',
    category: 'cat_meat',
    isPopular: true,
    isBestSeller: true,
    options: {
      hasRiceType: true,
      hasExtras: true,
      extras: [
        { id: 'ext-sauce', nameAr: 'صوص', nameEn: 'Sauce', price: 2 },
        { id: 'ext-salad', nameAr: 'سلطة', nameEn: 'Salad', price: 5 },
        { id: 'ext-soup', nameAr: 'شوربة', nameEn: 'Soup', price: 5 },
        { id: 'ext-bread', nameAr: 'خبز', nameEn: 'Bread', price: 2 },
      ],
    },
  },
  {
    id: 'meat-2',
    nameAr: 'مكسرات لحم',
    nameEn: 'Meat with Nuts',
    descAr: 'قطع لحم مطهوة مع المكسرات والرز البسمتي',
    descEn: 'Slow-cooked meat with nuts and basmati rice',
    price: 65,
    image: '/images/meat-nuts.jpg',
    category: 'cat_meat',
    isNew: true,
    options: {
      hasRiceType: true,
      hasExtras: true,
      extras: [
        { id: 'ext-sauce', nameAr: 'صوص', nameEn: 'Sauce', price: 2 },
        { id: 'ext-salad', nameAr: 'سلطة', nameEn: 'Salad', price: 5 },
        { id: 'ext-soup', nameAr: 'شوربة', nameEn: 'Soup', price: 5 },
      ],
    },
  },
  {
    id: 'meat-3',
    nameAr: 'ريب لحم',
    nameEn: 'Meat Rib',
    descAr: 'ريب لحم طري مشوي على الفحم مع رز',
    descEn: 'Tender charcoal grilled meat rib with rice',
    price: 75,
    image: '/images/meat-rib.jpg',
    category: 'cat_meat',
    options: {
      hasRiceType: true,
      hasExtras: true,
      extras: [
        { id: 'ext-sauce', nameAr: 'صوص', nameEn: 'Sauce', price: 2 },
        { id: 'ext-salad', nameAr: 'سلطة', nameEn: 'Salad', price: 5 },
        { id: 'ext-soup', nameAr: 'شوربة', nameEn: 'Soup', price: 5 },
        { id: 'ext-bread', nameAr: 'خبز', nameEn: 'Bread', price: 2 },
      ],
    },
  },

  // ======= MANDI =======
  {
    id: 'mandi-1',
    nameAr: 'لحم مندي',
    nameEn: 'Meat Mandi',
    descAr: 'مندي لحم تقليدي مطهو ببطء مع رز بسمتي معطر بالتوابل والبهارات',
    descEn: 'Traditional slow-cooked meat mandi with basmati rice flavored with spices',
    price: 55,
    image: '/images/meat-mandi.jpg',
    category: 'cat_mandi',
    isPopular: true,
    isBestSeller: true,
    options: {
      hasExtras: true,
      extras: [
        { id: 'ext-sauce', nameAr: 'صوص', nameEn: 'Sauce', price: 2 },
        { id: 'ext-salad', nameAr: 'سلطة', nameEn: 'Salad', price: 5 },
        { id: 'ext-soup', nameAr: 'شوربة', nameEn: 'Soup', price: 5 },
        { id: 'ext-bread', nameAr: 'خبز', nameEn: 'Bread', price: 2 },
      ],
    },
  },
  {
    id: 'mandi-2',
    nameAr: 'دجاج مندي',
    nameEn: 'Chicken Mandi',
    descAr: 'مندي دجاج تقليدي مع رز بسمتي معطر بالتوابل',
    descEn: 'Traditional chicken mandi with basmati rice flavored with spices',
    price: 35,
    image: '/images/chicken-mandi.jpg',
    category: 'cat_mandi',
    isPopular: true,
    options: {
      hasQuantity: true,
      hasExtras: true,
      extras: [
        { id: 'ext-sauce', nameAr: 'صوص', nameEn: 'Sauce', price: 2 },
        { id: 'ext-salad', nameAr: 'سلطة', nameEn: 'Salad', price: 5 },
        { id: 'ext-soup', nameAr: 'شوربة', nameEn: 'Soup', price: 5 },
        { id: 'ext-bread', nameAr: 'خبز', nameEn: 'Bread', price: 2 },
      ],
    },
  },

  // ======= MADHBII =======
  {
    id: 'madhbii-1',
    nameAr: 'لحم مظبي',
    nameEn: 'Meat Madhbii',
    descAr: 'لحم مظبي مطهو بالحجارة الساخنة مع رز بسمتي',
    descEn: 'Meat madhbii cooked with hot stones and basmati rice',
    price: 60,
    image: '/images/meat-madhbii.jpg',
    category: 'cat_madhbii',
    isBestSeller: true,
    options: {
      hasExtras: true,
      extras: [
        { id: 'ext-sauce', nameAr: 'صوص', nameEn: 'Sauce', price: 2 },
        { id: 'ext-salad', nameAr: 'سلطة', nameEn: 'Salad', price: 5 },
        { id: 'ext-soup', nameAr: 'شوربة', nameEn: 'Soup', price: 5 },
        { id: 'ext-bread', nameAr: 'خبز', nameEn: 'Bread', price: 2 },
      ],
    },
  },
  {
    id: 'madhbii-2',
    nameAr: 'دجاج مظبي',
    nameEn: 'Chicken Madhbii',
    descAr: 'دجاج مظبي بالحجارة الساخنة مع رز معطر',
    descEn: 'Chicken madhbii with hot stones and flavored rice',
    price: 38,
    image: '/images/chicken-madhbii.jpg',
    category: 'cat_madhbii',
    options: {
      hasQuantity: true,
      hasExtras: true,
      extras: [
        { id: 'ext-sauce', nameAr: 'صوص', nameEn: 'Sauce', price: 2 },
        { id: 'ext-salad', nameAr: 'سلطة', nameEn: 'Salad', price: 5 },
        { id: 'ext-soup', nameAr: 'شوربة', nameEn: 'Soup', price: 5 },
      ],
    },
  },

  // ======= MADGHOOT =======
  {
    id: 'madghoot-1',
    nameAr: 'لحم مضغوط',
    nameEn: 'Meat Madghoot',
    descAr: 'لحم مضغوط مطهو ببطء مع رز بسمتي ومرق غني',
    descEn: 'Slow-cooked meat madghoot with basmati rice and rich broth',
    price: 58,
    image: '/images/meat-madghoot.jpg',
    category: 'cat_madghoot',
    isPopular: true,
    options: {
      hasExtras: true,
      extras: [
        { id: 'ext-sauce', nameAr: 'صوص', nameEn: 'Sauce', price: 2 },
        { id: 'ext-salad', nameAr: 'سلطة', nameEn: 'Salad', price: 5 },
        { id: 'ext-soup', nameAr: 'شوربة', nameEn: 'Soup', price: 5 },
        { id: 'ext-bread', nameAr: 'خبز', nameEn: 'Bread', price: 2 },
      ],
    },
  },
  {
    id: 'madghoot-2',
    nameAr: 'دجاج مضغوط',
    nameEn: 'Chicken Madghoot',
    descAr: 'دجاج مضغوط مع رز معطر بالتوابل والبهارات',
    descEn: 'Chicken madghoot with rice flavored with spices',
    price: 36,
    image: '/images/chicken-madghoot.jpg',
    category: 'cat_madghoot',
    options: {
      hasQuantity: true,
      hasExtras: true,
      extras: [
        { id: 'ext-sauce', nameAr: 'صوص', nameEn: 'Sauce', price: 2 },
        { id: 'ext-salad', nameAr: 'سلطة', nameEn: 'Salad', price: 5 },
        { id: 'ext-soup', nameAr: 'شوربة', nameEn: 'Soup', price: 5 },
      ],
    },
  },

  // ======= MADFOUN =======
  {
    id: 'madfoun-1',
    nameAr: 'دجاج مدفون',
    nameEn: 'Chicken Madfoun',
    descAr: 'دجاج مدفون في خبز صاج مع رز وسلطة',
    descEn: 'Chicken madfoun baked in saj bread with rice and salad',
    price: 40,
    image: '/images/chicken-madfoun.jpg',
    category: 'cat_madfoun',
    isNew: true,
    options: {
      hasQuantity: true,
      hasRiceType: true,
      hasExtras: true,
      extras: [
        { id: 'ext-sauce', nameAr: 'صوص', nameEn: 'Sauce', price: 2 },
        { id: 'ext-salad', nameAr: 'سلطة', nameEn: 'Salad', price: 5 },
        { id: 'ext-soup', nameAr: 'شوربة', nameEn: 'Soup', price: 5 },
      ],
    },
  },
  {
    id: 'madfoun-2',
    nameAr: 'لحم مدفون',
    nameEn: 'Meat Madfoun',
    descAr: 'لحم مدفون في خبز صاج مع رز وسلطة ومرق',
    descEn: 'Meat madfoun baked in saj bread with rice, salad and broth',
    price: 65,
    image: '/images/meat-madfoun.jpg',
    category: 'cat_madfoun',
    options: {
      hasExtras: true,
      extras: [
        { id: 'ext-sauce', nameAr: 'صوص', nameEn: 'Sauce', price: 2 },
        { id: 'ext-salad', nameAr: 'سلطة', nameEn: 'Salad', price: 5 },
        { id: 'ext-soup', nameAr: 'شوربة', nameEn: 'Soup', price: 5 },
        { id: 'ext-bread', nameAr: 'خبز', nameEn: 'Bread', price: 2 },
      ],
    },
  },

  // ======= INDIVIDUAL MEALS =======
  {
    id: 'ind-1',
    nameAr: 'وجبة فردية دجاج',
    nameEn: 'Individual Chicken Meal',
    descAr: 'ربع دجاجة مع رز وسلطة ومشروب',
    descEn: 'Quarter chicken with rice, salad and drink',
    price: 32,
    image: '/images/individual-chicken.jpg',
    category: 'cat_individual',
    isPopular: true,
    options: {
      hasCookingMethod: true,
      hasRiceType: true,
      hasExtras: true,
      extras: [
        { id: 'ext-sauce', nameAr: 'صوص', nameEn: 'Sauce', price: 2 },
        { id: 'ext-soup', nameAr: 'شوربة', nameEn: 'Soup', price: 5 },
      ],
    },
  },
  {
    id: 'ind-2',
    nameAr: 'وجبة فردية لحم',
    nameEn: 'Individual Meat Meal',
    descAr: 'نفر لحم مع رز وسلطة ومشروب',
    descEn: 'Meat plate with rice, salad and drink',
    price: 48,
    image: '/images/individual-meat.jpg',
    category: 'cat_individual',
    isBestSeller: true,
    options: {
      hasCookingMethod: true,
      hasRiceType: true,
      hasExtras: true,
      extras: [
        { id: 'ext-sauce', nameAr: 'صوص', nameEn: 'Sauce', price: 2 },
        { id: 'ext-soup', nameAr: 'شوربة', nameEn: 'Soup', price: 5 },
      ],
    },
  },
  {
    id: 'ind-3',
    nameAr: 'وجبة برجر عربي',
    nameEn: 'Arabic Burger Meal',
    descAr: 'برجر لحم عربي مع بطاطس ومشروب',
    descEn: 'Arabic meat burger with fries and drink',
    price: 28,
    image: '/images/arabic-burger.jpg',
    category: 'cat_individual',
    isNew: true,
    options: {
      hasSize: true,
    },
  },

  // ======= FAMILY MEALS =======
  {
    id: 'fam-1',
    nameAr: 'باقة عائلية مندي',
    nameEn: 'Family Mandi Package',
    descAr: 'مندي دجاج + مندي لحم + سلطة + مشروبات + حلا',
    descEn: 'Chicken mandi + meat mandi + salad + drinks + dessert',
    price: 189,
    image: '/images/family-mandi.jpg',
    category: 'cat_family',
    isPopular: true,
    isBestSeller: true,
    options: {
      hasRiceType: true,
      hasExtras: true,
      extras: [
        { id: 'ext-sauce', nameAr: 'صوص إضافي', nameEn: 'Extra Sauce', price: 2 },
        { id: 'ext-soup', nameAr: 'شوربة إضافية', nameEn: 'Extra Soup', price: 5 },
        { id: 'ext-salad', nameAr: 'سلطة إضافية', nameEn: 'Extra Salad', price: 5 },
      ],
    },
  },
  {
    id: 'fam-2',
    nameAr: 'باقة عائلية مشكل',
    nameEn: 'Mixed Family Package',
    descAr: 'دجاجة كاملة + لحم + رز + سلطة + شوربة + مشروبات',
    descEn: 'Whole chicken + meat + rice + salad + soup + drinks',
    price: 165,
    image: '/images/family-mixed.jpg',
    category: 'cat_family',
    options: {
      hasCookingMethod: true,
      hasRiceType: true,
      hasExtras: true,
      extras: [
        { id: 'ext-sauce', nameAr: 'صوص إضافي', nameEn: 'Extra Sauce', price: 2 },
        { id: 'ext-soup', nameAr: 'شوربة إضافية', nameEn: 'Extra Soup', price: 5 },
      ],
    },
  },
  {
    id: 'fam-3',
    nameAr: 'باقة الأصدقاء',
    nameEn: 'Friends Package',
    descAr: 'وجبتان فردية + سلطة مشتركة + مشروبات',
    descEn: 'Two individual meals + shared salad + drinks',
    price: 89,
    image: '/images/friends-package.jpg',
    category: 'cat_family',
    isNew: true,
    options: {
      hasCookingMethod: true,
      hasRiceType: true,
    },
  },

  // ======= RICE =======
  {
    id: 'rice-1',
    nameAr: 'أرز بشاور',
    nameEn: 'Bukhari Rice',
    descAr: 'أرز بشاور معطر بالتوابل والزبيب والجزر',
    descEn: 'Bukhari rice flavored with spices, raisins and carrots',
    price: 12,
    image: '/images/bukhari-rice.jpg',
    category: 'cat_rice',
    isPopular: true,
  },
  {
    id: 'rice-2',
    nameAr: 'أرز حار',
    nameEn: 'Spicy Rice',
    descAr: 'أرز حار بالتوابل الحارة والبهارات',
    descEn: 'Spicy rice with hot spices and seasonings',
    price: 12,
    image: '/images/spicy-rice.jpg',
    category: 'cat_rice',
    isSpicy: true,
  },
  {
    id: 'rice-3',
    nameAr: 'أرز عادي',
    nameEn: 'Plain Rice',
    descAr: 'أرز بسمتي أبيض مطهو بشكل مثالي',
    descEn: 'Perfectly cooked white basmati rice',
    price: 10,
    image: '/images/plain-rice.jpg',
    category: 'cat_rice',
  },

  // ======= SIDES =======
  {
    id: 'side-1',
    nameAr: 'خبز صاج',
    nameEn: 'Saj Bread',
    descAr: 'خبز صاج طازج محضر يومياً',
    descEn: 'Fresh saj bread prepared daily',
    price: 3,
    image: '/images/saj-bread.jpg',
    category: 'cat_sides',
  },
  {
    id: 'side-2',
    nameAr: 'صوص خاص',
    nameEn: 'Special Sauce',
    descAr: 'صوص الصلصة الخاصة بالمطعم',
    descEn: 'Restaurant special tomato sauce',
    price: 3,
    image: '/images/sauce.jpg',
    category: 'cat_sides',
  },
  {
    id: 'side-3',
    nameAr: 'لبن',
    nameEn: 'Yogurt',
    descAr: 'لبن طازج ومرطّب',
    descEn: 'Fresh chilled yogurt',
    price: 5,
    image: '/images/yogurt.jpg',
    category: 'cat_sides',
    isPopular: true,
  },
  {
    id: 'side-4',
    nameAr: 'مقبلات مشكلة',
    nameEn: 'Mixed Appetizers',
    descAr: 'تشكيلة من المقبلات الشهية',
    descEn: 'Selection of delicious appetizers',
    price: 15,
    image: '/images/appetizers.jpg',
    category: 'cat_sides',
    isNew: true,
  },

  // ======= SALADS =======
  {
    id: 'salad-1',
    nameAr: 'سلطة خضراء',
    nameEn: 'Green Salad',
    descAr: 'سلطة خضراء طازجة مع الطماطم والخيار والبصل',
    descEn: 'Fresh green salad with tomatoes, cucumbers and onions',
    price: 5,
    image: '/images/green-salad.jpg',
    category: 'cat_salads',
  },
  {
    id: 'salad-2',
    nameAr: 'سلطة عربية',
    nameEn: 'Arabic Salad',
    descAr: 'سلطة عربية تقليدية بالبقدونس والطماطم والليمون',
    descEn: 'Traditional Arabic salad with parsley, tomatoes and lemon',
    price: 6,
    image: '/images/arabic-salad.jpg',
    category: 'cat_salads',
  },
  {
    id: 'salad-3',
    nameAr: 'تبولة',
    nameEn: 'Tabbouleh',
    descAr: 'تبولة طازجة بالبقدونس والبرغل والليمون',
    descEn: 'Fresh tabbouleh with parsley, bulgur and lemon',
    price: 7,
    image: '/images/tabbouleh.jpg',
    category: 'cat_salads',
    isPopular: true,
  },

  // ======= SOUPS =======
  {
    id: 'soup-1',
    nameAr: 'شوربة عدس',
    nameEn: 'Lentil Soup',
    descAr: 'شوربة عدس تقليدية ساخنة',
    descEn: 'Traditional hot lentil soup',
    price: 5,
    image: '/images/lentil-soup.jpg',
    category: 'cat_soups',
    isPopular: true,
  },
  {
    id: 'soup-2',
    nameAr: 'شوربة مركبية',
    nameEn: 'Chicken Soup',
    descAr: 'شوربة دجاج مع الخضار والبهارات',
    descEn: 'Chicken soup with vegetables and spices',
    price: 7,
    image: '/images/chicken-soup.jpg',
    category: 'cat_soups',
  },
  {
    id: 'soup-3',
    nameAr: 'شوربة خضار',
    nameEn: 'Vegetable Soup',
    descAr: 'شوربة خضار طازجة ساخنة',
    descEn: 'Hot fresh vegetable soup',
    price: 5,
    image: '/images/veg-soup.jpg',
    category: 'cat_soups',
  },

  // ======= DRINKS =======
  {
    id: 'drink-1',
    nameAr: 'بيبسي',
    nameEn: 'Pepsi',
    descAr: 'بيبسي بارد',
    descEn: 'Chilled Pepsi',
    price: 3,
    image: '/images/pepsi.jpg',
    category: 'cat_drinks',
    options: { hasSize: true },
  },
  {
    id: 'drink-2',
    nameAr: 'كولا',
    nameEn: 'Coca-Cola',
    descAr: 'كوكا كولا باردة',
    descEn: 'Chilled Coca-Cola',
    price: 3,
    image: '/images/cola.jpg',
    category: 'cat_drinks',
    options: { hasSize: true },
  },
  {
    id: 'drink-3',
    nameAr: 'سفن أب',
    nameEn: '7UP',
    descAr: 'سفن أب بارد',
    descEn: 'Chilled 7UP',
    price: 3,
    image: '/images/7up.jpg',
    category: 'cat_drinks',
    options: { hasSize: true },
  },
  {
    id: 'drink-4',
    nameAr: 'مياه',
    nameEn: 'Water',
    descAr: 'مياه معدنية باردة',
    descEn: 'Chilled mineral water',
    price: 2,
    image: '/images/water.jpg',
    category: 'cat_drinks',
    options: { hasSize: true },
  },
  {
    id: 'drink-5',
    nameAr: 'عصير برتقال',
    nameEn: 'Orange Juice',
    descAr: 'عصير برتقال طبيعي طازج',
    descEn: 'Fresh natural orange juice',
    price: 8,
    image: '/images/orange-juice.jpg',
    category: 'cat_drinks',
    isNew: true,
    options: { hasSize: true },
  },
  {
    id: 'drink-6',
    nameAr: 'شاي يمني',
    nameEn: 'Yemeni Tea',
    descAr: 'شاي يمني تقليدي بالحليب والهيل',
    descEn: 'Traditional Yemeni tea with milk and cardamom',
    price: 5,
    image: '/images/yemeni-tea.jpg',
    category: 'cat_drinks',
    isPopular: true,
  },
  {
    id: 'drink-7',
    nameAr: 'قهوة عربية',
    nameEn: 'Arabic Coffee',
    descAr: 'قهوة عربية أصيلة مع التمر',
    descEn: 'Authentic Arabic coffee with dates',
    price: 7,
    image: '/images/arabic-coffee.jpg',
    category: 'cat_drinks',
    isPopular: true,
  },

  // ======= DESSERTS =======
  {
    id: 'dessert-1',
    nameAr: 'كنافة',
    nameEn: 'Kunafa',
    descAr: 'كنافة ناعمة بالجبنة والقطر',
    descEn: 'Soft kunafa with cheese and syrup',
    price: 12,
    image: '/images/kunafa.jpg',
    category: 'cat_desserts',
    isPopular: true,
  },
  {
    id: 'dessert-2',
    nameAr: 'بسبوسة',
    nameEn: 'Basbousa',
    descAr: 'بسبوسة طازجة بالقشطة والقطر',
    descEn: 'Fresh basbousa with cream and syrup',
    price: 8,
    image: '/images/basbousa.jpg',
    category: 'cat_desserts',
  },
  {
    id: 'dessert-3',
    nameAr: 'تقطيع',
    nameEn: 'Muhalabia',
    descAr: 'مهلبية طازجة بالفستق والقشطة',
    descEn: 'Fresh muhalabia with pistachios and cream',
    price: 10,
    image: '/images/muhalabia.jpg',
    category: 'cat_desserts',
    isNew: true,
  },
];

export const menuCategories: MenuCategory[] = [
  { id: 'cat_chicken', nameAr: 'الدجاج', nameEn: 'Chicken', icon: '🐔', items: allMenuItems.filter(i => i.category === 'cat_chicken') },
  { id: 'cat_meat', nameAr: 'اللحوم', nameEn: 'Meat', icon: '🥩', items: allMenuItems.filter(i => i.category === 'cat_meat') },
  { id: 'cat_mandi', nameAr: 'المندي', nameEn: 'Mandi', icon: '🍚', items: allMenuItems.filter(i => i.category === 'cat_mandi') },
  { id: 'cat_madhbii', nameAr: 'المظبي', nameEn: 'Madhbii', icon: '🔥', items: allMenuItems.filter(i => i.category === 'cat_madhbii') },
  { id: 'cat_madghoot', nameAr: 'المضغوط', nameEn: 'Madghoot', icon: '🍲', items: allMenuItems.filter(i => i.category === 'cat_madghoot') },
  { id: 'cat_madfoun', nameAr: 'المدفون', nameEn: 'Madfoun', icon: '🫕', items: allMenuItems.filter(i => i.category === 'cat_madfoun') },
  { id: 'cat_individual', nameAr: 'الوجبات الفردية', nameEn: 'Individual Meals', icon: '🍽️', items: allMenuItems.filter(i => i.category === 'cat_individual') },
  { id: 'cat_family', nameAr: 'الوجبات العائلية', nameEn: 'Family Meals', icon: '👨‍👩‍👧‍👦', items: allMenuItems.filter(i => i.category === 'cat_family') },
  { id: 'cat_rice', nameAr: 'الأرز', nameEn: 'Rice', icon: '🌾', items: allMenuItems.filter(i => i.category === 'cat_rice') },
  { id: 'cat_sides', nameAr: 'الإضافات', nameEn: 'Sides', icon: '🫙', items: allMenuItems.filter(i => i.category === 'cat_sides') },
  { id: 'cat_salads', nameAr: 'السلطات', nameEn: 'Salads', icon: '🥗', items: allMenuItems.filter(i => i.category === 'cat_salads') },
  { id: 'cat_soups', nameAr: 'الشوربات', nameEn: 'Soups', icon: '🍜', items: allMenuItems.filter(i => i.category === 'cat_soups') },
  { id: 'cat_drinks', nameAr: 'المشروبات', nameEn: 'Drinks', icon: '🥤', items: allMenuItems.filter(i => i.category === 'cat_drinks') },
  { id: 'cat_desserts', nameAr: 'الحلويات', nameEn: 'Desserts', icon: '🍮', items: allMenuItems.filter(i => i.category === 'cat_desserts') },
];
