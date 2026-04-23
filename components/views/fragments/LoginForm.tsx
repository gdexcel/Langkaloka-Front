//langkaloka-v1\components\views\fragments\LoginForm.tsx
"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { useLogin } from "@/hooks/useLogin";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";

export function LoginForm({
  className,
  onSuccess,
  ...props
}: React.ComponentProps<"div"> & { onSuccess?: () => void }) {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({ email: "", password: "" });

  const validate = (currentForm = form) => {
    const newErrors = { email: "", password: "" };

    if (!currentForm.email) {
      newErrors.email = "Email wajib diisi";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(currentForm.email)) {
      newErrors.email = "Format email tidak valid";
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
    return !newErrors.email && !newErrors.password;
  };

  const { mutate, isPending } = useLogin({
    onSuccess,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    mutate(form);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const updated = { ...form, [e.target.id]: e.target.value };
    setForm(updated);
    validate(updated);
  };

  const isFormValid =
    Object.values(form).every(Boolean) && !errors.email && !errors.password;

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Login to your account</CardTitle>
          <CardDescription>
            Enter your email and password to login
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit}>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                  id="email"
                  type="email"
                  autoComplete="email"
                  placeholder="m@example.com"
                  required
                  value={form.email}
                  onChange={handleChange}
                />
                {errors.email && (
                  <p className="text-sm text-red-500">{errors.email}</p>
                )}
              </Field>

              <Field>
                <FieldLabel htmlFor="password">Password</FieldLabel>
                <Input
                  id="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={form.password}
                  onChange={handleChange}
                />
                {errors.password && (
                  <p className="text-sm text-red-500">{errors.password}</p>
                )}
              </Field>

              <Field>
                <Button type="submit" disabled={isPending || !isFormValid}>
                  {isPending ? "Logging in..." : "Login"}
                </Button>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
