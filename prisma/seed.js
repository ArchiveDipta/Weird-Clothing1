const { PrismaClient, Role } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  // 1. Create ADMIN user safely
  const existingAdmin = await prisma.user.findFirst({
    where: { email: 'admin@store.com' }
  });
  
  if (!existingAdmin) {
    const hashedAdmin = await bcrypt.hash('admin123', 10);
    await prisma.user.create({
      data: { 
        email: 'admin@store.com', 
        password: hashedAdmin, 
        fullName: 'Store Admin', 
        role: Role.ADMIN 
      }
    });
    console.log('👤 Seeded Store Admin user');
  } else {
    console.log('👤 Store Admin user already exists, skipping...');
  }

  // 2. Create Category safely
  let category = await prisma.category.findUnique({
    where: { name: 'T-Shirt' }
  });

  if (!category) {
    category = await prisma.category.create({
      data: { name: 'T-Shirt' }
    });
    console.log('📦 Seeded Category: T-Shirt');
  } else {
    console.log('📦 Category T-Shirt already exists, skipping...');
  }

  // 3. Create Product with direct Variant stocks safely
  const existingProduct = await prisma.product.findFirst({
    where: { name: 'Basic Cotton T-Shirt', categoryId: category.id }
  });

  if (!existingProduct) {
    await prisma.product.create({
      data: {
        name: 'Basic Cotton T-Shirt',
        description: 'Premium cotton t-shirt',
        basePrice: 199000,
        categoryId: category.id,
        imageUrl: '/uploads/products/default-tshirt.png',
        variants: {
          create: [
            { sku: 'TS-BLK-M-001', color: 'Black', size: 'M', stock: 100 },
            { sku: 'TS-BLK-L-001', color: 'Black', size: 'L', stock: 100 },
            { sku: 'TS-WHT-M-001', color: 'White', size: 'M', stock: 100 },
          ]
        }
      }
    });
    console.log('👕 Seeded Product: Basic Cotton T-Shirt with direct variant stocks');
  } else {
    console.log('👕 Product Basic Cotton T-Shirt already exists, skipping...');
  }

  console.log('✅ Seed completed successfully');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });