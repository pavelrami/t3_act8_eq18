import { useState } from 'react'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'

export default function App() {
  const [usuario, setUsuario] = useState(null)

  return usuario ? (
    <Dashboard
      usuario={usuario}
      onLogout={() => setUsuario(null)}
    />
  ) : (
    <Login onLogin={setUsuario} />
  )
}
