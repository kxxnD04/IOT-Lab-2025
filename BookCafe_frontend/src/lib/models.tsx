export interface Book {
  id: number;
  title: string;
  author: string;
  publishedAt: string;
  description?: string; // <-- เพิ่ม
  synopsis?: string;     // <-- เพิ่ม
  category?: string;    // <-- เพิ่ม
}

// Interface สำหรับเมนูแต่ละรายการ
export interface CafeMenu {
  id: number;
  name: string;
  description: string | null;
  price: string; // Drizzle ส่ง Decimal มาเป็น String
}

// Interface สำหรับรายการสินค้าในตะกร้า/ในออเดอร์
export interface OrderItem {
  menuItemId: number;
  quantity: number;
  notes?: string;
  // เพิ่มข้อมูลจากเมนูเข้ามาเพื่อแสดงผลในตะกร้าได้ง่าย
  name?: string;
  price?: string;
}

// Interface สำหรับออเดอร์ทั้งหมด (ที่ Staff จะเห็น)
export interface Order {
  id: number;
  customerName: string | null;
  status: string;
  createdAt: string;
  orderItems: OrderItem[]; // ออเดอร์จะมีรายการสินค้าหลายรายการ
}