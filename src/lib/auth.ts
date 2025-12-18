import NextAuth, { NextAuthOptions } from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import CredentialsProvider from "next-auth/providers/credentials"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "@/lib/prisma"

export const authOptions: NextAuthOptions = {
    adapter: PrismaAdapter(prisma),
    providers: [
        CredentialsProvider({
            name: "Test Account",
            credentials: {
                email: { label: "Email", type: "email", placeholder: "test@example.com" },
            },
            async authorize(credentials) {
                if (!credentials?.email) return null

                // Find or create user for testing
                let user = await prisma.user.findUnique({
                    where: { email: credentials.email }
                })

                if (!user) {
                    user = await prisma.user.create({
                        data: {
                            email: credentials.email,
                            name: credentials.email.split('@')[0],
                        }
                    })
                }

                return { id: user.id, email: user.email, name: user.name }
            }
        }),
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID || "",
            clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
        }),
    ],
    session: {
        strategy: "jwt", // Required for CredentialsProvider
    },
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id
            }
            return token
        },
        async session({ session, token }) {
            if (session.user && token.id) {
                session.user.id = token.id as string
            }
            return session
        },
    },
    pages: {
        signIn: '/login',
    }
}
