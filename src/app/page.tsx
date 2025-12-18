import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import LoginButton from "@/components/Auth/LoginButton"
import CalendarView from "@/components/Calendar/CalendarView"
import TodoList from "@/components/Todo/TodoList"
import TodoInput from "@/components/Todo/TodoInput"
import TodoInitializer from "@/components/Todo/TodoInitializer"
import MemoryGraph from "@/components/Analytics/MemoryGraph"
import { format } from 'date-fns'
import { ko } from 'date-fns/locale'

export default async function Home() {
  const session = await getServerSession(authOptions)

  if (!session?.user) {
    return (
      <main className="relative min-h-screen overflow-hidden">
        <div className="gradient-blur" />
        <div className="grid-pattern" />

        {/* Nav */}
        <nav className="relative z-50 border-b border-white/[0.08]">
          <div className="container h-16 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-[#5E5CE6] flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <span className="text-lg font-semibold">Todo</span>
            </div>
            <LoginButton variant="nav" />
          </div>
        </nav>

        {/* Hero */}
        <section className="relative z-10 pt-32 pb-20">
          <div className="container">
            <div className="max-w-4xl mx-auto text-center">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/[0.03] mb-8">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <span className="text-sm text-white/60">새로운 업데이트 출시</span>
              </div>

              {/* Headline */}
              <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 leading-[1.1]">
                <span className="text-gradient">할 일 관리의</span>
                <br />
                <span className="text-white">새로운 기준</span>
              </h1>

              {/* Subheadline */}
              <p className="text-lg md:text-xl text-white/50 max-w-2xl mx-auto mb-12 leading-relaxed">
                미완료된 할 일은 자동으로 다음 날로 이월됩니다.
                <br className="hidden md:block" />
                더 이상 중요한 일을 놓치지 마세요.
              </p>

              {/* CTA */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <LoginButton />
                <button className="ghost-button flex items-center gap-2">
                  <span>자세히 보기</span>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="relative z-10 py-24 border-t border-white/[0.08]">
          <div className="container">
            <div className="grid md:grid-cols-3 gap-6">
              {[
                {
                  icon: (
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  ),
                  title: '캘린더 뷰',
                  desc: '날짜별로 할 일을 직관적으로 관리하세요'
                },
                {
                  icon: (
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                  ),
                  title: '자동 이월',
                  desc: '미완료 항목은 자동으로 다음 날로 이동'
                },
                {
                  icon: (
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
                    </svg>
                  ),
                  title: '클라우드 동기화',
                  desc: '어느 기기에서든 동일한 데이터'
                },
              ].map((feature, i) => (
                <div
                  key={i}
                  className="glass-card p-8 group cursor-pointer"
                >
                  <div className="w-12 h-12 rounded-xl bg-[#5E5CE6]/10 text-[#5E5CE6] flex items-center justify-center mb-6 group-hover:bg-[#5E5CE6]/20 transition-colors">
                    {feature.icon}
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                  <p className="text-white/50 text-sm leading-relaxed">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="relative z-10 py-8 border-t border-white/[0.08]">
          <div className="container text-center text-white/30 text-sm">
            © 2024 Todo. Built with Next.js
          </div>
        </footer>
      </main>
    )
  }

  // Dashboard
  const todos = await prisma.todo.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: 'desc' }
  })

  return (
    <main className="relative min-h-screen">
      <div className="gradient-blur" />
      <div className="grid-pattern" />
      <TodoInitializer todos={todos.map((t: any) => ({ ...t, date: t.date }))} />

      {/* Nav */}
      <nav className="sticky top-0 z-50 border-b border-white/[0.08] bg-black/50 backdrop-blur-xl">
        <div className="container h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#5E5CE6] flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div className="hidden sm:block">
              <p className="text-sm font-medium">{session.user.name}</p>
              <p className="text-xs text-white/40">{format(new Date(), 'M월 d일 EEEE', { locale: ko })}</p>
            </div>
          </div>
          <LoginButton variant="nav" />
        </div>
      </nav>

      {/* Dashboard Content */}
      <div className="relative z-10 container py-12">
        <div className="grid lg:grid-cols-5 gap-8 mb-12">
          {/* Calendar */}
          <div className="lg:col-span-2">
            <div className="glass-card p-6 sticky top-24">
              <CalendarView />
            </div>
          </div>

          {/* Todos */}
          <div className="lg:col-span-3 space-y-6">
            <TodoInput />
            <TodoList />
          </div>
        </div>

        {/* Analytics Section */}
        <section className="glass-card p-8">
          <MemoryGraph />
        </section>
      </div>
    </main>
  )
}
