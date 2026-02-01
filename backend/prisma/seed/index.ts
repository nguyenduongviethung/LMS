import { seedUsers } from './seed.users';
import { seedClasses } from './seed.classes';
import { seedUserClasses } from './seed.userClass';
import { seedSessions } from './seed.session';
import { seedContents } from './seed.contents';

async function main() {
  await seedUsers();
  await seedClasses();
  await seedUserClasses();
  await seedSessions();
  await seedContents();
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    process.exit(0);
  });
