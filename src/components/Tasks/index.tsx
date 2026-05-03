import { Card, CloseIcon } from '@heroui/react'
import { useState } from 'react'
import { useTasks } from '../../hooks/useTasks'
import type { Task } from '../../types/task'
import DeleteTask from '../DeleteTask'
import EditTask from '../EditTask'
import TaskDetails from '../TaskDetails'

const PencilIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className={`w-4 h-4 ${className ?? ''}`}>
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
  </svg>
)

type Props = {
  filter: 'active' | 'expired'
}

const colorTasks = ["border-b-yellow-200", "border-b-green-200", "border-b-blue-200"]
const textColors  = ["text-yellow-900",    "text-green-900",    "text-blue-900"]

const getDiffDays = (date: string) => {
  const today = new Date()
  const taskDate = new Date(date)
  return Math.ceil((taskDate.getTime() - today.getTime()) / (1000 * 3600 * 24))
}

const Tasks = ({ filter }: Props) => {
  const { data: allTasks = [] } = useTasks()
  const [selectedTaskId, setSelectedTaskId] = useState<number | null>(null)
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  const [editingTask, setEditingTask] = useState<Task | null>(null)

  const tasks = allTasks.filter((task: Task) =>
    filter === 'active' ? getDiffDays(task.date ) >= 0 : getDiffDays(task.date ) < 0
  )

  const isWarning = (task: Task) => {
    const d = getDiffDays(task.date )
    return d <= 3 && d >= 0
  }

  const formatRemaining = (date: string): string => {
    const d = getDiffDays(date)
    if (d < 0) return `Venceu há ${Math.abs(d)} dia${Math.abs(d) !== 1 ? 's' : ''}`
    if (d === 0) return 'Vence hoje'
    return `${d} dia${d !== 1 ? 's' : ''} restante${d !== 1 ? 's' : ''}`
  }

  if (tasks.length === 0) {
    return (
      <div className="text-center w-full py-10 text-gray-400">
        {filter === 'active' ? 'Nenhuma tarefa encontrada' : 'Nenhum prazo vencido'}
      </div>
    )
  }

  return (
    <>
      <div className='grid grid-cols-1 p-3 gap-3 w-full'>
        {tasks.map((task: Task) => {
          const colorIndex = task.id % colorTasks.length
          const textColor = textColors[colorIndex]
          const expired = filter === 'expired'
          return (
            <Card
              key={task.id}
              className={`${expired ? 'border-b-red-400 opacity-75' : isWarning(task) ? ' border-red-400/50' : colorTasks[colorIndex]} border shadow-sm border-b-5 justify-between`}
              onClick={() => setSelectedTask(task)}
            >
              <Card.Header>
                <Card.Title className={`uppercase flex w-full justify-between ${expired ? 'text-red-700' : textColor}`}>
                  {task.subject}
                  <div className="flex gap-1">
                    <button onClick={(e) => { e.stopPropagation(); setEditingTask(task) }}>
                      <PencilIcon  className={expired ? 'text-red-700' : textColor } />
                    </button>
                    <button onClick={(e) => { e.stopPropagation(); setSelectedTaskId(task.id) }}>
                      <CloseIcon className={expired ? 'text-red-700' : textColor} />
                    </button>
                  </div>
                </Card.Title>
              </Card.Header>
              <Card.Description className={`flex flex-col ${expired ? 'text-red-600' : textColor}`}>
                <p>Entrega: {new Date(task.date).toLocaleDateString('pt-BR')}</p>
                <p>{formatRemaining(task.date )}</p>
              </Card.Description>
            </Card>
          )
        })}
      </div>

      {selectedTaskId !== null && (
        <DeleteTask
          taskId={selectedTaskId}
          isOpen={selectedTaskId !== null}
          onClose={() => setSelectedTaskId(null)}
        />
      )}

      {editingTask !== null && (
        <EditTask
          task={editingTask}
          isOpen={editingTask !== null}
          onClose={() => setEditingTask(null)}
        />
      )}

      {selectedTask !== null && (
        <TaskDetails
          task={selectedTask}
          isOpen={selectedTask !== null}
          onClose={() => setSelectedTask(null)}
        />
      )}
    </>
  )
}

export default Tasks
