"use client"

import { useState } from "react"
import { Button } from "../ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog"
import SignupPage from "./Signup"
import { LoginForm } from "./fragments/LoginForm"
import { useCurrentUser } from "@/hooks/useCurrentUser"


export function Header() {
  const { data: user } = useCurrentUser()
  const [isLogin, setIsLogin] = useState(true)

  return (
    <header className="border-b">
      <div className="container max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <span className="font-bold text-xl">LangkaLoka</span>

        <Dialog>
          <DialogTrigger asChild>
    {user ? (
  <div className="flex items-center gap-3">
    <span className="font-medium">Hi {user.email}</span>

    <Button
      variant="outline"
      onClick={() => {
        localStorage.removeItem("token")
        window.location.reload()
      }}
    >
      Logout
    </Button>
  </div>
) : (
  <Button>Login</Button>
)}
          </DialogTrigger>

          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>
                {isLogin ? "Login" : "Create Account"}
              </DialogTitle>
            </DialogHeader>

            {isLogin ? (
              <>
                <LoginForm />

                <p className="text-sm text-center text-muted-foreground">
                  Don&apos;t have an account?{" "}
                  <span
                    onClick={() => setIsLogin(false)}
                    className="text-primary cursor-pointer hover:underline"
                  >
                    Register
                  </span>
                </p>
              </>
            ) : (
              <>
              <SignupPage
  onSuccess={() => setIsLogin(true)}
  onSwitchToLogin={() => setIsLogin(true)}
/>

                <p className="text-sm text-center text-muted-foreground">
                  Already have an account?{" "}
                  <span
                    onClick={() => setIsLogin(true)}
                    className="text-primary cursor-pointer hover:underline"
                  >
                    Login
                  </span>
                </p>
              </>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </header>
  )
}