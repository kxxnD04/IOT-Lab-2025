import drizzle from "./drizzle.js";
import { cafe68 } from "./schema.js";
import * as schema from "./schema.js";
import * as dotenv from 'dotenv';
dotenv.config();

const main = async () => {
  try {
    console.log("Seeding database...");

    // 1. ล้างข้อมูลเก่าในตาราง cafe68 (เพื่อให้รันซ้ำได้)
    console.log("Clearing old menu data...");
    await drizzle.delete(schema.cafe68);
    
    // 2. ข้อมูลเมนู 10 รายการที่เราจะเพิ่มเข้าไป
    const menuData = [
      { name: 'Espresso', description: 'A concentrated coffee shot, rich and bold.', price: '75.00' },
      { name: 'Americano', description: 'Espresso shots topped with hot water, creating a light layer of crema.', price: '80.00' },
      { name: 'Latte', description: 'A classic coffee with steamed milk and a light layer of foam.', price: '95.00' },
      { name: 'Cappuccino', description: 'A perfect balance of espresso, steamed milk, and a thick layer of foam.', price: '95.00' },
      { name: 'Mocha', description: 'A chocolate-flavored latte, a perfect treat for coffee and chocolate lovers.', price: '105.00' },
      { name: 'Matcha Latte', description: 'Premium matcha green tea with steamed milk.', price: '110.00' },
      { name: 'Thai Iced Tea', description: 'A classic Thai sweet tea with milk, served over ice.', price: '85.00' },
      { name: 'Croissant', description: 'A buttery, flaky, and delicious French pastry.', price: '70.00' },
      { name: 'Blueberry Cheesecake', description: 'Creamy cheesecake with a sweet and tangy blueberry topping.', price: '120.00' },
      { name: 'Dark Chocolate Brownie', description: 'A rich and fudgy brownie made with dark chocolate.', price: '90.00' },
    ];

    // 3. เพิ่มข้อมูลใหม่ลงในฐานข้อมูล
    console.log("Inserting new menu data...");
    await drizzle.insert(cafe68).values(menuData);

    console.log("Database seeded successfully! ✅");
    process.exit(0);

  } catch (error) {
    console.error("Error during database seeding:", error);
    process.exit(1);
  }
};

main();