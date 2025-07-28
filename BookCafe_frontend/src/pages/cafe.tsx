import { useState } from "react";
import Layout from "../components/layout";
import useSWR from "swr";
import { CafeMenu, OrderItem } from "../lib/models";
import Loading from "../components/loading";
import { Alert, Button, Container, NumberInput, Textarea, TextInput } from "@mantine/core";
import { IconAlertTriangleFilled, IconPlus, IconUser, IconUsersGroup } from "@tabler/icons-react";
import { Link } from "react-router-dom";
import { notifications } from "@mantine/notifications";
import axios from "axios";

// Map รูปภาพสำหรับเมนูแต่ละรายการ
const menuImages: { [key: string]: string } = {
  'Espresso': 'https://images.unsplash.com/photo-1510707577719-ae7c14805e3a?w=800&h=600&fit=crop',
  'Americano': 'https://images.unsplash.com/photo-1497636577773-f1231844b336?w=800&h=600&fit=crop',
  'Latte': 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=800&h=600&fit=crop',
  'Cappuccino': 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=800&h=600&fit=crop',
  'Mocha': 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop',
  'Matcha Latte': 'https://images.unsplash.com/photo-1575487426366-079595af2247?w=800&h=600&fit=crop',
  'Thai Iced Tea': 'https://images.unsplash.com/photo-1571934811356-5cc061b6821f?w=800&h=600&fit=crop',
  'Croissant': 'https://images.unsplash.com/photo-1549903072-7e6e0bedb7fb?w=800&h=600&fit=crop',
  'Blueberry Cheesecake': 'https://images.unsplash.com/photo-1567306226416-28f0efdc88ce?w=800&h=600&fit=crop',
  'Dark Chocolate Brownie': 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=800&h=600&fit=crop'
};

export default function CafePage() {
  const { data: menuItems, error } = useSWR<CafeMenu[]>("/cafe");
  const [cart, setCart] = useState<OrderItem[]>([]);
  const [customerName, setCustomerName] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const handleAddToCart = (item: CafeMenu) => {
    const existingItem = cart.find((cartItem) => cartItem.menuItemId === item.id);
    if (existingItem) {
      // เพิ่มจำนวนถ้ามีอยู่แล้ว
      setCart(cart.map((cartItem) =>
        cartItem.menuItemId === item.id ? { ...cartItem, quantity: cartItem.quantity + 1 } : cartItem
      ));
    } else {
      // เพิ่มรายการใหม่
      setCart([...cart, { menuItemId: item.id, name: item.name, price: item.price, quantity: 1, notes: "" }]);
    }
  };

  const handleUpdateCartItem = (itemId: number, newQuantity: number | string, newNotes?: string) => {
    setCart(cart.map((item) =>
      item.menuItemId === itemId
        ? { ...item, quantity: typeof newQuantity === 'string' ? parseInt(newQuantity) || 1 : newQuantity, notes: newNotes !== undefined ? newNotes : item.notes }
        : item
    ));
  };

  const handleRemoveFromCart = (itemId: number) => {
    setCart(cart.filter((item) => item.menuItemId !== itemId));
  };
  
  const calculateTotal = () => {
    return cart.reduce((total, item) => total + (parseFloat(item.price || "0") * item.quantity), 0);
  };

  const handleSubmitOrder = async () => {
    if (cart.length === 0) {
      notifications.show({ message: "กรุณาเลือกสินค้าก่อนทำการสั่งซื้อ", color: "red" });
      return;
    }
    setIsProcessing(true);
    try {
      // ส่งเฉพาะข้อมูลที่ Backend ต้องการ
      const orderData = {
        customerName: customerName || "Guest",
        items: cart.map(({ name, price, ...rest }) => rest)
      };
      await axios.post("/orders", orderData);
      notifications.show({ message: "สั่งซื้อสำเร็จ!", color: "green" });
      setCart([]);
      setCustomerName("");
    } catch (err) {
      notifications.show({ message: "เกิดข้อผิดพลาดในการสั่งซื้อ", color: "red" });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Layout>
      <Container className="mt-4">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">เมนูเครื่องดื่มและของว่าง</h1>
          <Button component={Link} to="/orders" leftSection={<IconUsersGroup />} variant="outline">
            สำหรับ Staff
          </Button>
        </div>

        {error && <Alert color="red" title="เกิดข้อผิดพลาด" icon={<IconAlertTriangleFilled />}>{error.message}</Alert>}
        {!menuItems && !error && <Loading />}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* ส่วนแสดงเมนู */}
          <div className="md:col-span-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {menuItems?.map((item) => (
                <div key={item.id} className="border rounded-lg p-4 flex flex-col">
                  <img src={menuImages[item.name] || 'https://placehold.co/600x400'} alt={item.name} className="w-full h-48 object-cover rounded-md mb-4" />
                  <div className="flex-grow">
                    <h2 className="text-lg font-semibold">{item.name}</h2>
                    <p className="text-sm text-neutral-500">{item.description}</p>
                  </div>
                  <div className="flex justify-between items-center mt-4">
                    <span className="text-lg font-semibold">{parseFloat(item.price).toFixed(2)} ฿</span>
                    <Button onClick={() => handleAddToCart(item)} leftSection={<IconPlus size={16} />} size="xs">
                      เพิ่ม
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ส่วนตะกร้าสินค้า */}
          <div className="border rounded-lg p-4 h-fit sticky top-4">
            <h2 className="text-xl font-semibold mb-4">รายการสั่งซื้อ</h2>
            <TextInput
              label="ชื่อลูกค้า"
              placeholder="สามารถเว้นว่างได้"
              value={customerName}
              onChange={(e) => setCustomerName(e.currentTarget.value)}
              className="mb-4"
              leftSection={<IconUser size={16} />}
            />
            {cart.length === 0 ? (
              <p className="text-neutral-500">ยังไม่มีรายการในตะกร้า</p>
            ) : (
              <div className="space-y-4">
                {cart.map((item) => (
                  <div key={item.menuItemId} className="border-b pb-2">
                    <div className="flex justify-between items-start">
                      <span className="font-semibold">{item.name}</span>
                      <Button size="xs" variant="transparent" color="red" onClick={() => handleRemoveFromCart(item.menuItemId)}>X</Button>
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      <NumberInput
                        min={1}
                        value={item.quantity}
                        onChange={(value) => handleUpdateCartItem(item.menuItemId, value)}
                        style={{ width: 70 }}
                        size="xs"
                      />
                       <Textarea
                        placeholder="หมายเหตุเพิ่มเติม..."
                        value={item.notes}
                        onChange={(e) => handleUpdateCartItem(item.menuItemId, item.quantity, e.currentTarget.value)}
                        autosize
                        minRows={1}
                        size="xs"
                        className="flex-grow"
                      />
                    </div>
                  </div>
                ))}
                <div className="flex justify-between font-bold text-lg mt-4 pt-4 border-t">
                  <span>รวมทั้งหมด:</span>
                  <span>{calculateTotal().toFixed(2)} ฿</span>
                </div>
                <Button fullWidth mt="md" onClick={handleSubmitOrder} loading={isProcessing}>
                  ยืนยันการสั่งซื้อ
                </Button>
              </div>
            )}
          </div>
        </div>
      </Container>
    </Layout>
  );
}