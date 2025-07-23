import { Hono } from "hono";
import studentRouter from "./student.js"; // เปลี่ยนจาก booksRouter
import { bearerAuth } from "hono/bearer-auth";
import { env } from "hono/adapter";

const apiRouter = new Hono();

apiRouter.get("/", (c) => {
  return c.json({ message: "Student API" });
});

// เพิ่ม auth
apiRouter.use(
  "*",
  bearerAuth({
    verifyToken: async (token, c) => {
      const { API_SECRET } = env<{ API_SECRET: string }>(c);
      return token === API_SECRET;
    },
  })
);

// ใช้ route ใหม่
apiRouter.route("/api/v1/student", studentRouter);

export default apiRouter;
