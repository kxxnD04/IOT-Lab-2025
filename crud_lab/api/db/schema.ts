import * as t from "drizzle-orm/pg-core";

export const student68 = t.pgTable("student68", {
  id: t.bigserial({ mode: "number" }).primaryKey(), // primary key

  firstName: t.varchar({ length: 255 }).notNull(),     // ชื่อ
  lastName: t.varchar({ length: 255 }).notNull(),      // นามสกุล
  studentId: t.varchar({ length: 20 }).unique().notNull(), // รหัสประจำตัว

  birthDate: t.date({ mode: "date" }).notNull(),                       // วันเกิด

  gender: t.varchar({ length: 10 }).notNull(),         // เพศ เช่น 'ชาย'/'หญิง'
});

export const books68 = t.pgTable("books68", {
    id: t.bigserial({ mode: "number" }).primaryKey(),
    title: t.varchar({ length: 255 }).notNull(),
    author: t.varchar({ length: 255 }).notNull(),
    publishedAt: t.date({ mode: "date" }).notNull(),
    description: t.text("description"),
    isbn: t.varchar({ length: 20 }).unique(),
    category: t.varchar({ length: 100 })
});

export const cafe68 = t.pgTable("cafe68", {
    id: t.bigserial({ mode: "number" }).primaryKey(),
    name: t.varchar({ length: 255 }).notNull(),
    description: t.text("description"),
    price: t.decimal("price", { precision: 10, scale: 2 }).notNull()
});

// ตารางออเดอร์หลัก ("ใบเสร็จ")
export const orders68 = t.pgTable("orders68", {
    id: t.bigserial({ mode: "number" }).primaryKey(),
    // อาจจะเก็บชื่อลูกค้า หรือถ้ามีระบบสมาชิกก็จะเป็น userId
    customerName: t.varchar({ length: 255 }), 
    status: t.varchar({ length: 50 }).default('pending').notNull(), // pending, completed, etc.
    createdAt: t.timestamp("created_at").defaultNow().notNull(),
});

// ตารางรายการสินค้าในออเดอร์ ("รายการในใบเสร็จ")
export const orderItems68 = t.pgTable("order_items68", {
    id: t.bigserial({ mode: "number" }).primaryKey(),
    
    // คีย์นอก: บอกว่ารายการนี้เป็นของออเดอร์ใบไหน
    orderId: t.bigint("order_id", { mode: "number" }).notNull().references(() => orders68.id),
    // คีย์นอก: บอกว่ารายการนี้คือเมนูอะไร
    menuItemId: t.bigint("menu_item_id", { mode: "number" }).notNull().references(() => cafe68.id),
    quantity: t.integer("quantity").notNull(),
    notes: t.text("notes")
});
