import useSWR from "swr";
import { Order } from "../lib/models";
import Layout from "../components/layout";
import { Accordion, Alert, Badge, Button, Title, useMantineTheme } from "@mantine/core";
import Loading from "../components/loading";
import { Link } from "react-router-dom";
import dayjs from "dayjs";
import 'dayjs/locale/th'; 
import { IconAlertTriangleFilled, IconClipboardText, IconCheck, IconX } from "@tabler/icons-react";
import cafeBackgroundImage from "../assets/images/bg-cafe-1.jpg"; 

dayjs.locale('th');

export default function OrdersPage() {
  const { data: orders, error } = useSWR<Order[]>("/orders");
  const theme = useMantineTheme();


  const statusColors: { [key: string]: string } = {
    pending: "yellow",
    completed: "teal", 
    cancelled: "red",
  };

  return (
    <Layout>

      <section className="relative h-[400px] w-full text-white">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${cafeBackgroundImage})` }}></div>
        <div className="absolute inset-0 bg-gradient-to-br from-green-400/90 via-emerald-500/85 to-teal-600/90"></div>
        <div className="relative z-10 h-full flex flex-col justify-center items-center px-4 text-center">
          <div className="backdrop-blur-sm bg-white/10 rounded-3xl p-8 border border-white/20">
            <h1 className="text-5xl font-light mb-2">รายการสั่งซื้อ</h1>
            <h2 className="text-lg font-light text-green-50">สำหรับเจ้าหน้าที่</h2>
          </div>
        </div>
      </section>

      <main className="bg-gray-50 py-12">
        <div className="container mx-auto px-6">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-light text-gray-800 relative">
              คำสั่งซื้อทั้งหมด
              <div className="absolute -bottom-2 left-0 w-20 h-1 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full"></div>
            </h1>
            <Button component={Link} to="/cafe" color="teal" variant="outline">
              กลับไปหน้าเมนู
            </Button>
          </div>
          
          {error && (
            <Alert color="red" title="เกิดข้อผิดพลาด" icon={<IconAlertTriangleFilled />}>
              {error.message}
            </Alert>
          )}

          {!orders && !error && <Loading />}


          {orders && orders.length === 0 && (
            <div className="flex flex-col items-center justify-center text-center text-teal-700 bg-white border border-teal-100 rounded-xl p-12 shadow-sm">
              <IconClipboardText size={52} className="mb-4 text-teal-400" />
              <Title order={4} className="text-teal-800 font-semibold">ยังไม่มีรายการสั่งซื้อ</Title>
              <p className="text-teal-600">เมื่อมีลูกค้าสั่งเครื่องดื่ม รายการจะปรากฏที่นี่</p>
            </div>
          )}


          <Accordion variant="separated" radius="lg" classNames={{ item: "bg-white border-green-100 shadow-md transition-all hover:shadow-lg" }}>
            {orders?.map((order) => (
              <Accordion.Item key={order.id} value={`order-${order.id}`}>
                <Accordion.Control>
                  <div className="flex justify-between items-center w-full">
                    <div className="flex items-center gap-4">
                      <span className="font-bold text-lg" style={{ color: theme.colors.teal[7] }}>
                        Order #{order.id}
                      </span>
                      <span className="text-gray-600">ลูกค้า: {order.customerName || "Guest"}</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-sm text-gray-500">{dayjs(order.createdAt).format('D MMMM YYYY, HH:mm')}</span>
                      <Badge color={statusColors[order.status] || 'gray'} size="lg" variant="light">
                        {order.status}
                      </Badge>
                    </div>
                  </div>
                </Accordion.Control>
                <Accordion.Panel className="bg-gray-50/50">
                  <p className="font-semibold text-gray-700 mb-3">รายการ:</p>
                  <ul className="list-disc pl-6 space-y-2">
                    {order.orderItems.map((item) => (
                      <li key={`${order.id}-${item.menuItemId}`}>
                        <span className="font-medium text-gray-800">{item.name}</span> x <span className="font-bold text-teal-600">{item.quantity}</span>
                        {item.notes && <p className="text-xs text-gray-500 italic ml-4"> - หมายเหตุ: "{item.notes}"</p>}
                      </li>
                    ))}
                  </ul>
                  
                  {/* ปุ่มสำหรับอัปเดตสถานะ  */}
                  <div className="mt-6 pt-4 border-t flex gap-2 justify-end">
                    <Button 
                      size="xs" 
                      color="teal" 
                      variant="filled"
                      leftSection={<IconCheck size={16}/>}
                      disabled={order.status === 'completed' || order.status === 'cancelled'}
                    >
                      ทำเสร็จแล้ว
                    </Button>
                    <Button 
                      size="xs" 
                      color="red" 
                      variant="light"
                      leftSection={<IconX size={16} />}
                      disabled={order.status === 'completed' || order.status === 'cancelled'}
                    >
                      ยกเลิกออเดอร์
                    </Button>
                  </div> 
                </Accordion.Panel>
              </Accordion.Item>
            ))}
          </Accordion>
        </div>
      </main>
    </Layout>
  );
}