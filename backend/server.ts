import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import { db } from './prisma'

const app = express()

app.use(cors())
app.use(express.json())

app.get('/tasks', async (req, res) => {
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
  try {
    await db.task.delete({ where: { id: Number(id) } })
    res.json({ message: 'Task deletada com sucesso' })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Erro ao deletar task' })
  }
})

app.post('/tasks', async (req, res) => {
  const  { subject, description, date} = req.body
  try {
    const newTask = await db.task.create({
      data: {
        subject,
        description,
        date: new Date(date)
      }
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