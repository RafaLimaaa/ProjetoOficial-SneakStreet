"use client"

import { useEffect } from "react"
import { useSession, signOut } from "next-auth/react"
import { useRouter } from "next/navigation"
import AdminDashboard from "@/components/admin-dashboard"

export default function AdminPage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  // Garantia extra no client (além do middleware)
  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/login")
    }

    if (status === "authenticated" && session) {
      const role = (session.user as any).role
      if (role !== "ADMIN") {
        router.replace("/")
      }
    }
  }, [status, session, router])

  if (status === "loading") {
    return <div>Carregando...</div>
  }

  if (!session) {
    return <div>Redirecionando para login...</div>
  }

  const role = (session.user as any).role
  if (role !== "ADMIN") {
    return <div>Redirecionando...</div>
  }

  const userName = session.user?.name || "Admin"

  return (
    <AdminDashboard
      userName={userName}
      onLogout={() => signOut({ callbackUrl: "/login" })}
    />
  )
}
