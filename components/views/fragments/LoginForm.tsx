//langkaloka-v1\components\views\fragments\LoginForm.tsx
"use client";

import { useState, useRef } from "react";
import { cn } from "@/lib/utils";
import { useLogin } from "@/hooks/useLogin";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function LoginForm({
  className,
  onSuccess,
  onSwitchToRegister,
  ...props
}: React.ComponentProps<"div"> & {
  onSuccess?: () => void;
  onSwitchToRegister?: () => void;
}) {
  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({ email: "", password: "" });
  const isSubmitting = useRef(false);

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
    }

    setErrors(newErrors);
    return !newErrors.email && !newErrors.password;
  };

  const { mutate, isPending } = useLogin({
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
    !!form.email && !!form.password && !errors.email && !errors.password;

  return (
    <div className={cn("w-full", className)} {...props}>
      {/* Header */}
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        {/* Email */}
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

        {/* Password */}
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
            autoComplete="current-password"
            placeholder="Password kamu"
            value={form.password}
            onChange={handleChange}
            className="h-9 text-sm"
          />
          {errors.password && (
            <p className="text-[11px] text-destructive">{errors.password}</p>
          )}
        </div>

        {/* Submit */}
        <Button
          type="submit"
          disabled={isPending || !isFormValid || isSubmitting.current}
          className="mt-1 h-9 w-full text-sm font-medium bg-blue-600 text-white"
        >
          {isPending ? "Masuk..." : "Masuk"}
        </Button>
      </form>
    </div>
  );
}
