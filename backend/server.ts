import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import { db } from './prisma'

const app = express()

app.use(cors())
app.use(express.json())

const MAX_ACTIVE_TASKS = 10
const MAX_TASKS_PER_DATE = 7

function dayRange(date: Date): { gte: Date; lte: Date } {
  const start = new Date(date)
  start.setHours(0, 0, 0, 0)
  const end = new Date(date)
  end.setHours(23, 59, 59, 999)
  return { gte: start, lte: end }
}

app.get('/tasks', async (_req, res) => {
  try {
    const cutoff = new Date()
    cutoff.setDate(cutoff.getDate() - 1)
    cutoff.setHours(0, 0, 0, 0)
    await db.task.deleteMany({ where: { date: { lt: cutoff } } })

    const tasks = await db.task.findMany({ orderBy: { date: 'asc' } })
    res.json(tasks)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Erro ao buscar tasks' })
  }
})

app.delete('/tasks/:id', async (req, res) => {
  const { id } = req.params
  const taskId = Number(id)
  if (isNaN(taskId)) {
    res.status(400).json({ error: 'ID inválido' })
    return
  }
  try {
    await db.task.delete({ where: { id: taskId } })
    res.json({ message: 'Task deletada com sucesso' })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Erro ao deletar task' })
  }
})

app.put('/tasks/:id', async (req, res) => {
  const { id } = req.params
  const taskId = Number(id)
  if (isNaN(taskId)) {
    res.status(400).json({ error: 'ID inválido' })
    return
  }

  const { subject, description, date } = req.body

  try {
    let parsedDate: Date | undefined

    if (date !== undefined) {
      parsedDate = new Date(date)
      if (isNaN(parsedDate.getTime())) {
        res.status(400).json({ error: 'Data inválida' })
        return
      }

      const sameDateCount = await db.task.count({
        where: { date: dayRange(parsedDate), id: { not: taskId } },
      })
      if (sameDateCount >= MAX_TASKS_PER_DATE) {
        res.status(422).json({
          error: `Limite atingido: máximo de ${MAX_TASKS_PER_DATE} tarefas com a mesma data de entrega`,
        })
        return
      }
    }

    const updated = await db.task.update({
      where: { id: taskId },
      data: {
        ...(subject && { subject }),
        ...(description && { description }),
        ...(parsedDate && { date: parsedDate }),
      },
    })
    res.json(updated)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Erro ao atualizar task' })
  }
})

app.post('/tasks', async (req, res) => {
  const { subject, description, date } = req.body

  if (!subject || !description || !date) {
    res.status(400).json({ error: 'Campos obrigatórios: subject, description, date' })
    return
  }

  const parsedDate = new Date(date)
  if (isNaN(parsedDate.getTime())) {
    res.status(400).json({ error: 'Data inválida' })
    return
  }

  try {
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const activeCount = await db.task.count({ where: { date: { gte: today } } })
    if (activeCount >= MAX_ACTIVE_TASKS) {
      res.status(422).json({
        error: `Limite atingido: máximo de ${MAX_ACTIVE_TASKS} atividades ativas cadastradas`,
      })
      return
    }

    const sameDateCount = await db.task.count({ where: { date: dayRange(parsedDate) } })
    if (sameDateCount >= MAX_TASKS_PER_DATE) {
      res.status(422).json({
        error: `Limite atingido: máximo de ${MAX_TASKS_PER_DATE} tarefas com a mesma data de entrega`,
      })
      return
    }

    const newTask = await db.task.create({
      data: { subject, description, date: parsedDate },
    })
    res.json(newTask)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Erro ao criar task' })
  }
})

app.listen(3000, () => {
  console.log('API rodando em http://localhost:3000')
})