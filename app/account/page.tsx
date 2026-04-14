"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useCurrentUser } from "@/hooks/useCurrentUser"
import { useQueryClient } from "@tanstack/react-query"
import { Header } from "@/components/views/Header"
import axios from "axios"
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Save,
  ArrowLeft,
  Shield,
} from "lucide-react"

export default function AccountPage() {
  const router = useRouter()
  const queryClient = useQueryClient()
  const { data: user, isLoading } = useCurrentUser()

  const [name, setName] = useState("")
  const [phone, setPhone] = useState("")
  const [address, setAddress] = useState("")
  const [saving, setSaving] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState("")

  // Load user data ke form
  useEffect(() => {
    if (user) {
      setName(user.name || "")
      setPhone(user.phone || "")
      setAddress(user.address || "")
    }
  }, [user])

  // Redirect kalau belum login
  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/")
    }
  }, [isLoading, user, router])

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess(false)

    if (!phone.trim()) {
      setError("Nomor HP wajib diisi")
      return
    }

    try {
      setSaving(true)

      const token = localStorage.getItem("token")

      await axios.patch(
        "/api/auth/profile",
        { name, phone, address },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      // Refresh user data
      queryClient.invalidateQueries({ queryKey: ["currentUser"] })
      setSuccess(true)

      // Auto hide success
      setTimeout(() => setSuccess(false), 3000)
    } catch (err: any) {
      setError(err?.response?.data?.error || "Gagal menyimpan perubahan")
    } finally {
      setSaving(false)
    }
  }

  if (isLoading) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-white via-blue-50/30 to-white">
        <Header />
        <div className="max-w-2xl mx-auto p-6">
          <div className="animate-pulse space-y-6">
            <div className="h-8 w-48 bg-blue-100 rounded-lg" />
            <div className="h-64 bg-blue-50 rounded-2xl" />
          </div>
        </div>
      </main>
    )
  }

  if (!user) return null

  return (
    <main className="min-h-screen bg-gradient-to-br from-white via-blue-50/30 to-white">
      <Header />

      <div className="max-w-2xl mx-auto px-4 md:px-6 py-8">
        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-sm text-gray-500 hover:text-blue-600 mb-6 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          Kembali
        </button>

        {/* Page Title */}
        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
            <User className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Pengaturan Akun
            </h1>
            <p className="text-sm text-gray-500">
              Kelola informasi profil kamu
            </p>
          </div>
        </div>

        {/* Profile Card */}
        <div className="bg-white rounded-2xl border border-blue-100 shadow-sm overflow-hidden">
          {/* Profile Header */}
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-8">
            <div className="flex items-center gap-4">
              {/* Avatar */}
              <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center border-2 border-white/30 shadow-lg">
                <span className="text-3xl font-bold text-white">
                  {(user.name || user.email)?.[0]?.toUpperCase() || "U"}
                </span>
              </div>

              <div>
                <h2 className="text-xl font-bold text-white">
                  {user.name || "Belum diisi"}
                </h2>
                <p className="text-blue-100 text-sm">{user.email}</p>
                <div className="flex items-center gap-1 mt-1">
                  <Shield className="w-3 h-3 text-blue-200" />
                  <p className="text-xs text-blue-200">Akun terverifikasi</p>
                </div>
              </div>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSave} className="p-6 space-y-5">
            {/* Success Message */}
            {success && (
              <div className="bg-green-50 border border-green-200 text-green-700 text-sm px-4 py-3 rounded-xl flex items-center gap-2">
                <span>✅</span>
                Profil berhasil diperbarui!
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-xl flex items-center gap-2">
                <span>❌</span>
                {error}
              </div>
            )}

            {/* Email (Read Only) */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                <Mail className="w-4 h-4 text-blue-500" />
                Email
              </label>
              <div className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-500 text-sm cursor-not-allowed">
                {user.email}
              </div>
              <p className="text-xs text-gray-400 mt-1">
                Email tidak bisa diubah
              </p>
            </div>

            {/* Name */}
            <div>
              <label
                htmlFor="name"
                className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2"
              >
                <User className="w-4 h-4 text-blue-500" />
                Nama Lengkap
              </label>
              <input
                id="name"
                type="text"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all hover:border-blue-200"
                placeholder="Masukkan nama lengkap"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            {/* Phone */}
            <div>
              <label
                htmlFor="phone"
                className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2"
              >
                <Phone className="w-4 h-4 text-blue-500" />
                Nomor HP
              </label>
              <input
                id="phone"
                type="tel"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all hover:border-blue-200"
                placeholder="+628xxxxxxxxxx"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
              <p className="text-xs text-gray-400 mt-1">
                Digunakan untuk verifikasi & kontak
              </p>
            </div>

            {/* Address */}
            <div>
              <label
                htmlFor="address"
                className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2"
              >
                <MapPin className="w-4 h-4 text-blue-500" />
                Alamat
              </label>
              <textarea
                id="address"
                rows={3}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all hover:border-blue-200 resize-none"
                placeholder="Masukkan alamat lengkap (untuk COD)"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
              <p className="text-xs text-gray-400 mt-1">
                Alamat untuk kemudahan transaksi COD
              </p>
            </div>

            {/* Account Info */}
            <div className="pt-3 border-t border-gray-100">
              <div className="flex items-center gap-2 text-xs text-gray-400">
                <Calendar className="w-3.5 h-3.5" />
                <span>
                  Bergabung sejak{" "}
                  {user.createdAt
                    ? new Date(user.createdAt).toLocaleDateString("id-ID", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })
                    : "-"}
                </span>
              </div>
            </div>

            {/* Save Button */}
            <button
              type="submit"
              disabled={saving}
              className="w-full flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 rounded-xl shadow-md hover:shadow-lg transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
            >
              {saving ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Menyimpan...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Simpan Perubahan
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </main>
  )
}
