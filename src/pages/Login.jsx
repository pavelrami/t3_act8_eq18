import { useState } from 'react'
import { iniciarSesion } from '../services/authApi'
import '../styles/Login.css'

export default function Login({ onLogin }) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(evento) {
    evento.preventDefault()
    setError('')

    if (!username.trim() || !password.trim()) {
      setError('Completa el usuario y la contrasena.')
      return
    }

    setLoading(true)
    try {
      const datosUsuario = await iniciarSesion(username.trim(), password)
      onLogin(datosUsuario)
    } catch (err) {
      setError(err.message || 'Ocurrio un error al iniciar sesion.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="login-page">
      <section className="login-brand" aria-label="Presentacion del sistema">
        <div className="login-brand-content">
          <h1>Gestiona todo desde un solo lugar</h1>
          <p>Administraci&oacute;n sencilla, segura y eficiente</p>
        </div>
      </section>

      <section className="login-panel">
        <div className="login-content">
          <header className="login-heading">
            <h2>Bienvenido</h2>
            <p>Ingresa tus credenciales</p>
          </header>

          <form onSubmit={handleSubmit} noValidate>
            <div className="login-field">
              <label htmlFor="username">Usuario</label>
              <input
                id="username"
                name="username"
                type="text"
                autoComplete="username"
                placeholder="emilys"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                disabled={loading}
              />
            </div>

            <div className="login-field">
              <label htmlFor="password">Contrase&ntilde;a</label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                placeholder="Escribe tu contrase&ntilde;a"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
              />
            </div>

            {error && <p className="login-error" role="alert">{error}</p>}

            <button className="login-submit" type="submit" disabled={loading}>
              {loading ? 'Validando...' : 'Entrar'}
            </button>
            <p className="login-help">&iquest;Olvidaste tu contrase&ntilde;a?</p>
          </form>
        </div>
      </section>
    </main>
  )
}
