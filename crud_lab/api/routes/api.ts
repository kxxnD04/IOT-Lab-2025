import { Hono } from "hono";
import studentRouter from "./student.js";
import bookRouter from "./book.js";
import cafeRouter from "./cafe.js";
import orderRouter from "./order.js";
import { bearerAuth } from "hono/bearer-auth";
import { env } from "hono/adapter";

const apiRouter = new Hono();

// Route สำหรับ Landing Page
apiRouter.get("/", (c) => {

  const landingPageHtml = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Karn's Student API</title>
        <style>
            @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;600;700&display=swap');

            body {
                margin: 0;
                font-family: 'Poppins', sans-serif;
                background: linear-gradient(135deg, #6dd5ed, #2193b0);
                color: #fff;
                display: flex;
                justify-content: center;
                align-items: center;
                height: 100vh;
                text-align: center;
                overflow: hidden;
            }

            .container {
                position: relative;
                background: rgba(255, 255, 255, 0.1);
                padding: 40px 50px;
                border-radius: 20px;
                box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.2);
                backdrop-filter: blur(10px);
                -webkit-backdrop-filter: blur(10px);
                border: 1px solid rgba(255, 255, 255, 0.18);
                max-width: 600px;
                transform: scale(0.95);
                animation: fadeInScale 0.8s ease-out forwards;
            }
            
            @keyframes fadeInScale {
                to {
                    opacity: 1;
                    transform: scale(1);
                }
            }

            .profile-pic {
                width: 120px;
                height: 120px;
                border-radius: 50%;
                border: 4px solid #fff;
                margin-bottom: 20px;
                object-fit: cover;
                box-shadow: 0 4px 15px rgba(0,0,0,0.2);
            }

            h1 {
                font-size: 2.5rem;
                margin: 0;
                font-weight: 700;
                text-shadow: 2px 2px 4px rgba(0,0,0,0.2);
            }

            p {
                font-size: 1.1rem;
                margin: 15px 0 25px;
                line-height: 1.6;
                font-weight: 300;
            }

            .api-info {
                background: rgba(0, 0, 0, 0.2);
                padding: 15px;
                border-radius: 10px;
                font-family: monospace;
                font-size: 1.1rem;
                text-align: left;
                word-wrap: break-word;
            }
            
            .api-info strong {
                color: #a7d8e8;
            }

            .footer {
                margin-top: 30px;
                font-size: 0.9rem;
                opacity: 0.8;
            }

            .bubbles {
                position: absolute;
                width: 100%;
                height: 100%;
                z-index: -1;
                overflow: hidden;
                top: 0;
                left: 0;
            }
            .bubble {
                position: absolute;
                bottom: -150px;
                width: 40px;
                height: 40px;
                background: rgba(255, 255, 255, 0.15);
                border-radius: 50%;
                opacity: 0.5;
                animation: rise 10s infinite ease-in;
            }
            .bubble:nth-child(1){ left: 10%; animation-duration: 8s; }
            .bubble:nth-child(2){ left: 20%; animation-duration: 5s; animation-delay: 1s; }
            .bubble:nth-child(3){ left: 35%; animation-duration: 7s; }
            .bubble:nth-child(4){ left: 50%; animation-duration: 11s; animation-delay: 2s; }
            .bubble:nth-child(5){ left: 65%; animation-duration: 6s; }
            .bubble:nth-child(6){ left: 80%; animation-duration: 9s; animation-delay: 1.5s; }

            @keyframes rise {
                0% {
                    transform: translateY(0) rotate(0deg);
                }
                100% {
                    transform: translateY(-1080px) rotate(720deg);
                    opacity: 0;
                }
            }
        </style>
    </head>
    <body>
        <div class="bubbles">
            <div class="bubble"></div>
            <div class="bubble"></div>
            <div class="bubble"></div>
            <div class="bubble"></div>
            <div class="bubble"></div>
            <div class="bubble"></div>
        </div>
        <div class="container">
            <img src="https://cataas.com/cat/cute" alt="Profile Picture" class="profile-pic">
            
            <h1>Karn Suddee 66070014</h1>
            <p>
                Hello! This is my CRUD Student API.
            </p>
            
            <div class="api-info">
                <strong>GUIDE:</strong> If you have an API secret key, you can try various REST API methods like GET, POST, PATCH, or DELETE using a tool like Postman with path /students.
            </div>
            
            <p class="footer">
                Made with Hono, Node.js, and deployed on AWS EC2.
            </p>
        </div>
    </body>
    </html>
  `;
  return c.html(landingPageHtml);
});


apiRouter.use(
  "*",
  bearerAuth({
    verifyToken: async (token, c) => {
      const { API_SECRET } = env<{ API_SECRET: string }>(c);
      return token === API_SECRET;
    },
  })
);

apiRouter.route("/students", studentRouter);
apiRouter.route("/books", bookRouter);
apiRouter.route("/cafe", cafeRouter);
apiRouter.route("/orders", orderRouter);
export default apiRouter;
