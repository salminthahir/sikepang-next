import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"
import { authConfig } from "@/auth.config"

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) {
          return null
        }

        const user = await prisma.user.findUnique({
          where: { username: credentials.username as string },
          include: {
            profil_mitra: true,
            profil_admin: true
          }
        })

        if (!user) {
          return null
        }

        const isPasswordValid = await bcrypt.compare(
          credentials.password as string,
          user.password
        )

        if (!isPasswordValid) {
          return null
        }

        let nama_lengkap = user.username
        if (user.role === 'mitra' && user.profil_mitra?.nama_usaha) {
          nama_lengkap = user.profil_mitra.nama_usaha
        } else if (user.profil_admin?.nama_lengkap) {
          nama_lengkap = user.profil_admin.nama_lengkap
        }

        return {
          id: user.id_user.toString(),
          name: nama_lengkap,
          username: user.username,
          role: user.role,
        }
      }
    })
  ]
})
