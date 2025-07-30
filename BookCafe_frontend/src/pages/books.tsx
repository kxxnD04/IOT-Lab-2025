import Layout from "../components/layout";
import cafeBackgroundImage from "../assets/images/bg-cafe-2.jpg";
import useSWR from "swr";
import { Book } from "../lib/models";
import Loading from "../components/loading";
import { Alert, Button, Rating } from "@mantine/core";
import { IconAlertTriangleFilled, IconPlus } from "@tabler/icons-react";
import { Link } from "react-router-dom";

// URLs รูปภาพหนังสือ (เหมือนเดิม)
const bookImageUrls = [
  "https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=1887&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1512820790803-83ca734da794?q=80&w=1798&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1589998059171-988d887df646?q=80&w=1770&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1532012197267-da84d127e765?q=80&w=1887&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1495446815901-a7297e633e8d?q=80&w=1770&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1516979187457-637abb4f9353?q=80&w=1770&auto=format&fit=crop",
];

export default function BooksPage() {
  const { data: books, error } = useSWR<Book[]>("/books");

  return (
    <>
      <Layout>
        {/* Hero Section with modern green theme */}
        <section className="relative h-[500px] w-full text-white">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: `url(${cafeBackgroundImage})`,
            }}
          ></div>
          <div className="absolute inset-0 bg-gradient-to-br from-green-400/90 via-emerald-500/85 to-teal-600/90"></div>
          
          <div className="relative z-10 h-full flex flex-col justify-center items-center px-4 text-center">
             <div className="backdrop-blur-sm bg-white/10 rounded-3xl p-8 border border-white/20">
                <h1 className="text-6xl font-light mb-2">หนังสือ</h1>
                <h2 className="text-xl font-light text-green-50">ค้นหาและจัดการหนังสือในระบบ</h2>
             </div>
          </div>
        </section>

        {/* Books Listing Section */}
        <section className="container mx-auto py-12 px-6 bg-gray-50">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-light text-gray-800 relative">
              รายการหนังสือ
              <div className="absolute -bottom-2 left-0 w-20 h-1 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full"></div>
            </h1>
            
            {/* ❗️ FIX 1: แก้ไขปุ่มให้ใช้ prop 'color' ของ Mantine */}
            <Button
              component={Link}
              to="/books/create"
              leftSection={<IconPlus size={20} />}
              color="green" // ใช้ prop นี้เพื่อกำหนดสีหลักของปุ่ม
              size="sm" // ปรับขนาดให้เหมาะสม
              className="shadow-md hover:shadow-lg transition-all duration-300"
            >
              เพิ่มหนังสือ
            </Button>
          </div>

          {!books && !error && <Loading />}
          {error && (
            <Alert color="red" title="เกิดข้อผิดพลาดในการอ่านข้อมูล" icon={<IconAlertTriangleFilled />}>
              {error.message}
            </Alert>
          )}

          {/* Book Card Grid with modern design */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {books?.map((book) => (
              <div
                className="bg-white rounded-xl shadow-lg border border-green-100 overflow-hidden
                           hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 flex flex-col"
                key={book.id}
              >
                <img
                  src={bookImageUrls[book.id % bookImageUrls.length]}
                  alt={book.title}
                  className="w-full h-80 object-cover"
                />
                <div className="p-5 flex flex-col flex-grow">
                  <h2 className="text-xl font-semibold text-gray-800 line-clamp-2 mb-2 flex-grow">
                    {book.title}
                  </h2>
                  <p className="text-sm text-gray-500 mb-4">โดย {book.author}</p>
                </div>
                <div className="flex justify-between items-center px-5 pb-4 border-t border-gray-100 pt-3">
                  <Rating
                    defaultValue={Math.floor(Math.random() * 5) + 1}
                    color="teal"
                    size="sm"
                    readOnly
                  />

                  <Button component={Link} to={`/books/${book.id}`} size="xs" variant="outline" color="teal">
                    ดูรายละเอียด
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </Layout>
    </>
  );
}