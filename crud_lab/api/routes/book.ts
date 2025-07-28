import { Hono } from "hono";
import drizzle from "../db/drizzle.js";
import { books68 } from "../db/schema.js";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { zValidator } from "@hono/zod-validator";
import dayjs from "dayjs";

const bookRouter = new Hono();

// GET /book - ดูรายชื่อหนังสือทั้งหมด
bookRouter.get("/", async (c) => {
  const allBooks = await drizzle.select().from(books68);
  return c.json(allBooks);
});

// GET /book/:id - ดูข้อมูลหนังสือรายเล่ม
bookRouter.get("/:id", async (c) => {
  const id = Number(c.req.param("id"));
  const book = await drizzle.query.books68.findFirst({
    where: eq(books68.id, id),
  });

  if (!book) {
    return c.json({ error: "Book not found" }, 404);
  }

  return c.json(book);
});

// POST /book - เพิ่มหนังสือใหม่
bookRouter.post(
  "/",
  zValidator(
    "json",
    z.object({
      title: z.string().min(1),
      author: z.string().min(1),
      publishedAt: z.string().refine((d) => dayjs(d, "YYYY-MM-DD", true).isValid(), {
        message: "Invalid date format (expected YYYY-MM-DD)",
      }).transform((d) => dayjs(d).toDate()),
      description: z.string().optional(),
      isbn: z.string().optional(),
      category: z.string().optional(),
    })
  ),
  async (c) => {
    const data = c.req.valid("json");
    console.log("RAW BODY", data);
    const inserted = await drizzle.insert(books68).values(data).returning();
    return c.json({ success: true, book: inserted[0] }, 201);
  }
);

// PATCH /book/:id - แก้ไขข้อมูลหนังสือ
bookRouter.patch(
  "/:id",
  zValidator(
    "json",
    z.object({
      title: z.string().optional(),
      author: z.string().optional(),
      publishedAt: z.string().optional().transform((d) => (d ? dayjs(d).toDate() : undefined)),
      description: z.string().optional(),
      isbn: z.string().optional(),
      category: z.string().optional(),
    }).refine((data) => Object.keys(data).length > 0, {
      message: "At least one field must be provided for update",
    })
  ),
  async (c) => {
    const id = Number(c.req.param("id"));
    const data = c.req.valid("json");
    const updated = await drizzle.update(books68).set(data).where(eq(books68.id, id)).returning();

    if (updated.length === 0) {
      return c.json({ error: "Book not found" }, 404);
    }

    return c.json({ success: true, book: updated[0] });
  }
);

// DELETE /book/:id - ลบหนังสือ
bookRouter.delete("/:id", async (c) => {
  const id = Number(c.req.param("id"));
  const deleted = await drizzle.delete(books68).where(eq(books68.id, id)).returning();
  if (deleted.length === 0) {
    return c.json({ error: "Book not found" }, 404);
  }
  return c.json({ success: true, book: deleted[0] });
});

export default bookRouter;
