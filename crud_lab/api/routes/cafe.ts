import { Hono } from "hono";
import drizzle from "../db/drizzle.js";
import { cafe68 } from "../db/schema.js";

const cafeRouter = new Hono();

// GET /cafe - สำหรับให้หน้า Frontend ดึงเมนูทั้งหมดไปแสดง
cafeRouter.get("/", async (c) => {
  const allMenuItems = await drizzle.select().from(cafe68);
  return c.json(allMenuItems);
});

// CRUD อื่นๆ ยังไม่ต้องสร้างตอนนี้

export default cafeRouter;
