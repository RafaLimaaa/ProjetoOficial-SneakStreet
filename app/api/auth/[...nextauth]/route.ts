// app/api/auth/[...nextauth]/route.ts
export const runtime = "nodejs"

import NextAuth, { type NextAuthOptions } from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { PrismaAdapter } from "@next-auth/prisma-adapter"
import { prisma } from "@/lib/prisma"
import { compare } from "bcryptjs"

if (!process.env.NEXTAUTH_SECRET) {
  throw new Error("NEXTAUTH_SECRET ausente no .env")
}

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  session: {
    // Se você NÃO estiver usando tabela Session, use "jwt"
    // Se estiver usando sessions no Prisma, pode trocar pra "database"
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/login",
  },
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Senha", type: "password" },
      },
      async authorize(credentials) {
        const email = (credentials?.email ?? "").trim().toLowerCase()
        const password = String(credentials?.password ?? "")

        if (!email || !password) return null

        const user = await prisma.user.findUnique({
          where: { email },
        })

        if (!user) return null

        const ok = await compare(password, user.passwordHash)
        if (!ok) return null

        // Retorna o shape que o NextAuth usa internamente
        return {
          id: String(user.id),     // Prisma é Int, aqui vira string
          name: user.name ?? "",
          email: user.email,
          role: user.role,         // enum Role do Prisma
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      // Primeira vez (login com credentials): 'user' vem preenchido
      if (user) {
        token.id = user.id as string       // já vem como string do authorize
        // @ts-ignore: dependendo da versão, user pode não tipar 'role', mas existe
        token.role = user.role
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        // Garante que o id está sempre como string na sessão
        session.user.id = (token.id as string) ?? ""
        // Role vem do token (enum Role)
        session.user.role = token.role as any
      }
      return session
    },
  },
}

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }
