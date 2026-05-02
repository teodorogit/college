import './App.css'
import { ToastProvider, Tabs } from '@heroui/react';
import CreateTask from './components/CreateTask';
import Tasks from './components/Tasks';

function App() {

  const windowWidth = window.innerWidth
  return (
    windowWidth > 768 ? (
      <div className="text-center p-3">
        <h1>Versão disponível apenas para <span className='font-bold'>celular.</span></h1>
      </div>
    ) : (
      <div className="container flex flex-col justify-center py-20 h-full">
        <div className='mb-6 border-b border-gray-200/75 pb-3 px-5'>
          <h1 className='text-2xl'>Bem vindo,</h1>
          <p className='text-gray-500/75'>Acompanhe seus prazos de entregas</p>
        </div>

        <Tabs className="px-3" variant='primary'>
          <Tabs.List className='bg-blue-100 shadow-md border-1 border-blue-200'>
            <Tabs.Tab id="active">Tarefas</Tabs.Tab>
            <Tabs.Tab id="expired">Prazos vencidos</Tabs.Tab>
          </Tabs.List>
          <div className='h-100 overflow-auto'>
            <Tabs.Panel id="active">
              <Tasks filter="active" />
            </Tabs.Panel>
            <Tabs.Panel id="expired">
              <Tasks filter="expired" />
            </Tabs.Panel>
          </div>
        </Tabs>

        <CreateTask />
        <ToastProvider />
      </div>
    )
  )
}

export default App
