import Layout from "../components/layout";
import cafeBackgroundImage from "../assets/images/bg-cafe-2.jpg";
import useSWR from "swr";
import { Book } from "../lib/models";
import Loading from "../components/loading";
import { Alert, Button } from "@mantine/core";
import { IconAlertTriangleFilled, IconPlus } from "@tabler/icons-react";
import { Link } from "react-router-dom";
import { Rating } from '@mantine/core';
const bookImageUrls = [
  "https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=1887&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1512820790803-83ca734da794?q=80&w=1798&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1589998059171-988d887df646?q=80&w=1770&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1532012197267-da84d127e765?q=80&w=1887&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1495446815901-a7297e633e8d?q=80&w=1770&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1549122728-f51970943591?q=80&w=1831&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1580870193458-1e7a5309f1f6?q=80&w=1887&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1516979187457-637abb4f9353?q=80&w=1770&auto=format&fit=crop",
];
export default function BooksPage() {
  const { data: books, error } = useSWR<Book[]>("/api/books");
  
    // function Demo() {
    //   return <Rating defaultValue={5} color="orange" />
    // }

  return (
    <>
      <Layout>
        <section
          className="h-[500px] w-full text-white bg-orange-800 bg-cover bg-blend-multiply flex flex-col justify-center items-center px-4 text-center"
          style={{
            backgroundImage: `url(${cafeBackgroundImage})`,
          }}
        >
          <h1 className="text-5xl mb-2">หนังสือ</h1>
          <h2>รายการหนังสือทั้งหมด</h2>
        </section>

                <section className="container mx-auto py-8">
          <div className="flex justify-between">
            <h1>รายการหนังสือ</h1>
            <Button component={Link} leftSection={<IconPlus />} to="/books/create" size="xs" variant="primary" className="flex items-center space-x-2">
              เพิ่มหนังสือ
            </Button>
          </div>
          {!books && !error && <Loading />}
          {error && (
            <Alert color="red" title="เกิดข้อผิดพลาดในการอ่านข้อมูล" icon={<IconAlertTriangleFilled />}>
              {error.message}
            </Alert>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {books?.map((book) => (
              <div className="border border-solid border-neutral-200" key={book.id}>
                <img  src={bookImageUrls[book.id % bookImageUrls.length]} alt={book.title} className="w-full object-cover aspect-[3/4]" />
                <div className="p-4">
                  <h2 className="text-lg font-semibold line-clamp-2">{book.title}</h2>
                  <p className="text-xs text-neutral-500">โดย {book.author}</p>
                </div>
                <div className="flex justify-between items-center px-4 pb-2">
                  <Rating defaultValue={5} color="orange" size="sm" />
                  <Button component={Link} to={`/books/${book.id}`} size="xs" variant="default">
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
