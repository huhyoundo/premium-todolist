"use client"

import { useState, useTransition, useRef, useEffect } from 'react'
import { useTodoStore } from '@/store/useTodoStore'
import { motion, AnimatePresence } from 'framer-motion'
import { createTodo } from '@/actions/todoActions'

export default function TodoInput() {
    const [text, setText] = useState('')
    const [isPending, startTransition] = useTransition()
    const [isFocused, setIsFocused] = useState(false)
    const inputRef = useRef<HTMLInputElement>(null)
    const { addTodo, selectedDate } = useTodoStore()

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (!text.trim()) return

        const title = text
        addTodo({ id: crypto.randomUUID(), title, completed: false, date: selectedDate })
        setText('')

        startTransition(async () => {
            try { await createTodo(title, selectedDate) }
            catch (error) { console.error(error) }
        })
    }

    // Keyboard shortcut
    useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            if (e.key === '/' && !isFocused) {
                e.preventDefault()
                inputRef.current?.focus()
            }
        }
        window.addEventListener('keydown', handler)
        return () => window.removeEventListener('keydown', handler)
    }, [isFocused])

    return (
        <form onSubmit={handleSubmit}>
            <div className={`
        glass-card flex items-center gap-4 p-4 transition-all duration-200
        ${isFocused ? 'border-[#5E5CE6]/50 bg-[#5E5CE6]/5' : ''}
      `}>
                <div className={`
          w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors
          ${isFocused ? 'bg-[#5E5CE6]/20 text-[#5E5CE6]' : 'bg-white/5 text-white/30'}
        `}>
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                </div>

                <input
                    ref={inputRef}
                    type="text"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    disabled={isPending}
                    placeholder="새로운 할 일을 입력하세요... ( / 로 빠른 입력)"
                    className="flex-1 bg-transparent text-white placeholder-white/30 outline-none text-base"
                />

                <AnimatePresence>
                    {text.trim() && (
                        <motion.button
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            type="submit"
                            disabled={isPending}
                            className="glow-button"
                        >
                            추가
                        </motion.button>
                    )}
                </AnimatePresence>
            </div>
        </form>
    )
}
