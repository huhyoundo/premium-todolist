"use client"

import { useTodoStore } from '@/store/useTodoStore'
import { format, isSameDay } from 'date-fns'
import { ko } from 'date-fns/locale'
import { motion, AnimatePresence } from 'framer-motion'
import { toggleTodo, deleteTodo } from '@/actions/todoActions'
import { useTransition } from 'react'

export default function TodoList() {
    const { todos, selectedDate, toggleTodo: toggleStoreTodo, setTodos } = useTodoStore()
    const [isPending, startTransition] = useTransition()

    const today = new Date()
    const isTodaySelected = isSameDay(selectedDate, today)

    const visibleTodos = todos.filter(todo => {
        if (isSameDay(todo.date, selectedDate)) return true
        if (isTodaySelected && !todo.completed && todo.date < selectedDate) return true
        return false
    })

    const completedCount = visibleTodos.filter(t => t.completed).length
    const totalCount = visibleTodos.length

    const handleToggle = (id: string) => {
        toggleStoreTodo(id)
        startTransition(async () => {
            try { await toggleTodo(id) } catch (err) { console.error(err) }
        })
    }

    const handleDelete = (e: React.MouseEvent, id: string) => {
        e.stopPropagation()
        setTodos(todos.filter(t => t.id !== id))
        startTransition(async () => {
            try { await deleteTodo(id) } catch (err) { console.error(err) }
        })
    }

    return (
        <div className="glass-card p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h3 className="font-semibold">
                        {format(selectedDate, 'M월 d일', { locale: ko })}
                        <span className="text-white/40 font-normal ml-2">
                            {format(selectedDate, 'EEEE', { locale: ko })}
                        </span>
                    </h3>
                </div>
                {totalCount > 0 && (
                    <div className="flex items-center gap-2">
                        <div className="w-24 h-1.5 bg-white/10 rounded-full overflow-hidden">
                            <motion.div
                                className="h-full bg-[#5E5CE6] rounded-full"
                                initial={{ width: 0 }}
                                animate={{ width: `${(completedCount / totalCount) * 100}%` }}
                                transition={{ duration: 0.5 }}
                            />
                        </div>
                        <span className="text-xs text-white/40">{completedCount}/{totalCount}</span>
                    </div>
                )}
            </div>

            {/* List */}
            <AnimatePresence mode="popLayout">
                {visibleTodos.length === 0 && (
                    <motion.div
                        key="empty-state"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className="text-center py-16"
                    >
                        <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mx-auto mb-4">
                            <svg className="w-8 h-8 text-white/20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                            </svg>
                        </div>
                        <p className="text-white/40">할 일이 없습니다</p>
                        <p className="text-white/20 text-sm mt-1">새로운 할 일을 추가해보세요</p>
                    </motion.div>
                )}

                <div className="space-y-2" key="todo-list">
                    {visibleTodos.map((todo, index) => (
                        <motion.div
                            key={`todo-${todo.id}-${index}`}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ delay: index * 0.02 }}
                            layout
                            onClick={() => handleToggle(todo.id)}
                            className={`
                group flex items-center gap-4 p-4 rounded-xl cursor-pointer transition-all
                ${todo.completed
                                    ? 'bg-white/[0.02]'
                                    : 'bg-white/[0.03] hover:bg-white/[0.06]'
                                }
              `}
                        >
                            {/* Checkbox */}
                            <motion.div
                                whileTap={{ scale: 0.8 }}
                                className={`
                  w-5 h-5 rounded-md border-2 flex items-center justify-center flex-shrink-0 transition-all
                  ${todo.completed
                                        ? 'bg-[#5E5CE6] border-[#5E5CE6]'
                                        : 'border-white/20 group-hover:border-[#5E5CE6]/50'
                                    }
                `}
                            >
                                {todo.completed && (
                                    <motion.svg
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        className="w-3 h-3 text-white"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                    </motion.svg>
                                )}
                            </motion.div>

                            {/* Text */}
                            <span className={`
                flex-1 transition-all
                ${todo.completed ? 'text-white/30 line-through' : 'text-white/90'}
              `}>
                                {todo.title}
                            </span>

                            {/* Carry over badge */}
                            {!isSameDay(todo.date, selectedDate) && (
                                <span className="text-[10px] text-orange-400 bg-orange-400/10 px-2 py-0.5 rounded font-medium">
                                    {format(todo.date, 'M/d')} 이월
                                </span>
                            )}

                            {/* Delete */}
                            <button
                                onClick={(e) => handleDelete(e, todo.id)}
                                className="opacity-0 group-hover:opacity-100 w-7 h-7 flex items-center justify-center text-white/30 hover:text-red-400 hover:bg-red-400/10 rounded-md transition-all"
                            >
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </motion.div>
                    ))}
                </div>
            </AnimatePresence>
        </div>
    )
}
