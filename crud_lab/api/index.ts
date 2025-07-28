// import { Hono } from "hono";
// import { cors } from "hono/cors";
// import apiRouter from "./routes/api.js";
// import { handle } from "hono/vercel";

// const app = new Hono().basePath("/api");

// app.use(
//   "*",
//   cors({
//     origin: "http://localhost:5173",
//     allowHeaders: ["Content-Type"],
//     allowMethods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
//   })
// );

// app.route("/v1", apiRouter);

// export const config = {
//   runtime: "edge",
// };

// export default handle(app);
// server.ts
import "dotenv/config";
import { Hono } from 'hono';
import { serve } from '@hono/node-server';
import { cors } from 'hono/cors'; // <--- แก้ไข import ให้เป็นแบบนี้

import apiRouter from './routes/api.js';

const app = new Hono();

app.use('*', cors({
  origin: [
    'http://localhost:5173',
  ],
  allowHeaders: ['Authorization', 'Content-Type'],
  allowMethods: ['POST', 'GET', 'PATCH', 'DELETE', 'OPTIONS'],
}));

// โค้ดที่เหลือของคุณ
app.route("/", apiRouter);

const port = 3000;
console.log("🚀 Server running on http://localhost:3000");

serve({
  fetch: app.fetch,
  port
});
