import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    const todos = await prisma.todo.findMany()
    console.log(`Total todos: ${todos.length}`)

    const ids = todos.map(t => t.id)
    const duplicates = ids.filter((item, index) => ids.indexOf(item) !== index)
    const emptyIds = ids.filter(id => !id || id === '')

    if (duplicates.length > 0) {
        console.log('Found duplicate IDs:', duplicates)
    } else {
        console.log('No duplicate IDs found.')
    }

    if (emptyIds.length > 0) {
        console.log('Found empty IDs:', emptyIds.length)
    } else {
        console.log('No empty IDs found.')
    }
}

main()
    .catch(e => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
