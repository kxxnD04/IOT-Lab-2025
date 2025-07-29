import useSWR from "swr";
import { Book } from "../lib/models";
import { useNavigate, useParams } from "react-router-dom";
import Layout from "../components/layout";
import { Alert, Button, Container, Divider, TextInput, Textarea } from "@mantine/core";
import { DatePickerInput } from "@mantine/dates";
import Loading from "../components/loading";
import { IconAlertTriangleFilled, IconTrash } from "@tabler/icons-react";
import { isNotEmpty, useForm } from "@mantine/form";
import { useEffect, useState } from "react";
import axios, { AxiosError } from "axios";
import { notifications } from "@mantine/notifications";
import { modals } from "@mantine/modals";

export default function BookEditById() {
  const { bookId } = useParams();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);

  const { data: book, isLoading, error, mutate } = useSWR<Book>(`/books/${bookId}`);
  const [isSetInitialValues, setIsSetInitialValues] = useState(false);

  const bookEditForm = useForm({
    initialValues: {
      title: "",
      author: "",
      publishedAt: new Date(),
      description: "",
      synopsis: "",
      category: "",
    },

    validate: {
      title: isNotEmpty("กรุณาระบุชื่อหนังสือ"),
      author: isNotEmpty("กรุณาระบุชื่อผู้แต่ง"),
      publishedAt: isNotEmpty("กรุณาระบุวันที่พิมพ์หนังสือ"),
    },
  });

  const handleSubmit = async (values: typeof bookEditForm.values) => {
    try {
      setIsProcessing(true);
      await axios.patch(`/books/${bookId}`, values);
      mutate(); // สั่งให้ SWR โหลดข้อมูลใหม่หลังจากแก้ไข
      notifications.show({
        title: "แก้ไขข้อมูลหนังสือสำเร็จ",
        message: "ข้อมูลหนังสือได้รับการแก้ไขเรียบร้อยแล้ว",
        color: "teal",
      });
      navigate(`/books/${bookId}`);
    } catch (error) {
        notifications.show({
          title: "เกิดข้อผิดพลาดบางอย่าง",
          message: "กรุณาลองใหม่อีกครั้ง หรือดูที่ Console สำหรับข้อมูลเพิ่มเติม",
          color: "red",
        });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDelete = async () => {
    try {
      setIsProcessing(true);
      await axios.delete(`/books/${bookId}`);
      notifications.show({
        title: "ลบหนังสือสำเร็จ",
        message: "ลบหนังสือเล่มนี้ออกจากระบบเรียบร้อยแล้ว",
        color: "red",
      });
      navigate("/books");
    } catch (error) {
        console.log(AxiosError.ERR_BAD_RESPONSE)
    } finally {
      setIsProcessing(false);
    }
  };

  useEffect(() => {
    if (!isSetInitialValues && book) {
      const initialData = {
        title: book.title,
        author: book.author,
        publishedAt: new Date(book.publishedAt), // <<< แก้ไขการแปลงวันที่
        description: book.description ?? "",
        synopsis: book.synopsis ?? "",
        category: book.category ?? "",
      };
      bookEditForm.setInitialValues(initialData);
      bookEditForm.setValues(initialData);
      setIsSetInitialValues(true);
    }
  }, [book, bookEditForm, isSetInitialValues]);

  return (
    <>
      <Layout>
        <Container className="mt-8">
          <h1 className="text-xl">แก้ไขข้อมูลหนังสือ</h1>

          {isLoading && !error && <Loading />}
          {error && (
            <Alert color="red" title="เกิดข้อผิดพลาดในการอ่านข้อมูล" icon={<IconAlertTriangleFilled />}>
              {error.message}
            </Alert>
          )}

          {!!book && (
            <>
              <form onSubmit={bookEditForm.onSubmit(handleSubmit)} className="space-y-8">
                <TextInput label="ชื่อหนังสือ" placeholder="ชื่อหนังสือ" {...bookEditForm.getInputProps("title")} required />
                <TextInput label="ชื่อผู้แต่ง" placeholder="ชื่อผู้แต่ง" {...bookEditForm.getInputProps("author")} required />
                <DatePickerInput label="วันที่พิมพ์" placeholder="วันที่พิมพ์" {...bookEditForm.getInputProps("publishedAt")} required />

                <Textarea label="รายละเอียดหนังสือ" placeholder="รายละเอียดหนังสือ" {...bookEditForm.getInputProps("description")} minRows={3} />
                <Textarea label="เรื่องย่อ (Synopsis)" placeholder="เรื่องย่อ (Synopsis)" {...bookEditForm.getInputProps("synopsis")} minRows={5} />
                <TextInput label="หมวดหมู่" placeholder="หมวดหมู่" {...bookEditForm.getInputProps("category")} />

                <Divider />

                <div className="flex justify-between">
                  <Button color="red" leftSection={<IconTrash />} onClick={() => {
                    modals.openConfirmModal({
                      title: "คุณต้องการลบหนังสือเล่มนี้ใช่หรือไม่",
                      children: ( <span className="text-xs"> เมื่อคุณดำนเนินการลบหนังสือเล่มนี้แล้ว จะไม่สามารถย้อนกลับได้ </span> ),
                      labels: { confirm: "ลบ", cancel: "ยกเลิก" },
                      onConfirm: handleDelete,
                      confirmProps: { color: "red" },
                    });
                  }}>
                    ลบหนังสือนี้
                  </Button>

                  <Button type="submit" loading={isProcessing}>
                    บันทึกข้อมูล
                  </Button>
                </div>
              </form>
            </>
          )}
        </Container>
      </Layout>
    </>
  );
}
