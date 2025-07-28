import { Hono } from "hono";
import drizzle from "../db/drizzle.js";
// แก้ไข: เพิ่ม ordersRelations และ orderItemsRelations เข้ามาใน import
import { orders68, orderItems68, ordersRelations, orderItemsRelations } from "../db/schema.js";
import { z } from "zod";
import { zValidator } from "@hono/zod-validator";
// แก้ไข: เพิ่ม asc และ eq สำหรับการเรียงและ query
import { asc, eq } from "drizzle-orm";

const orderRouter = new Hono();

// --- Endpoint สำหรับ Staff: ดูรายการสั่งซื้อทั้งหมด ---
orderRouter.get("/", async (c) => {
  // ตอนนี้ Query ส่วนนี้จะทำงานได้อย่างถูกต้องแล้ว
  const allOrders = await drizzle.query.orders68.findMany({
    with: {
      orderItems: {
        with: {
          menuItem: {
            columns: {
              name: true,
            },
          },
        },
      },
    },
    // แก้ไข: เปลี่ยนการเรียงลำดับเป็นจากน้อยไปมาก (เก่าไปใหม่) ตามที่คุณต้องการ
    orderBy: [asc(orders68.id)],
  });

  const result = allOrders.map((order) => ({
    ...order,
    orderItems: order.orderItems.map((item) => ({
      menuItemId: item.menuItemId,
      quantity: item.quantity,
      notes: item.notes,
      name: item.menuItem.name,
    })),
  }));

  return c.json(result);
});
orderRouter.get("/:orderId", async (c) => {
  const orderId = parseInt(c.req.param("orderId"));
  if (isNaN(orderId)) {
    return c.json({ message: "Invalid Order ID" }, 400);
  }
  const order = await drizzle.query.orders68.findFirst({
    where: eq(orders68.id, orderId),
    with: {
      orderItems: { with: { menuItem: { columns: { name: true } } } },
    },
  });
  if (!order) {
    return c.json({ message: "Order not found" }, 404);
  }
  return c.json(order);
});

// --- Endpoint สำหรับลูกค้า: สร้างออเดอร์ใหม่ (ไม่มีการแก้ไข) ---
orderRouter.post(
  "/",
  zValidator("json", z.object({
      customerName: z.string().optional(),
      items: z.array(z.object({
          menuItemId: z.number().positive(),
          quantity: z.number().positive(),
          notes: z.string().optional(),
        }))
        .min(1, { message: "Order must contain at least one item" }),
    })
  ),
  async (c) => {
    const { customerName, items } = c.req.valid("json");
    try {
      const createdOrderData = await drizzle.transaction(async (tx) => {
        const [newOrder] = await tx
          .insert(orders68)
          .values({ customerName: customerName })
          .returning();
        const orderItemsData = items.map((item) => ({
          orderId: newOrder.id,
          menuItemId: item.menuItemId,
          quantity: item.quantity,
          notes: item.notes,
        }));
        await tx.insert(orderItems68).values(orderItemsData);
        return newOrder;
      });
      return c.json({ success: true, order: createdOrderData }, 201);
    } catch (error) {
      console.error("Failed to create order:", error);
      return c.json({ success: false, message: "Failed to create order" }, 500);
    }
  }
);

// --- เพิ่ม: Endpoint สำหรับอัปเดตสถานะ ---
const updateStatusSchema = z.object({
  status: z.enum(["completed", "cancelled"]),
});

orderRouter.patch(
  "/:orderId",
  zValidator("json", updateStatusSchema),
  async (c) => {
    const orderId = parseInt(c.req.param("orderId"));
    const { status } = c.req.valid("json");
    if (isNaN(orderId)) {
      return c.json({ message: "Invalid Order ID" }, 400);
    }
    try {
      const [updatedOrder] = await drizzle
        .update(orders68)
        .set({ status: status })
        .where(eq(orders68.id, orderId))
        .returning();

      if (!updatedOrder) {
        return c.json({ message: "Order not found" }, 404);
      }
      // เมื่อสำเร็จ ให้ส่งข้อมูลที่อัปเดตแล้วกลับไป
      return c.json(updatedOrder, 200);
    } catch (error) {
      console.error("Failed to update order status:", error);
      return c.json({ message: "Failed to update status" }, 500);
    }
  }
);

export default orderRouter;