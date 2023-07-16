
import './App.css'
import { Routes, Route } from 'react-router-dom'
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import { AuthProvider } from './auth/AuthContext'

function App() {


  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<HomePage />
        } />
        <Route path="/login" element={<LoginPage />} />
      </Routes>
    </AuthProvider>
  )
}

export default App
