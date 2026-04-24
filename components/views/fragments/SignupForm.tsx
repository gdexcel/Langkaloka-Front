"use client";

import { useState, useRef } from "react";
import { cn } from "@/lib/utils";
import { useRegister } from "@/hooks/useRegister";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type RegisterForm = {
  name: string;
  email: string;
  phone: string;
  password: string;
  address: string;
};

export function SignupForm({
  className,
  onSuccess,
  onSwitchToLogin,
  ...props
}: React.ComponentProps<"div"> & {
  onSuccess?: () => void;
  onSwitchToLogin?: () => void;
}) {
  const [form, setForm] = useState<RegisterForm>({
    name: "",
    email: "",
    phone: "",
    password: "",
    address: "",
  });

  const [errors, setErrors] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    address: "",
  });

  const isSubmitting = useRef(false);

  const validate = (currentForm = form) => {
    const newErrors = {
      name: "",
      email: "",
      phone: "",
      password: "",
      address: "",
    };

    if (!currentForm.name.trim()) {
      newErrors.name = "Nama wajib diisi";
    } else if (currentForm.name.trim().length < 2) {
      newErrors.name = "Nama minimal 2 karakter";
    }

    if (!currentForm.email) {
      newErrors.email = "Email wajib diisi";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(currentForm.email)) {
      newErrors.email = "Format email tidak valid";
    }

    if (!currentForm.phone) {
      newErrors.phone = "Nomor HP wajib diisi";
    } else if (!/^(\+62|62|0)[0-9]{8,12}$/.test(currentForm.phone)) {
      newErrors.phone = "Format nomor HP tidak valid";
    }

    if (!currentForm.password) {
      newErrors.password = "Password wajib diisi";
    } else if (currentForm.password.length < 8) {
      newErrors.password = "Password minimal 8 karakter";
    } else if (!/[A-Z]/.test(currentForm.password)) {
      newErrors.password = "Password harus ada huruf kapital";
    } else if (!/[a-z]/.test(currentForm.password)) {
      newErrors.password = "Password harus ada huruf kecil";
    } else if (!/[!@#$%^&*(),.?\":{}|<>]/.test(currentForm.password)) {
      newErrors.password = "Password harus ada simbol";
    } else if (!/\d/.test(currentForm.password)) {
      newErrors.password = "Password harus ada angka";
    }

    setErrors(newErrors);
    return Object.values(newErrors).every((e) => !e);
  };

  const { mutate, isPending } = useRegister({
    onSuccess: () => {
      isSubmitting.current = false;
      onSuccess?.();
    },
    onError: () => {
      isSubmitting.current = false;
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting.current || isPending) return;
    if (!validate()) return;
    isSubmitting.current = true;
    mutate(form);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const updated = { ...form, [e.target.id]: e.target.value };
    setForm(updated);
    validate(updated);
  };

  const isFormValid =
    !!form.name &&
    !!form.email &&
    !!form.phone &&
    !!form.password &&
    Object.values(errors).every((e) => !e);

  return (
    <div className={cn("w-full", className)} {...props}>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <div className="flex flex-col gap-1">
          <label
            htmlFor="name"
            className="text-xs font-medium text-foreground/80"
          >
            Nama Lengkap
          </label>
          <Input
            id="name"
            type="text"
            placeholder="cth: Adam Eve"
            value={form.name}
            onChange={handleChange}
            className="h-9 text-sm"
          />
          {errors.name && (
            <p className="text-[11px] text-destructive">{errors.name}</p>
          )}
        </div>

        <div className="flex flex-col gap-1">
          <label
            htmlFor="email"
            className="text-xs font-medium text-foreground/80"
          >
            Email
          </label>
          <Input
            id="email"
            type="email"
            autoComplete="email"
            placeholder="email@contoh.com"
            value={form.email}
            onChange={handleChange}
            className="h-9 text-sm"
          />
          {errors.email && (
            <p className="text-[11px] text-destructive">{errors.email}</p>
          )}
        </div>

        <div className="flex flex-col gap-1">
          <label
            htmlFor="phone"
            className="text-xs font-medium text-foreground/80"
          >
            Nomor HP
          </label>
          <Input
            id="phone"
            type="tel"
            placeholder="+6285xxxxxxxx"
            value={form.phone}
            onChange={handleChange}
            className="h-9 text-sm"
          />
          {errors.phone && (
            <p className="text-[11px] text-destructive">{errors.phone}</p>
          )}
        </div>

        <div className="flex flex-col gap-1">
          <label
            htmlFor="address"
            className="text-xs font-medium text-foreground/80"
          >
            Alamat{" "}
            <span className="text-muted-foreground font-normal">
              (opsional)
            </span>
          </label>
          <Input
            id="address"
            type="text"
            placeholder="cth: Jakarta Pusat"
            value={form.address}
            onChange={handleChange}
            className="h-9 text-sm"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label
            htmlFor="password"
            className="text-xs font-medium text-foreground/80"
          >
            Password
          </label>
          <Input
            id="password"
            type="password"
            autoComplete="new-password"
            placeholder="Min. 8 karakter"
            value={form.password}
            onChange={handleChange}
            className="h-9 text-sm"
          />
          {errors.password && (
            <p className="text-[11px] text-destructive">{errors.password}</p>
          )}
        </div>

        <Button
          type="submit"
          disabled={isPending || !isFormValid || isSubmitting.current}
          className="mt-1 h-9 w-full text-sm font-medium bg-blue-800"
        >
          {isPending ? "Membuat akun..." : "Buat Akun"}
        </Button>

        <p className="text-center text-xs text-muted-foreground">
          Sudah punya akun?{" "}
          <span
            onClick={onSwitchToLogin}
            className="text-primary cursor-pointer font-medium hover:underline"
          >
            Masuk
          </span>
        </p>
      </form>
    </div>
  );
}
