"use client"

import { signIn, signOut, useSession } from "next-auth/react"
import { motion, AnimatePresence } from "framer-motion"
import { useState } from "react"

interface LoginButtonProps {
    variant?: 'nav' | 'hero'
}

export default function LoginButton({ variant = 'hero' }: LoginButtonProps) {
    const { data: session } = useSession()
    const [email, setEmail] = useState("")
    const [showInput, setShowInput] = useState(false)

    if (session) {
        return (
            <button
                onClick={() => signOut()}
                className="flex items-center gap-2 px-4 py-2 text-sm text-white/40 hover:text-white rounded-lg transition-colors"
            >
                <span className="w-6 h-6 rounded-full bg-[#5E5CE6] flex items-center justify-center text-xs text-white font-medium">
                    {session.user?.name?.charAt(0).toUpperCase()}
                </span>
                <span className="hidden sm:inline">로그아웃</span>
            </button>
        )
    }

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault()
        if (email.trim()) {
            signIn("credentials", { email, callbackUrl: "/" })
        }
    }

    if (showInput) {
        return (
            <AnimatePresence>
                <motion.form
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    onSubmit={handleLogin}
                    className="flex items-center gap-2"
                >
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="이메일"
                        className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white placeholder-white/30 outline-none focus:border-[#5E5CE6]/50 transition-colors w-48"
                        autoFocus
                    />
                    <button
                        type="submit"
                        className="px-4 py-2 bg-[#5E5CE6] text-white text-sm font-medium rounded-lg hover:bg-[#5E5CE6]/90 transition-colors"
                    >
                        시작
                    </button>
                    <button
                        type="button"
                        onClick={() => setShowInput(false)}
                        className="p-2 text-white/30 hover:text-white transition-colors"
                    >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </motion.form>
            </AnimatePresence>
        )
    }

    if (variant === 'nav') {
        return (
            <button
                onClick={() => setShowInput(true)}
                className="ghost-button"
            >
                로그인
            </button>
        )
    }

    return (
        <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowInput(true)}
            className="glow-button"
        >
            무료로 시작하기
        </motion.button>
    )
}
