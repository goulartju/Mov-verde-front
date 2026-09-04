
import { useEffect } from 'react'
import './App.css'
import { Routes } from './routes/routes'
import { Toaster } from 'sonner'
import { initAutoRefresh } from '@/services/token-refresh'

function App() {
  useEffect(() => {
    initAutoRefresh();
  }, []);

  return (
    <>
      <Routes />
      <Toaster />
    </>
  )
}

export default App
