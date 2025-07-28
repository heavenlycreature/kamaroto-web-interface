import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div className="flex items-center justify-center h-screen bg-gradient-to-r from-purple-500 via-pink-500 to-red-500">
      <div className="text-white text-5xl font-extrabold drop-shadow-lg animate-pulse">
        👋 Hello, World!
      </div>
    </div>
    </>
  )
}

export default App
