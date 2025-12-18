"use client"

import { useEffect } from 'react'
import { Todo, useTodoStore } from '@/store/useTodoStore'

export default function TodoInitializer({ todos }: { todos: Todo[] }) {
    const { setTodos } = useTodoStore()

    useEffect(() => {
        setTodos(todos)
    }, [todos, setTodos])

    return null
}
