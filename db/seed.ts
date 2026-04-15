// db/seed.ts
import 'dotenv/config';
import { db } from './client';
import { categories } from './schema';

async function seed() {
  await db
    .insert(categories)
    .values([{ name: 'Men' }, { name: 'Women' }])
    .onConflictDoNothing();

  console.log('✅ Categories seeded!');
  process.exit(0);
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
