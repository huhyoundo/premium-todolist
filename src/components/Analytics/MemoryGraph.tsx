"use client"

import { useMemo, useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { format, eachDayOfInterval, subDays, isSameDay, getDay } from 'date-fns'
import { ko } from 'date-fns/locale'

// Mock Data Generator
const generateMockData = (days: number) => {
    const today = new Date()
    const data: Record<string, number> = {}

    for (let i = 0; i < days; i++) {
        const date = subDays(today, i)
        const key = format(date, 'yyyy-MM-dd')

        // Random probability: 30% empty, 70% active
        // Active: 1-5 level
        if (Math.random() > 0.3) {
            data[key] = Math.ceil(Math.random() * 5) // 1 to 5
        } else {
            data[key] = 0
        }
    }
    return data
}

export default function MemoryGraph() {
    // Fix Hydration Mismatch: Generate random data only on client
    const [historyData, setHistoryData] = useState<Record<string, number>>({})

    useEffect(() => {
        setHistoryData(generateMockData(365))
    }, [])

    const today = new Date()
    const days = eachDayOfInterval({
        start: subDays(today, 364),
        end: today
    })

    const [hoveredDate, setHoveredDate] = useState<Date | null>(null)
    const [hoveredValue, setHoveredValue] = useState<number | null>(null)

    // Color scale map based on value (0-5)
    const getColor = (value: number) => {
        if (value === 0) return 'bg-white/[0.03]'
        if (value === 1) return 'bg-[#5E5CE6]/20'
        if (value === 2) return 'bg-[#5E5CE6]/40'
        if (value === 3) return 'bg-[#5E5CE6]/60'
        if (value === 4) return 'bg-[#5E5CE6]/80 shadow-[0_0_10px_rgba(94,92,230,0.5)]'
        return 'bg-[#5E5CE6] shadow-[0_0_15px_rgba(94,92,230,0.8)]'
    }

    // Height scale for 3D effect
    const getHeight = (value: number) => {
        if (value === 0) return 'h-2'
        return `h-${value * 2 + 2}` // Scales height: 4, 6, 8, 10, 12... actually using tailwind arbitrary values might be better
    }

    // Group by weeks for the grid
    const weeks = useMemo(() => {
        const weeksArray: Date[][] = []
        let currentWeek: Date[] = []

        days.forEach(day => {
            if (currentWeek.length === 7) {
                weeksArray.push(currentWeek)
                currentWeek = []
            }
            currentWeek.push(day)
        })
        if (currentWeek.length > 0) weeksArray.push(currentWeek)

        return weeksArray
    }, [days])

    return (
        <div className="w-full relative">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h3 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60">
                        Memory City
                    </h3>
                    <p className="text-sm text-white/40 mt-1">
                        지난 1년간의 몰입 기록 (Demo Mode)
                    </p>
                </div>

                {/* Legend */}
                <div className="flex items-center gap-2 text-xs text-white/30">
                    <span>Less</span>
                    {[0, 2, 4].map(v => (
                        <div
                            key={v}
                            className={`w-3 h-3 rounded-sm ${getColor(v).split(' ')[0]}`}
                        />
                    ))}
                    <span>More</span>
                </div>
            </div>

            <div className="relative overflow-x-auto pb-8 scrollbar-hide">
                <div className="min-w-[800px] flex gap-1.5 p-4 pl-0">
                    {weeks.map((week, weekIdx) => (
                        <div key={weekIdx} className="flex flex-col gap-1.5">
                            {week.map((day, dayIdx) => {
                                const key = format(day, 'yyyy-MM-dd')
                                const value = historyData[key] || 0

                                return (
                                    <motion.div
                                        key={key}
                                        onHoverStart={() => {
                                            setHoveredDate(day)
                                            setHoveredValue(value)
                                        }}
                                        onHoverEnd={() => {
                                            setHoveredDate(null)
                                            setHoveredValue(null)
                                        }}
                                        className={`
                                            relative w-3.5 rounded-sm cursor-pointer transition-all duration-300
                                            ${getColor(value)}
                                        `}
                                        style={{
                                            height: value === 0 ? 14 : 14 + (value * 4), // Dynamic height for 3D effect
                                            marginTop: value === 0 ? 0 : -(value * 4), // Align bottom
                                            opacity: hoveredDate ? (isSameDay(hoveredDate, day) ? 1 : 0.3) : 1
                                        }}
                                        whileHover={{
                                            scale: 1.3,
                                            zIndex: 20,
                                            transition: { duration: 0.1 }
                                        }}
                                    />
                                )
                            })}
                        </div>
                    ))}
                </div>

                {/* Hover Tooltip - Floating Indicator */}
                <AnimatePresence>
                    {hoveredDate && (
                        <motion.div
                            initial={{ opacity: 0, y: 10, scale: 0.9 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 5, scale: 0.9 }}
                            className="fixed z-50 pointer-events-none px-4 py-2 bg-black/80 backdrop-blur-md rounded-xl border border-white/10 shadow-2xl flex flex-col items-center"
                            style={{
                                left: "50%",
                                bottom: "100px",
                                x: "-50%"
                            }}
                        >
                            <span className="text-[#5E5CE6] font-bold text-lg mb-0.5">
                                {hoveredValue === 0 ? 'No Data' : `${hoveredValue} Memories`}
                            </span>
                            <span className="text-white/50 text-xs font-mono">
                                {format(hoveredDate, 'yyyy년 M월 d일', { locale: ko })}
                            </span>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Visual Flair */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-black pointer-events-none" />
        </div>
    )
}
