
import './App.css'
import { DataProvider } from './context/DataContext'
import { Routes } from './routes/routes'

function App() {


  return (
    <>
      <DataProvider>
        <Routes />
      </DataProvider>
    </>
  )
}

export default App
