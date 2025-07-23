# Stage 1: Build the application
# ใช้ Node.js เวอร์ชั่น 20 เป็น base image สำหรับการ build
FROM node:20-alpine AS builder

# ตั้งค่า working directory ภายใน container
WORKDIR /usr/src/app

# คัดลอก package.json และ package-lock.json (ถ้ามี)
COPY package.json ./

# ติดตั้ง dependencies ทั้งหมด (รวมถึง devDependencies ที่จำเป็นสำหรับการ build)
RUN npm install

# คัดลอกไฟล์ source code ทั้งหมดของ api เข้าไปใน container
COPY . .

# สั่ง build TypeScript เป็น JavaScript (ผลลัพธ์จะอยู่ในโฟลเดอร์ dist/)
RUN npm run build

# Stage 2: Create the production image
# ใช้ Node.js เวอร์ชั่น 20-alpine ที่มีขนาดเล็กสำหรับ production
FROM node:20-alpine

WORKDIR /usr/src/app

# คัดลอก package.json และ package-lock.json
COPY package.json ./

# ติดตั้งเฉพาะ production dependencies เพื่อให้ image มีขนาดเล็ก
RUN npm install --omit=dev

# คัดลอกไฟล์ที่ build แล้วจาก stage 'builder' มายัง production image
COPY --from=builder /usr/src/app/dist ./dist

# กำหนด Port ที่ server ของคุณจะทำงาน (ปกติสำหรับ Node.js คือ 3000 หรือ 8080)
EXPOSE 3000

# คำสั่งที่จะรันเมื่อ container เริ่มทำงาน
CMD ["node", "-r", "dotenv/config", "dist/api/index.js"]
