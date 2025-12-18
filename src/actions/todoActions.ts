"use server"

import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"

export async function createTodo(title: string, date: Date) {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) throw new Error("Unauthorized")

    await prisma.todo.create({
        data: {
            title,
            date,
            userId: session.user.id
        }
    })
    revalidatePath('/')
}

export async function toggleTodo(id: string) {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) throw new Error("Unauthorized")

    const todo = await prisma.todo.findUnique({ where: { id } })
    if (!todo || todo.userId !== session.user.id) throw new Error("Unauthorized")

    await prisma.todo.update({
        where: { id },
        data: { completed: !todo.completed }
    })
    revalidatePath('/')
}

export async function deleteTodo(id: string) {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) throw new Error("Unauthorized")

    const todo = await prisma.todo.findUnique({ where: { id } })
    if (!todo || todo.userId !== session.user.id) throw new Error("Unauthorized")

    await prisma.todo.delete({ where: { id } })
    revalidatePath('/')
}
