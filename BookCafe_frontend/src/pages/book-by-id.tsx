import { Alert, Badge, Button, Container, Divider } from "@mantine/core";
import Layout from "../components/layout";
import { Link, useParams } from "react-router-dom";
import { Book } from "../lib/models";
import useSWR from "swr";
import Loading from "../components/loading";
import { IconAlertTriangleFilled, IconEdit } from "@tabler/icons-react";

export default function BookByIdPage() {
  const { bookId } = useParams();
  const { data: book, isLoading, error } = useSWR<Book>(`/api/books/${bookId}`);

  return (
    <>
      <Layout>
        <Container className="mt-4">
          {isLoading && !error && <Loading />}
          {error && (
            <Alert color="red" title="เกิดข้อผิดพลาดในการอ่านข้อมูล" icon={<IconAlertTriangleFilled />}>
              {error.message}
            </Alert>
          )}

          {!!book && (
            <>
              <h1>{book.title}</h1>
              <p className="italic text-neutral-500 mb-4">โดย {book.author}</p>
              <div className="grid grid-cols-1 lg:grid-cols-3">
                <img src="https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=1887&auto=format&fit=crop" alt={book.title} className="w-full object-cover aspect-[3/4]" />
                <div className="col-span-2 px-4 space-y-4 py-4">
                  {/* แสดงผล Description ถ้ามี */}
                  {book.description && (
                    <div>
                      <h3>รายละเอียดหนังสือ</h3>
                      <p className="indent-4">{book.description}</p>
                    </div>
                  )}

                  {/* แสดงผล Synopsis ถ้ามี */}
                  {book.synopsis && (
                    <div>
                      <h3>เรื่องย่อ</h3>
                      <p className="indent-4">{book.synopsis}</p>
                    </div>
                  )}

                  {/* แสดงผล Category ถ้ามี */}
                  {book.category && (
                    <div>
                      <h3>หมวดหมู่</h3>
                      <div className="flex flex-wrap gap-2">
                        <Badge color="teal">#{book.category}</Badge>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <Divider className="mt-4" />

              <Button
                color="blue"
                size="xs"
                component={Link}
                to={`/api/books/${book.id}/edit`}
                className="mt-4"
                leftSection={<IconEdit />}
              >
                แก้ไขข้อมูลหนังสือ
              </Button>
            </>
          )}
        </Container>
      </Layout>
    </>
  );
}