"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { Button } from "../ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog"
import SignupPage from "./Signup"
import { LoginForm } from "./fragments/LoginForm"
import { useCurrentUser } from "@/hooks/useCurrentUser"
import { useRouter } from "next/navigation"
import { useQueryClient } from "@tanstack/react-query"
import Pusher from "pusher-js"

export function Header() {
  const router = useRouter()
  const { data: user } = useCurrentUser()

  const [isLogin, setIsLogin] = useState(true)
  const [open, setOpen] = useState(false)

  const queryClient = useQueryClient()

  const [notif, setNotif] = useState(0)
  const [lastEvent, setLastEvent] = useState<string | null>(null)

  // 🔥 unlock audio (biar browser allow)
useEffect(() => {
  const unlock = () => {
    const audio = new Audio("/notif.mp3")
    audio.muted = true
    audio.play().catch(() => {})
  }

  document.addEventListener("click", unlock, { once: true })

  return () => {
    document.removeEventListener("click", unlock)
  }
}, [])

  // 🔥 PUSHER LISTENER (FINAL FIX)
  useEffect(() => {
    if (!user) return

    const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY!, {
      cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
    })

    const channel = pusher.subscribe("chat-list")

    channel.bind("update", (data: any) => {
      console.log("🔥 EVENT MASUK", data)

      const myId = localStorage.getItem("userId")

      // ❌ skip kalau dari diri sendiri
      if (data.senderId === myId) return

      // ❌ skip kalau bukan message
      if (!data.text) return

      // ❌ skip kalau lagi buka chat itu
      const currentChatId = window.location.pathname.split("/chat/")[1]
      if (currentChatId === data.chatId) return

      // ❌ skip duplicate event (ANTI BUG)
      const eventKey = `${data.chatId}-${data.text}`
      if (lastEvent === eventKey) return

      setLastEvent(eventKey)

      // ✅ valid message masuk
      setNotif((prev) => prev + 1)

      const audio = new Audio("/notif.mp3")
      audio.volume = 0.5
      audio.play().catch(() => {})
    })

    return () => {
      channel.unbind_all()
      channel.unsubscribe()
    }
  }, [user, lastEvent])

  return (
    <header className="border-b">
      <div className="container max-w-7xl mx-auto px-4 md:px-6 py-4 flex items-center justify-between">

        {/* LOGO */}
        <button
          className="font-bold text-xl cursor-pointer"
          onClick={() => router.push("/")}
        >
          LangkaLoka
        </button>

        {/* RIGHT */}
        <div className="flex items-center gap-4">

          {user && (
            <button
              onClick={() => router.push(`/store-panel`)}
              className="px-4 py-2 bg-gray-800 text-white rounded-lg"
            >
              Jualan Yuk!
            </button>
          )}

          {user && (
            <Link href="/wishlist">
              <Button variant="outline">❤️ Wishlist</Button>
            </Link>
          )}

          {/* CHAT + NOTIF */}
          {user && (
            <div className="relative">
              <button
                onClick={() => {
                  router.push("/chat")
                  setNotif(0)
                }}
                className="px-4 py-2 bg-black text-white rounded-lg"
              >
                Chat
              </button>

              {notif > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                  {notif}
                </span>
              )}
            </div>
          )}

          {/* LOGIN / USER */}
          <Dialog
            open={open}
            onOpenChange={(val) => {
              setOpen(val)
              if (!val) setIsLogin(true)
            }}
          >
            {user ? (
              <div className="flex items-center gap-3">
                <span className="font-medium">Hi {user.email}</span>

                <Button
                  variant="outline"
                  onClick={() => {
                    localStorage.removeItem("token")
                    queryClient.invalidateQueries({ queryKey: ["currentUser"] })
                    router.push("/")
                  }}
                >
                  Logout
                </Button>
              </div>
            ) : (
              <Button onClick={() => setOpen(true)}>Login</Button>
            )}

            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>
                  {isLogin ? "Login" : "Create Account"}
                </DialogTitle>
              </DialogHeader>

              {isLogin ? (
                <>
                  <LoginForm onSuccess={() => setOpen(false)} />

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
                <SignupPage
                  onSuccess={() => setIsLogin(true)}
                  onSwitchToLogin={() => setIsLogin(true)}
                />
              )}
            </DialogContent>
          </Dialog>

        </div>
      </div>
    </header>
  )
}