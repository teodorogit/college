import { Button, Drawer, Input, Label, TextField, toast } from "@heroui/react";
import { Form, Formik, Field, type FormikHelpers } from "formik";
import * as Yup from "yup";
import { useUpdateTask } from "../../hooks/useUpdateTask";
import type { Task } from "../../types/task";

type Props = {
  task: Task;
  isOpen: boolean;
  onClose: () => void;
};

type FormValues = {
  subject: string;
  description: string;
  date: string;
};

const validationSchema = Yup.object().shape({
  subject: Yup.string()
    .min(4, "Mínimo 4 letras")
    .required("Matéria é obrigatória"),
  description: Yup.string()
    .min(10, "Mínimo 10 letras")
    .required("Descrição é obrigatória"),
  date: Yup.string()
    .required("Data é obrigatória")
    .test("date-validation", "Data não pode ser anterior ao dia atual", (value) => {
      if (!value) return false;
      const selected = new Date(value);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return selected >= today;
    }),
});

const EditTask = ({ task, isOpen, onClose }: Props) => {
  const { mutateAsync: updateTask } = useUpdateTask();
  const today = new Date().toISOString().split("T")[0];

  const initialValues: FormValues = {
    subject: task.subject,
    description: task.description,
    date: new Date(task.date).toISOString().split("T")[0],
  };

  const handleSubmit = async (values: FormValues, { resetForm }: FormikHelpers<FormValues>) => {
    await updateTask({ id: task.id, data: values });
    toast.success("Tarefa atualizada com sucesso!");
    resetForm();
    onClose();
  };

  return (
    <Drawer isOpen={isOpen} onOpenChange={(open) => !open && onClose()}>
      <Drawer.Backdrop>
        <Drawer.Content placement="right">
          <Drawer.Dialog>
            <Drawer.CloseTrigger />
            <Drawer.Header>
              <Drawer.Heading>Editar tarefa</Drawer.Heading>
            </Drawer.Header>
            <Drawer.Body>
              <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
                enableReinitialize
              >
                {({ errors, touched }) => (
                  <Form className="flex flex-col gap-4">
                    <div className="flex flex-col gap-1">
                      <TextField
                        id="subject"
                        className="w-full"
                        name="subject"
                        isInvalid={touched.subject && !!errors.subject}
                      >
                        <Label>Matéria</Label>
                        <Field
                          as={Input}
                          placeholder="Ex: Cálculo numérico"
                          variant="secondary"
                          name="subject"
                          id="subject"
                        />
                      </TextField>
                      {touched.subject && errors.subject && (
                        <span className="text-red-500 text-sm">{errors.subject}</span>
                      )}
                    </div>

                    <div className="flex flex-col gap-1">
                      <TextField
                        id="description"
                        className="w-full"
                        name="description"
                        isInvalid={touched.description && !!errors.description}
                      >
                        <Label>Descrição da tarefa</Label>
                        <Field
                          as={Input}
                          placeholder="Ex: Lista de exercícios"
                          variant="secondary"
                          name="description"
                          id="description"
                        />
                      </TextField>
                      {touched.description && errors.description && (
                        <span className="text-red-500 text-sm">{errors.description}</span>
                      )}
                    </div>

                    <div className="flex flex-col gap-1">
                      <TextField
                        id="date"
                        className="w-full"
                        name="date"
                        isInvalid={touched.date && !!errors.date}
                      >
                        <Label>Data de entrega</Label>
                        <Field
                          as={Input}
                          type="date"
                          variant="secondary"
                          name="date"
                          id="date"
                          min={today}
                        />
                      </TextField>
                      {touched.date && errors.date && (
                        <span className="text-red-500 text-sm">{errors.date}</span>
                      )}
                    </div>

                    <Button type="submit" className="w-full" variant="primary">
                      Salvar alterações
                    </Button>
                  </Form>
                )}
              </Formik>
            </Drawer.Body>
          </Drawer.Dialog>
        </Drawer.Content>
      </Drawer.Backdrop>
    </Drawer>
  );
};

export default EditTask;
