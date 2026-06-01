const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('🔄 Checking for SUPER_ADMIN roles to migrate before database push...');
  try {
    const affected = await prisma.$executeRawUnsafe(
      "UPDATE User SET role = 'ADMIN' WHERE role = 'SUPER_ADMIN'"
    );
    console.log(`✅ Migrated ${affected} users from SUPER_ADMIN to ADMIN.`);
  } catch (error) {
    console.log('⚠️ Skipping role migration (User table might not exist or role column may already be migrated):', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

main();
