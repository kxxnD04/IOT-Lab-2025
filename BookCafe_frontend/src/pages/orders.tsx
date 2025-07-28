import useSWR from "swr";
import { Order } from "../lib/models";
import Layout from "../components/layout";
import { Accordion, Alert, Badge, Button, Container, Title, useMantineTheme } from "@mantine/core";
import Loading from "../components/loading";
import { Link } from "react-router-dom";
import dayjs from "dayjs";
import 'dayjs/locale/th'; // import ภาษาไทย
import { IconAlertTriangleFilled, IconClipboardText } from "@tabler/icons-react";

// ตั้งค่าภาษาเริ่มต้น
dayjs.locale('th');

export default function OrdersPage() {
  const { data: orders, error } = useSWR<Order[]>("/api/orders");
  const theme = useMantineTheme();

  // กำหนดสีสำหรับสถานะต่างๆ
  const statusColors: { [key: string]: string } = {
    pending: "yellow",
    completed: "green",
    cancelled: "red",
  };

  return (
    <Layout>
      <Container className="py-8">
        <div className="flex justify-between items-center mb-6">
          <Title order={2}>รายการสั่งซื้อ (สำหรับ Staff)</Title>
          <Button component={Link} to="/cafe" variant="outline">กลับไปหน้าเมนู</Button>
        </div>
        
        {error && (
          <Alert color="red" title="เกิดข้อผิดพลาด" icon={<IconAlertTriangleFilled />}>
            {error.message}
          </Alert>
        )}

        {!orders && !error && <Loading />}

        {orders && orders.length === 0 && (
          <div className="flex flex-col items-center justify-center text-center text-gray-500 bg-gray-50 rounded-lg p-8">
            <IconClipboardText size={48} className="mb-4" />
            <Title order={4}>ยังไม่มีรายการสั่งซื้อ</Title>
            <p>เมื่อมีลูกค้าสั่งเครื่องดื่ม รายการจะปรากฏที่นี่</p>
          </div>
        )}

        <Accordion variant="separated">
          {orders?.map((order) => (
            <Accordion.Item key={order.id} value={`order-${order.id}`}>
              <Accordion.Control>
                <div className="flex justify-between items-center w-full">
                  <div className="flex items-center gap-4">
                    <span className="font-semibold text-lg" style={{ color: theme.colors.orange[6] }}>
                      Order #{order.id}
                    </span>
                    <span>ลูกค้า: {order.customerName || "Guest"}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span>{dayjs(order.createdAt).format('D MMMM YYYY, เวลา HH:mm')}</span>
                    <Badge color={statusColors[order.status] || 'gray'} className="ml-4">{order.status}</Badge>
                  </div>
                </div>
              </Accordion.Control>
              <Accordion.Panel>
                <p className="font-semibold mb-2">รายการ:</p>
                <ul className="list-disc pl-5 space-y-2">
                  {order.orderItems.map((item) => (
                    <li key={`${order.id}-${item.menuItemId}`}>
                      <span className="font-medium">{item.name}</span> x <span className="font-bold">{item.quantity}</span>
                      {item.notes && <p className="text-sm text-gray-500 italic ml-4"> - หมายเหตุ: "{item.notes}"</p>}
                    </li>
                  ))}
                </ul>
                
                {/* TODO: ในอนาคตสามารถเพิ่มปุ่มสำหรับอัปเดตสถานะได้ที่นี่ */}
                {/* 
                <div className="mt-4 flex gap-2">
                  <Button size="xs" color="green" disabled={order.status === 'completed'}>ทำเสร็จแล้ว</Button>
                  <Button size="xs" color="red" disabled={order.status === 'completed' || order.status === 'cancelled'}>ยกเลิกออเดอร์</Button>
                </div> 
                */}
              </Accordion.Panel>
            </Accordion.Item>
          ))}
        </Accordion>
      </Container>
    </Layout>
  );
}