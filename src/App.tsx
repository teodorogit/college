import './App.css'
import { Card } from "@heroui/react";
import CreateTask from './components/CreateTask';

function App() {

  const windowWidth = window.innerWidth

  return (
    windowWidth > 768 ? (
      <div className="text-center p-3">
        <h1>Versão disponível apenas para <span className='font-bold'>celular.</span></h1>
      </div>
    ) : (
      <div className="container flex  flex-col justify-center py-20 border-2 h-full">
       <div className='mb-6 border-b border-gray-200/75 pb-3 px-5'>
        <h1 className='text-2xl'>Bem vindo,</h1>
        <p className='text-gray-500/75'>Acompanhe seus prazos de entregas</p>

       </div>
       <div className='grid grid-cols-2 p-3 gap-6'>
       <Card className="bg-yellow-200/75" >
      <Card.Header>
        <Card.Title >Webapi</Card.Title>
        <Card.Description className='flex flex-col'>
          Entrega: 20/05/2025
          Contagem: <span className='font-bold'>0</span>
        </Card.Description>
       </Card.Header>
       </Card>
       <Card className="bg-green-200/75" >
      <Card.Header>
        <Card.Title>Webapi</Card.Title>
        <Card.Description className='flex flex-col'>
          Entrega: 20/05/2025
          Contagem: <span className='font-bold'>0</span>
        </Card.Description>
       </Card.Header>
       </Card>
       </div>
       <CreateTask />
      </div>
    )
  )
}

export default App
