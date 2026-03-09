"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import { useLogin } from "@/hooks/useLogin"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {

  const [form, setForm] = useState({
    email: "",
    password: "",
  })

  const { mutate, isPending } = useLogin()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    mutate(form)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({
      ...prev,
      [e.target.id]: e.target.value,
    }))
  }

  const isFormValid = Object.values(form).every(Boolean)

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
              </Field>

              <Field>
                <Button
                  type="submit"
                  disabled={isPending || !isFormValid}
                >
                  {isPending ? "Logging in..." : "Login"}
                </Button>
              </Field>
            </FieldGroup>

          </form>
        </CardContent>
      </Card>

    </div>
  )
}