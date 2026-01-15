import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Calendar from './pages/Calendar'
import Respond from './pages/Respond'

function App() {
  return (
    <div className="min-h-screen">
      <header className="bg-indigo-600 text-white py-4 px-6 shadow-lg">
        <h1 className="text-2xl font-bold">
          <a href="/">GameNightly</a>
        </h1>
      </header>
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/calendar/:id" element={<Calendar />} />
          <Route path="/respond/:token" element={<Respond />} />
        </Routes>
      </main>
    </div>
  )
}

export default App
