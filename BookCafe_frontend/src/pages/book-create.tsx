import { useNavigate } from "react-router-dom";
import Layout from "../components/layout";
import { Button, Container, Divider, TextInput, Textarea } from "@mantine/core";
import { isNotEmpty, useForm } from "@mantine/form";
import { useState } from "react";
import axios, { AxiosError } from "axios";
import { notifications } from "@mantine/notifications";
import { Book } from "../lib/models";
import { DatePickerInput } from "@mantine/dates";

export default function BookCreatePage() {
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);

  const bookCreateForm = useForm({
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

  const handleSubmit = async (values: typeof bookCreateForm.values) => {
    try {
      setIsProcessing(true);
      const response = await axios.post<{ book: Book }>(`/books`, values);
      notifications.show({
        title: "เพิ่มข้อมูลหนังสือสำเร็จ",
        message: "ข้อมูลหนังสือได้รับการเพิ่มเรียบร้อยแล้ว",
        color: "teal",
      });
      navigate(`/books/${response.data.book.id}`);
    } catch (error) {
      // ... Error Handling ...
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <>
      <Layout>
        <Container className="mt-8">
          <h1 className="text-xl">เพิ่มหนังสือในระบบ</h1>

          <form onSubmit={bookCreateForm.onSubmit(handleSubmit)} className="space-y-8">
            <TextInput label="ชื่อหนังสือ" placeholder="ชื่อหนังสือ" {...bookCreateForm.getInputProps("title")} required />
            <TextInput label="ชื่อผู้แต่ง" placeholder="ชื่อผู้แต่ง" {...bookCreateForm.getInputProps("author")} required />
            <DatePickerInput label="วันที่พิมพ์" placeholder="วันที่พิมพ์" {...bookCreateForm.getInputProps("publishedAt")} required />

            <Textarea label="รายละเอียดหนังสือ" placeholder="รายละเอียดหนังสือ" {...bookCreateForm.getInputProps("description")} minRows={3} />
            <Textarea label="เรื่องย่อ (Synopsis)" placeholder="เรื่องย่อ (Synopsis)" {...bookCreateForm.getInputProps("synopsis")} minRows={5} />
            <TextInput label="หมวดหมู่" placeholder="หมวดหมู่" {...bookCreateForm.getInputProps("category")} />

            <Divider />

            <Button type="submit" loading={isProcessing}>
              บันทึกข้อมูล
            </Button>
          </form>
        </Container>
      </Layout>
    </>
  );
}