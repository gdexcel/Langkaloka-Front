//langkaloka-v1\app\create-store\page.tsx
"use client";

import { useState } from "react";
import { useCreateStore } from "@/hooks/useCreateStore";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function CreateStorePage() {
  const { mutate, isPending } = useCreateStore();

  const [form, setForm] = useState({
    name: "",
    description: "",
    phone: "",
    email: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutate(form);
  };

  return (
    <div className="max-w-4xl mx-auto py-12">
      <Card className="p-6">
        <CardHeader>
          <CardTitle className="text-center text-xl">
            Bikin Toko Dulu Yuk Sebelum Jualan!
          </CardTitle>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <Input
              name="name"
              placeholder="Nama Toko"
              onChange={handleChange}
            />

            <Textarea
              name="description"
              placeholder="Deskripsi toko"
              onChange={handleChange}
            />

            <div className="grid grid-cols-2 gap-4">
              <Input
                name="phone"
                placeholder="Nomor HP"
                onChange={handleChange}
              />

              <Input name="email" placeholder="Email" onChange={handleChange} />
            </div>

            <Button type="submit">
              {isPending ? "Creating..." : "Buat Toko"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
