"use client"

import { useState, useMemo } from 'react'
import { format, startOfWeek, addDays, startOfMonth, endOfMonth, endOfWeek, isSameMonth, isSameDay, addMonths, subMonths } from 'date-fns'
import { ko } from 'date-fns/locale'
import { motion, AnimatePresence } from 'framer-motion'
import { useTodoStore } from '@/store/useTodoStore'

export default function CalendarView() {
    const { selectedDate, setSelectedDate, todos } = useTodoStore()
    const [currentMonth, setCurrentMonth] = useState(new Date())
    const [direction, setDirection] = useState(0)

    const nextMonth = () => { setDirection(1); setCurrentMonth(addMonths(currentMonth, 1)) }
    const prevMonth = () => { setDirection(-1); setCurrentMonth(subMonths(currentMonth, 1)) }
    const goToToday = () => { setCurrentMonth(new Date()); setSelectedDate(new Date()) }

    const hasTodos = (day: Date) => todos.some(todo => isSameDay(todo.date, day))
    const hasIncompleteTodos = (day: Date) => todos.some(todo => isSameDay(todo.date, day) && !todo.completed)

    const weeks = useMemo(() => {
        const monthStart = startOfMonth(currentMonth)
        const monthEnd = endOfMonth(monthStart)
        const start = startOfWeek(monthStart)
        const end = endOfWeek(monthEnd)

        const result: Date[][] = []
        let days: Date[] = []
        let day = start

        while (day <= end) {
            for (let i = 0; i < 7; i++) {
                days.push(day)
                day = addDays(day, 1)
            }
            result.push(days)
            days = []
        }
        return result
    }, [currentMonth])

    const dayNames = ['일', '월', '화', '수', '목', '금', '토']

    return (
        <div className="w-full max-w-[340px]">
            {/* Header */}
            <div className="flex items-center justify-between mb-8 pl-2">
                <h2 className="text-sm font-semibold tracking-wide text-white/90">
                    {format(currentMonth, 'yyyy년 M월', { locale: ko })}
                </h2>
                <div className="flex items-center gap-1">
                    <button
                        onClick={prevMonth}
                        className="p-1.5 text-white/40 hover:text-white hover:bg-white/5 rounded-md transition-all duration-200"
                    >
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M10 12L6 8l4-4" />
                        </svg>
                    </button>
                    <button
                        onClick={goToToday}
                        className="px-2 py-1 text-[11px] font-medium text-white/40 hover:text-white border border-white/10 hover:border-white/20 rounded-md transition-all duration-200 mx-1"
                    >
                        오늘
                    </button>
                    <button
                        onClick={nextMonth}
                        className="p-1.5 text-white/40 hover:text-white hover:bg-white/5 rounded-md transition-all duration-200"
                    >
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M6 12l4-4-4-4" />
                        </svg>
                    </button>
                </div>
            </div>

            {/* Days Header */}
            <div className="grid grid-cols-7 mb-4">
                {dayNames.map((name, i) => (
                    <div
                        key={name}
                        className={`text-center py-2 text-[11px] font-medium bg-transparent
                            ${i === 0 ? 'text-red-400/50' : 'text-white/20'}
                        `}
                    >
                        {name}
                    </div>
                ))}
            </div>

            {/* Grid */}
            <AnimatePresence mode="wait" initial={false}>
                <motion.div
                    key={format(currentMonth, 'yyyy-MM')}
                    initial={{ opacity: 0, x: direction * 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: direction * -10 }}
                    transition={{ duration: 0.2, ease: "easeInOut" }}
                    className="space-y-1"
                >
                    {weeks.map((week, weekIdx) => (
                        <div key={weekIdx} className="grid grid-cols-7 gap-y-2">
                            {week.map((dayDate, dayIdx) => {
                                const isSelected = isSameDay(dayDate, selectedDate)
                                const isToday = isSameDay(dayDate, new Date())
                                const isCurrentMonth = isSameMonth(dayDate, currentMonth) // Corrected variable name
                                const hasTodo = hasTodos(dayDate)
                                const hasIncomplete = hasIncompleteTodos(dayDate)

                                return (
                                    <div key={dayDate.toString()} className="flex justify-center">
                                        <button
                                            onClick={() => setSelectedDate(dayDate)}
                                            className={`
                                                relative w-8 h-8 flex items-center justify-center rounded-lg text-xs transition-all duration-200
                                                ${!isCurrentMonth ? 'text-white/5 cursor-default' : 'text-white/70 hover:bg-white/5 hover:text-white'}
                                                ${isSelected ? '!bg-[#5E5CE6] !text-white shadow-[0_0_15px_rgba(94,92,230,0.4)]' : ''}
                                                ${isToday && !isSelected ? 'text-[#5E5CE6] font-semibold' : ''}
                                            `}
                                        >
                                            <span className="relative z-10">{format(dayDate, 'd')}</span>

                                            {/* Dot Indicator */}
                                            {hasTodo && (
                                                <span className={`
                                                    absolute bottom-1 w-1 h-1 rounded-full transition-all
                                                    ${isSelected ? 'bg-white' : hasIncomplete ? 'bg-[#5E5CE6]' : 'bg-white/20'}
                                                `} />
                                            )}
                                        </button>
                                    </div>
                                )
                            })}
                        </div>
                    ))}
                </motion.div>
            </AnimatePresence>
        </div>
    )
}
