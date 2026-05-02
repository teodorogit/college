import { Modal, Button } from '@heroui/react'
import type { Task } from '../../types/task'

type Props = {
  task: Task;
  isOpen: boolean;
  onClose: () => void;
}

const urgencyConfig = (diffDays: number) => {
  if (diffDays < 0)  return { label: 'Vencido',  bg: 'bg-gray-100',   text: 'text-gray-700',   bar: 'bg-gray-500',   width: 'w-full' }
  if (diffDays <= 3) return { label: 'Urgente',  bg: 'bg-red-100', text: 'text-red-700', bar: 'bg-red-400', width: 'w-3/4' }
  if (diffDays <= 7) return { label: 'Em breve', bg: 'bg-yellow-100', text: 'text-yellow-700', bar: 'bg-yellow-400', width: 'w-1/2' }
  return               { label: 'Tranquilo', bg: 'bg-green-100',  text: 'text-green-700',  bar: 'bg-green-400',  width: 'w-1/4' }
}

const TaskDetails = ({ task, isOpen, onClose }: Props) => {
  const today = new Date()
  const taskDate = new Date(task.date)
  const diffDays = Math.ceil((taskDate.getTime() - today.getTime()) / (1000 * 3600 * 24))
  const urgency = urgencyConfig(diffDays)

  const formattedDate = taskDate.toLocaleDateString('pt-BR', {
    weekday: 'long',
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  })

  const remainingLabel = diffDays < 0
    ? `Venceu há ${Math.abs(diffDays)} dia${Math.abs(diffDays) !== 1 ? 's' : ''}`
    : diffDays === 0
    ? 'Vence hoje'
    : `${diffDays} dia${diffDays !== 1 ? 's' : ''} restante${diffDays !== 1 ? 's' : ''}`

  return (
    <Modal isOpen={isOpen} onOpenChange={(open) => !open && onClose()}>
      <Modal.Backdrop>
        <Modal.Container placement="center">
          <Modal.Dialog className="w-full max-w-sm rounded-2xl overflow-hidden p-0">
            <Modal.CloseTrigger />

            <div className="h-2 w-full bg-gray-100">
              <div className={`h-full ${urgency.bar} ${urgency.width} transition-all duration-500`} />
            </div>

            <div className="px-5 pt-4 pb-2">
              <span className={`inline-block text-xs font-semibold px-2 py-0.5 rounded-full ${urgency.bg} ${urgency.text}`}>
                {urgency.label}
              </span>
            </div>

            <Modal.Header className="px-5 pt-1 pb-0">
              <Modal.Heading className="text-xl font-bold uppercase tracking-wide">
                {task.subject}
              </Modal.Heading>
            </Modal.Header>

            <Modal.Body className="px-5 pt-3 pb-4 flex flex-col gap-4">
              <div>
                <p className="text-xs text-gray-400 uppercase font-semibold mb-1">Descrição</p>
                <p className="text-sm text-gray-700 leading-relaxed truncate    ">{task.description}</p>
              </div>

              <div className="flex flex-col gap-1">
                <p className="text-xs text-gray-400 uppercase font-semibold">Data de entrega</p>
                <p className="text-sm text-gray-700 capitalize">{formattedDate}</p>
              </div>

              <div className={`flex items-center justify-between rounded-xl px-4 py-3 ${urgency.bg}`}>
                <span className={`text-sm font-semibold ${urgency.text}`}>{remainingLabel}</span>
                <span className={`text-2xl font-bold ${urgency.text}`}>
                  {diffDays < 0 ? '⚠' : diffDays === 0 ? '🔔' : '📅'}
                </span>
              </div>
            </Modal.Body>

            <Modal.Footer className="px-5 pb-5">
              <Button className="w-full" variant="secondary" onClick={onClose}>
                Fechar
              </Button>
            </Modal.Footer>
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </Modal>
  )
}

export default TaskDetails
