const { PrismaClient, Role } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  const existing = await prisma.user.findFirst({
    where: { email: 'super@admin.com' }
  });

  if (existing) {
    console.log('✅ Data already seeded, skipping...');
    return;
  }

  const hashedPassword = await bcrypt.hash('superadmin123', 10);
  
  await prisma.user.upsert({
    where: { email: 'super@admin.com' },
    update: {},
    create: {
      email: 'super@admin.com',
      password: hashedPassword,
      fullName: 'Super Administrator',
      role: Role.SUPER_ADMIN,
    },
  });

  const adminPass = await bcrypt.hash('admin123', 10);
  await prisma.user.upsert({
    where: { email: 'admin@store.com' },
    update: {},
    create: {
      email: 'admin@store.com',
      password: adminPass,
      fullName: 'Store Admin',
      role: Role.ADMIN,
    },
  });

  await prisma.warehouse.upsert({
    where: { id: 1 },
    update: {},
    create: { name: 'Main Warehouse', location: 'Jakarta' },
  });

  const category = await prisma.category.upsert({
    where: { id: 1 },
    update: {},
    create: { name: 'T-Shirt' },
  });

  const product = await prisma.product.create({
    data: {
      name: 'Basic Cotton T-Shirt',
      description: 'Premium cotton t-shirt',
      basePrice: 199000,
      categoryId: category.id,
      variants: {
        create: [
          { sku: 'TS-BLK-M-001', color: 'Black', size: 'M' },
          { sku: 'TS-BLK-L-001', color: 'Black', size: 'L' },
          { sku: 'TS-WHT-M-001', color: 'White', size: 'M' },
        ],
      },
    },
    include: { variants: true },
  });

  for (const variant of product.variants) {
    await prisma.warehouseStock.create({
      data: {
        warehouseId: 1,
        variantId: variant.id,
        quantity: 100,
      },
    });
  }

  console.log('✅ Seed completed');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });