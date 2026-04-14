import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash('Admin123!', 12);

  await prisma.user.upsert({
    where: { email: 'admin@local.test' },
    create: {
      email: 'admin@local.test',
      passwordHash,
      role: 'ADMIN',
      name: 'Admin',
      isActive: true,
    },
    update: {
      passwordHash,
      isActive: true,
    },
  });

  await prisma.restaurantSettings.upsert({
    where: { id: 'default' },
    create: {
      id: 'default',
      nameAr: 'مطعم الواحة',
      nameEn: 'Al Wahah Restaurant',
      currency: 'SAR',
      whatsappNumber: '966500000000',
      logo: null,
      defaultPickupAddressAr: 'الرياض - طريق الملك فهد، حي العليا',
      defaultPickupAddressEn: 'Riyadh - King Fahd Road, Olaya District',
      deliveryFeeAmount: 1000,
      freeDeliveryMinTotal: 10000,
    },
    update: {},
  });

  const catChicken = await prisma.category.upsert({
    where: { id: 'seed_cat_chicken' },
    create: {
      id: 'seed_cat_chicken',
      nameAr: 'الدجاج',
      nameEn: 'Chicken',
      sortOrder: 0,
      isActive: true,
    },
    update: {
      nameAr: 'الدجاج',
      nameEn: 'Chicken',
    },
  });

  const catMeat = await prisma.category.upsert({
    where: { id: 'seed_cat_meat' },
    create: {
      id: 'seed_cat_meat',
      nameAr: 'اللحوم',
      nameEn: 'Meat',
      sortOrder: 1,
      isActive: true,
    },
    update: {
      nameAr: 'اللحوم',
      nameEn: 'Meat',
    },
  });

  await prisma.menuItem.upsert({
    where: { id: 'seed_item_mandi' },
    create: {
      id: 'seed_item_mandi',
      categoryId: catChicken.id,
      nameAr: 'مندي دجاج',
      nameEn: 'Chicken Mandi',
      descriptionAr: 'أرز مندي مع دجاج طري',
      descriptionEn: 'Mandi rice with tender chicken',
      price: 4500,
      image: '/images/hero-bg.jpg',
      available: true,
      sortOrder: 0,
    },
    update: {
      nameAr: 'مندي دجاج',
      nameEn: 'Chicken Mandi',
      price: 4500,
    },
  });

  await prisma.menuItem.upsert({
    where: { id: 'seed_item_kabsa' },
    create: {
      id: 'seed_item_kabsa',
      categoryId: catChicken.id,
      nameAr: 'كبسة دجاج',
      nameEn: 'Chicken Kabsa',
      descriptionAr: 'كبسة تقليدية',
      descriptionEn: 'Traditional kabsa',
      price: 3800,
      image: '/images/hero-bg.jpg',
      available: true,
      sortOrder: 1,
    },
    update: {
      nameAr: 'كبسة دجاج',
      nameEn: 'Chicken Kabsa',
      price: 3800,
    },
  });

  await prisma.menuItem.upsert({
    where: { id: 'seed_item_lamb' },
    create: {
      id: 'seed_item_lamb',
      categoryId: catMeat.id,
      nameAr: 'مندي لحم',
      nameEn: 'Meat Mandi',
      descriptionAr: 'لحم غنم طري',
      descriptionEn: 'Tender lamb',
      price: 5500,
      image: '/images/hero-bg.jpg',
      available: true,
      sortOrder: 0,
    },
    update: {
      nameAr: 'مندي لحم',
      nameEn: 'Meat Mandi',
      price: 5500,
    },
  });

  const item = await prisma.menuItem.findUnique({ where: { id: 'seed_item_mandi' } });
  if (item) {
    const group = await prisma.optionGroup.upsert({
      where: { id: 'seed_og_size' },
      create: {
        id: 'seed_og_size',
        menuItemId: item.id,
        nameAr: 'الحجم',
        nameEn: 'Size',
        selectionType: 'SINGLE',
        isRequired: true,
        sortOrder: 0,
      },
      update: {},
    });

    await prisma.optionValue.upsert({
      where: { id: 'seed_ov_quarter' },
      create: {
        id: 'seed_ov_quarter',
        optionGroupId: group.id,
        nameAr: 'ربع',
        nameEn: 'Quarter',
        priceModifier: 0,
        sortOrder: 0,
      },
      update: {},
    });

    await prisma.optionValue.upsert({
      where: { id: 'seed_ov_half' },
      create: {
        id: 'seed_ov_half',
        optionGroupId: group.id,
        nameAr: 'نصف',
        nameEn: 'Half',
        priceModifier: 1500,
        sortOrder: 1,
      },
      update: {},
    });
  }

  await prisma.branch.upsert({
    where: { id: 'seed_branch_1' },
    create: {
      id: 'seed_branch_1',
      nameAr: 'فرع العليا',
      nameEn: 'Olaya Branch',
      addressAr: 'طريق الملك فهد',
      addressEn: 'King Fahd Road',
      cityAr: 'الرياض',
      cityEn: 'Riyadh',
      phone: '+966112345678',
      hoursAr: '11 ص - 2 ص',
      hoursEn: '11 AM - 2 AM',
      lat: 24.7136,
      lng: 46.6753,
      sortOrder: 0,
      isActive: true,
    },
    update: {},
  });

  console.log('Seed OK: admin@local.test / Admin123!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
