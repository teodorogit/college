import { Button, Modal, toast } from '@heroui/react'
import { useDeleteTask } from '../../hooks/useDeleteTask'

type Props = {
  taskId: number;
  isOpen: boolean;
  onClose: () => void;
}

const DeleteTask = ({ taskId, isOpen, onClose }: Props) => {
  const { mutate: deleteTask } = useDeleteTask()

  const handleDelete = () => {
    deleteTask(taskId, { onSuccess: onClose })
    toast.success("Tarefa excluída com sucesso!")
  }

  return (
    <Modal isOpen={isOpen} onOpenChange={(open) => !open && onClose()} >
      <Modal.Backdrop>
        <Modal.Container placement='center'>
          <Modal.Dialog className="sm:max-w-[360px]">
            <Modal.CloseTrigger />
            <Modal.Header>
              <Modal.Heading>Excluir tarefa</Modal.Heading>
            </Modal.Header>
            <Modal.Body>
              <p>Tem certeza que deseja excluir esta tarefa?</p>
            </Modal.Body>
            <Modal.Footer>
              <Button className="w-full" onClick={onClose}>
                Cancelar
              </Button>
              <Button className="w-full" variant="danger" onClick={handleDelete}>
                Excluir
              </Button>
            </Modal.Footer>
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </Modal>
  )
}

export default DeleteTask
