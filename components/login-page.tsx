"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { signIn } from "next-auth/react"
import SneakStreetLogo from "./sneakstreet-logo"
import { Mail, Lock, User, LogIn } from "lucide-react"

export default function LoginPage() {
  const router = useRouter()

  const [loginType, setLoginType] = useState<"client" | "admin" | null>(null)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [name, setName] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!loginType) {
      setError("Selecione se você é Cliente ou Admin antes de continuar.")
      return
    }

    if (!email || !password) {
      setError("Preencha email e senha.")
      return
    }

    setError("")
    setLoading(true)

    const res = await signIn("credentials", {
      redirect: false,
      email,
      password,
    })

    setLoading(false)

    if (!res || !res.ok) {
      setError("Credenciais inválidas. Confira seu email e senha.")
      return
    }

    // Login OK: decide rota visual.
    // A autorização REAL é garantida pelo middleware + role no token.
    if (loginType === "admin") {
      router.push("/admin")
    } else {
      router.push("/")
    }
  }

  const resetForm = () => {
    setLoginType(null)
    setEmail("")
    setPassword("")
    setName("")
    setError("")
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-card to-background flex items-center justify-center p-4">
      {/* Elementos decorativos de fundo */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl -z-10" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-accent/5 rounded-full blur-3xl -z-10" />

      <div className="w-full max-w-4xl">
        {loginType === null ? (
          // Escolha Cliente x Admin
          <div className="text-center mb-12">
            <div className="flex justify-center mb-8">
              <SneakStreetLogo size={120} />
            </div>
            <h1 className="text-5xl font-bold mb-2 text-foreground">SneakStreet!</h1>
            <p className="text-xl text-muted-foreground mb-8">Feito por quem vive a cena</p>

            <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto">
              {/* Card Cliente */}
              <button
                onClick={() => setLoginType("client")}
                className="group p-8 bg-card border-2 border-border rounded-2xl hover:border-primary transition-smooth hover:shadow-lg hover:glow-red"
              >
                <div className="mb-6 inline-block p-4 bg-primary/10 rounded-xl group-hover:bg-primary/20 transition-smooth">
                  <User className="w-12 h-12 text-primary" />
                </div>
                <h2 className="text-2xl font-bold mb-2 text-foreground">Cliente</h2>
                <p className="text-muted-foreground mb-4">Compre os melhores tênis com facilidade</p>
                <span className="inline-flex items-center gap-2 text-primary font-semibold group-hover:gap-3 transition-smooth">
                  Entrar como Cliente
                  <LogIn className="w-5 h-5" />
                </span>
              </button>

              {/* Card Admin */}
              <button
                onClick={() => setLoginType("admin")}
                className="group p-8 bg-card border-2 border-border rounded-2xl hover:border-accent transition-smooth hover:shadow-lg hover:glow-cyan"
              >
                <div className="mb-6 inline-block p-4 bg-accent/10 rounded-xl group-hover:bg-accent/20 transition-smooth">
                  <Lock className="w-12 h-12 text-accent" />
                </div>
                <h2 className="text-2xl font-bold mb-2 text-foreground">Administrador</h2>
                <p className="text-muted-foreground mb-4">Gerencie produtos e estoques</p>
                <span className="inline-flex items-center gap-2 text-accent font-semibold group-hover:gap-3 transition-smooth">
                  Entrar como Admin
                  <LogIn className="w-5 h-5" />
                </span>
              </button>
            </div>
          </div>
        ) : (
          // Formulário de login
          <div className="bg-card border-2 border-border rounded-2xl p-8 max-w-md mx-auto backdrop-blur-sm">
            <button
              onClick={resetForm}
              className="text-muted-foreground hover:text-foreground mb-6 text-sm font-semibold transition-smooth"
            >
              ← Voltar
            </button>

            <h2 className="text-3xl font-bold mb-2 text-foreground">
              {loginType === "client" ? "Login de Cliente" : "Login Admin"}
            </h2>
            <p className="text-muted-foreground mb-8">Acesse sua conta para continuar</p>

            <form onSubmit={handleLogin} className="space-y-4">
              {/* Nome (opcional, só visual) */}
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">Nome</label>
                <div className="relative">
                  <User className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Seu nome completo"
                    className="w-full pl-10 pr-4 py-2.5 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-smooth"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="seu@email.com"
                    className="w-full pl-10 pr-4 py-2.5 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-smooth"
                    required
                  />
                </div>
              </div>

              {/* Senha */}
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">Senha</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-4 py-2.5 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-smooth"
                    required
                  />
                </div>
              </div>

              {/* Erro */}
              {error && (
                <p className="text-sm text-red-500 font-medium">
                  {error}
                </p>
              )}

              {/* Botão */}
              <button
                type="submit"
                disabled={loading}
                className="w-full mt-6 py-3 bg-gradient-to-r from-primary to-primary/80 text-primary-foreground font-bold rounded-lg hover:shadow-lg hover:glow-red transition-smooth active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {loading ? "Entrando..." : "Entrar Agora"}
              </button>
            </form>

            <p className="text-center text-sm text-muted-foreground mt-6">
              {loginType === "client"
                ? "Use seu email e senha cadastrados para acessar como cliente."
                : "Use suas credenciais de administrador para acessar o painel."}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
