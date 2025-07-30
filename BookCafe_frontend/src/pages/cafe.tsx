import { useState } from "react";
import Layout from "../components/layout";
import useSWR from "swr";
import { CafeMenu, OrderItem } from "../lib/models";
import Loading from "../components/loading";
import { Alert, Button, Container, NumberInput, Textarea, TextInput, ActionIcon, Title } from "@mantine/core";
import { IconAlertTriangleFilled, IconPlus, IconUser, IconUsersGroup, IconShoppingCart, IconTrash } from "@tabler/icons-react";
import { Link } from "react-router-dom";
import { notifications } from "@mantine/notifications";
import axios from "axios";
import cafeBackgroundImage from "../assets/images/bg-cafe-2.jpg"; 


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

  // Logic functions (ไม่มีการเปลี่ยนแปลง)
  const handleAddToCart = (item: CafeMenu) => {
    const existingItem = cart.find((cartItem) => cartItem.menuItemId === item.id);
    if (existingItem) {
      setCart(cart.map((cartItem) =>
        cartItem.menuItemId === item.id ? { ...cartItem, quantity: cartItem.quantity + 1 } : cartItem
      ));
    } else {
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
      notifications.show({ title: 'ผิดพลาด', message: "กรุณาเลือกสินค้าก่อนทำการสั่งซื้อ", color: "red" });
      return;
    }
    setIsProcessing(true);
    try {
      const orderData = {
        customerName: customerName || "Guest",
        items: cart.map(({ name, price, ...rest }) => rest)
      };
      await axios.post("/orders", orderData);
      notifications.show({ title: 'สำเร็จ', message: "สั่งซื้อสำเร็จแล้ว!", color: "teal" });
      setCart([]);
      setCustomerName("");
    } catch (err) {
      notifications.show({ title: 'ผิดพลาด', message: "เกิดข้อผิดพลาดในการสั่งซื้อ", color: "red" });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Layout>

      <section className="relative h-[400px] w-full text-white">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${cafeBackgroundImage})` }}></div>
        <div className="absolute inset-0 bg-gradient-to-br from-green-400/90 via-emerald-500/85 to-teal-600/90"></div>
        <div className="relative z-10 h-full flex flex-col justify-center items-center px-4 text-center">
          <div className="backdrop-blur-sm bg-white/10 rounded-3xl p-8 border border-white/20">
            <h1 className="text-6xl font-light mb-2">เมนูคาเฟ่</h1>
            <h2 className="text-xl font-light text-green-50">เลือกเครื่องดื่มและของว่างที่ท่านต้องการ</h2>
          </div>
        </div>
      </section>
      
      <main className="bg-gray-50 py-12">
        <Container size="xl">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-light text-gray-800 relative">
              เลือกเมนู
              <div className="absolute -bottom-2 left-0 w-20 h-1 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full"></div>
            </h1>
            <Button component={Link} to="/orders" leftSection={<IconUsersGroup />} variant="outline" color="teal">
              สำหรับ Staff
            </Button>
          </div>

          {error && <Alert color="red" title="เกิดข้อผิดพลาด" icon={<IconAlertTriangleFilled />}>{error.message}</Alert>}
          {!menuItems && !error && <Loading />}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

            <div className="lg:col-span-2">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {menuItems?.map((item) => (
                  <div key={item.id} className="bg-white rounded-xl shadow-lg border border-green-100 overflow-hidden
                                              hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 flex flex-col">
                    <img src={menuImages[item.name] || 'https://placehold.co/800x600'} alt={item.name} className="w-full h-56 object-cover" />
                    <div className="p-5 flex flex-col flex-grow">
                      <h2 className="text-xl font-semibold text-gray-800">{item.name}</h2>
                      <p className="text-sm text-gray-500 mt-1 flex-grow">{item.description}</p>
                      <div className="flex justify-between items-center mt-4">
                        <span className="text-2xl font-bold text-teal-600">{parseFloat(item.price).toFixed(2)} ฿</span>
                        <Button onClick={() => handleAddToCart(item)} leftSection={<IconPlus size={16} />} color="teal" variant="light">
                          เพิ่ม
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 🛒 ส่วนตะกร้าสินค้า (ปรับปรุงดีไซน์) */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-lg border border-green-100 p-6 h-fit sticky top-6">
                <Title order={3} className="text-gray-800 mb-6">สรุปรายการสั่งซื้อ</Title>
                <TextInput
                  label="ชื่อลูกค้า"
                  placeholder="สามารถเว้นว่างได้"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.currentTarget.value)}
                  className="mb-6"
                  leftSection={<IconUser size={18} />}
                  radius="md"
                />
                
                {cart.length === 0 ? (
                  <div className="text-center text-gray-400 py-10">
                    <IconShoppingCart size={40} className="mx-auto mb-2" />
                    <p>ยังไม่มีรายการในตะกร้า</p>
                  </div>
                ) : (
                  <>
                    <div className="space-y-4">
                      {cart.map((item) => (
                        <div key={item.menuItemId} className="bg-gray-50/70 p-3 rounded-lg">
                          <div className="flex justify-between items-start">
                            <span className="font-semibold text-gray-700">{item.name}</span>
                            <ActionIcon size="sm" variant="transparent" color="red" onClick={() => handleRemoveFromCart(item.menuItemId)}>
                              <IconTrash size={16} />
                            </ActionIcon>
                          </div>
                          <div className="flex items-center gap-2 mt-2">
                            <NumberInput
                              min={1} value={item.quantity}
                              onChange={(value) => handleUpdateCartItem(item.menuItemId, value)}
                              style={{ width: 70 }} radius="md" size="xs"
                            />
                            <Textarea
                              placeholder="หมายเหตุ..." value={item.notes}
                              onChange={(e) => handleUpdateCartItem(item.menuItemId, item.quantity, e.currentTarget.value)}
                              autosize minRows={1} radius="md" size="xs" className="flex-grow"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="flex justify-between items-center font-bold text-xl mt-6 pt-4 border-t-2 border-dashed">
                      <span className="text-gray-800">รวมทั้งหมด:</span>
                      <span className="text-teal-600">{calculateTotal().toFixed(2)} ฿</span>
                    </div>
                    <Button fullWidth mt="md" onClick={handleSubmitOrder} loading={isProcessing} color="teal" size="lg">
                      ยืนยันการสั่งซื้อ
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>
        </Container>
      </main>
    </Layout>
  );
}