// app/providers.tsx
"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState, createContext, useContext } from "react";
import { LoginForm } from "@/components/views/fragments/LoginForm";
import { SignupForm } from "@/components/views/fragments/SignupForm";

const AuthModalContext = createContext<{ openLogin: () => void } | null>(null);

export function useAuthModal() {
  const ctx = useContext(AuthModalContext);
  if (!ctx) throw new Error("useAuthModal must be inside Providers");
  return ctx;
}

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());
  const [modal, setModal] = useState<"login" | "register" | null>(null);

  return (
    <QueryClientProvider client={queryClient}>
      <AuthModalContext.Provider value={{ openLogin: () => setModal("login") }}>
        {children}

        {modal && (
          <div
            className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
            onClick={() => setModal(null)}
          >
            <div
              className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold">
                  {modal === "login" ? "Login dulu" : "Buat Akun"}
                </h2>
                <button
                  onClick={() => setModal(null)}
                  className="text-gray-400 hover:text-gray-600 text-xl"
                >
                  ×
                </button>
              </div>

              {modal === "login" ? (
                <>
                  <LoginForm onSuccess={() => setModal(null)} />
                  <p className="text-center text-xs text-muted-foreground mt-3">
                    Belum punya akun?{" "}
                    <span
                      onClick={() => setModal("register")}
                      className="text-primary cursor-pointer font-medium hover:underline"
                    >
                      Daftar
                    </span>
                  </p>
                </>
              ) : (
                <SignupForm
                  onSuccess={() => setModal(null)}
                  onSwitchToLogin={() => setModal("login")}
                />
              )}
            </div>
          </div>
        )}
      </AuthModalContext.Provider>
    </QueryClientProvider>
  );
}
