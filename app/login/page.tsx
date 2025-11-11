"use client"

import { useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import LoginPage from "@/components/login-page"

export default function LoginRoute() {
  const { data: session, status } = useSession()
  const router = useRouter()

  // Se já estiver logado, redireciona conforme a role
  useEffect(() => {
    if (session) {
      const role = (session.user as any).role
      if (role === "ADMIN") {
        router.replace("/admin")
      } else {
        router.replace("/")
      }
    }
  }, [session, router])

  if (status === "loading") {
    return <div>Carregando...</div>
  }

  if (session) {
    return <div>Redirecionando...</div>
  }

  // Não autenticado -> mostra tela de login
  return <LoginPage />
}
