import * as t from "drizzle-orm/pg-core";

export const student68 = t.pgTable("student68", {
  id: t.bigserial({ mode: "number" }).primaryKey(), // primary key

  firstName: t.varchar({ length: 255 }).notNull(),     // ชื่อ
  lastName: t.varchar({ length: 255 }).notNull(),      // นามสกุล
  studentId: t.varchar({ length: 20 }).unique().notNull(), // รหัสประจำตัว

  birthDate: t.date().notNull(),                       // วันเกิด

  gender: t.varchar({ length: 10 }).notNull(),         // เพศ เช่น 'ชาย'/'หญิง'
});
