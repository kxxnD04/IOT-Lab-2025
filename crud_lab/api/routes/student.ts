import { Hono } from "hono";
import drizzle from "../db/drizzle.js";
import { student68 } from "../db/schema.js";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { zValidator } from "@hono/zod-validator";
import dayjs from "dayjs";

const studentRouter = new Hono();

// GET /student - ดูรายชื่อทั้งหมด
studentRouter.get("/", async (c) => {
  const allStudents = await drizzle.select().from(student68);
  return c.json(allStudents);
});

// GET /student/:id - ดูข้อมูลรายบุคคล
studentRouter.get("/:id", async (c) => {
  const id = Number(c.req.param("id"));
  const student = await drizzle.query.student68.findFirst({
    where: eq(student68.id, id),
  });

  if (!student) {
    return c.json({ error: "Student not found" }, 404);
  }

  return c.json(student);
});

// POST /student - เพิ่มนักเรียนใหม่
studentRouter.post(
  "/",
  zValidator(
    "json",
    z.object({
      firstName: z.string().min(1),
      lastName: z.string().min(1),
      studentId: z.string().min(1),
      birthDate: z
        .string()
        .refine((d) => dayjs(d, "YYYY-MM-DD", true).isValid(), {
          message: "Invalid date format (expected YYYY-MM-DD)",
        })
        .transform((d) => dayjs(d).toDate()),
      // gender: z.enum(["ชาย", "หญิง", "อื่นๆ"]),
      gender: z.string().min(1),
    })
  ),
  async (c) => {
    const rawBody = await c.req.json();
    console.log("RAW BODY", rawBody); // ✅ ดูว่า body ได้ถูกส่งมาจริงไหม
    const data = c.req.valid("json");
    const inserted = await drizzle.insert(student68).values(data).returning();
    return c.json({ success: true, student: inserted[0] }, 201);
  }
);

// PATCH /student/:id - แก้ไขข้อมูล
studentRouter.patch(
  "/:id",
  zValidator(
    "json",
    z
      .object({
        firstName: z.string().optional(),
        lastName: z.string().optional(),
        studentId: z.string().optional(),
        birthDate: z
          .string()
          .optional()
          .transform((d) => (d ? dayjs(d).toDate() : undefined)),
        gender: z.string().min(1),
      })
      .refine((data) => Object.keys(data).length > 0, {
        message: "At least one field must be provided",
      })
  ),
  async (c) => {
    const id = Number(c.req.param("id"));
    const data = c.req.valid("json");

    const updated = await drizzle.update(student68).set(data).where(eq(student68.id, id)).returning();

    if (updated.length === 0) {
      return c.json({ error: "Student not found" }, 404);
    }

    return c.json({ success: true, student: updated[0] });
  }
);

// DELETE /student/:id - ลบนักเรียน
studentRouter.delete("/:id", async (c) => {
  const id = Number(c.req.param("id"));
  const deleted = await drizzle.delete(student68).where(eq(student68.id, id)).returning();
  if (deleted.length === 0) {
    return c.json({ error: "Student not found" }, 404);
  }
  return c.json({ success: true, student: deleted[0] });
});

export default studentRouter;
