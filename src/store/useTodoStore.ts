import { create } from 'zustand'

export interface Todo {
    id: string
    title: string
    completed: boolean
    date: Date
}

interface TodoStore {
    todos: Todo[]
    selectedDate: Date
    setSelectedDate: (date: Date) => void
    addTodo: (todo: Todo) => void
    toggleTodo: (id: string) => void
    setTodos: (todos: Todo[]) => void
}

export const useTodoStore = create<TodoStore>((set) => ({
    todos: [],
    selectedDate: new Date(),
    setSelectedDate: (date) => set({ selectedDate: date }),
    addTodo: (todo) => set((state) => {
        // Prevent duplicates
        if (state.todos.some(t => t.id === todo.id)) return state
        return { todos: [todo, ...state.todos] }
    }),
    toggleTodo: (id) => set((state) => ({
        todos: state.todos.map((t) =>
            t.id === id ? { ...t, completed: !t.completed } : t
        ),
    })),
    setTodos: (todos) => set((state) => {
        // Ensure uniqueness when setting todos from server
        const uniqueTodos = Array.from(new Map(todos.map(t => [t.id, t])).values())
        return { todos: uniqueTodos }
    }),
}))
