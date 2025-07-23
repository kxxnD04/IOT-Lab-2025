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
import { serve } from "@hono/node-server";
import app from "./routes/api.js";
import * as dotenv from 'dotenv';
dotenv.config();
serve({
  fetch: app.fetch,
  port: 3000,
}, () => {
  console.log("🚀 Server running on http://localhost:3000");
});
