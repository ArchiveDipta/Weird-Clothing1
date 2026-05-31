const { PrismaClient, Role } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  // Cek apakah sudah pernah di-seed
  const existing = await prisma.user.findFirst({
    where: { email: 'super@admin.com' }
  });
  
  if (existing) {
    console.log('✅ Data already seeded, skipping...');
    return;
  }

  const hashedSuper = await bcrypt.hash('superadmin123', 10);
  const hashedAdmin = await bcrypt.hash('admin123', 10);

  await prisma.user.createMany({
    data: [
      { 
        email: 'super@admin.com', 
        password: hashedSuper, 
        fullName: 'Super Administrator', 
        role: Role.SUPER_ADMIN 
      },
      { 
        email: 'admin@store.com', 
        password: hashedAdmin, 
        fullName: 'Store Admin', 
        role: Role.ADMIN 
      }
    ]
  });

  await prisma.warehouse.create({ 
    data: { name: 'Main Warehouse', location: 'Jakarta' } 
  });

  await prisma.category.create({ 
    data: { name: 'T-Shirt' } 
  });

  const product = await prisma.product.create({
    data: {
      name: 'Basic Cotton T-Shirt',
      description: 'Premium cotton t-shirt',
      basePrice: 199000,
      categoryId: 1,
      variants: {
        create: [
          { sku: 'TS-BLK-M-001', color: 'Black', size: 'M' },
          { sku: 'TS-BLK-L-001', color: 'Black', size: 'L' },
          { sku: 'TS-WHT-M-001', color: 'White', size: 'M' },
        ]
      }
    },
    include: { variants: true }
  });

  for (const variant of product.variants) {
    await prisma.warehouseStock.create({
      data: { 
        warehouseId: 1, 
        variantId: variant.id, 
        quantity: 100 
      }
    });
  }

  console.log('✅ Seed completed successfully');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });