"use client"

import { useEffect, useState } from "react"
import LoginPage from "@/components/login-page"
import ClientDashboard from "@/components/client-dashboard"
import AdminDashboard from "@/components/admin-dashboard"

type UserRole = "guest" | "client" | "admin"

export default function Home() {
  const [userRole, setUserRole] = useState<UserRole>("guest")
  const [userName, setUserName] = useState("")

  useEffect(() => {
    // Carregar estado do usuário do localStorage
    const savedRole = localStorage.getItem("userRole") as UserRole | null
    const savedName = localStorage.getItem("userName") || ""

    if (savedRole) {
      setUserRole(savedRole)
      setUserName(savedName)
    }
  }, [])

  const handleLogin = (role: "client" | "admin", name: string) => {
    setUserRole(role)
    setUserName(name)
    localStorage.setItem("userRole", role)
    localStorage.setItem("userName", name)
  }

  const handleLogout = () => {
    setUserRole("guest")
    setUserName("")
    localStorage.removeItem("userRole")
    localStorage.removeItem("userName")
    localStorage.removeItem("cart")
    localStorage.removeItem("favorites")
  }

  return (
    <div className="min-h-screen bg-background">
      {userRole === "guest" && <LoginPage onLogin={handleLogin} />}
      {userRole === "client" && <ClientDashboard userName={userName} onLogout={handleLogout} />}
      {userRole === "admin" && <AdminDashboard userName={userName} onLogout={handleLogout} />}
    </div>
  )
}
