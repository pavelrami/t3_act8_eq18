import { useEffect, useState } from 'react'
import Sidebar from '../components/Sidebar'
import Navbar from '../components/Navbar'
import Tareas from './Tareas'
import {
  obtenerTareas,
  agregarTarea,
  editarTarea,
  eliminarTarea,
} from '../services/tareasApi'
import '../styles/Dashboard.css'

export default function Dashboard({ usuario, onLogout }) {
  const [seccion, setSeccion] = useState(() => {
    const parametros = new URLSearchParams(window.location.search)
    return parametros.has('page') || parametros.has('limit') ? 'Mis tareas' : 'Dashboard'
  })
  const [tareas, setTareas] = useState([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState('')
  const [intento, setIntento] = useState(0)

  useEffect(() => {
    const controlador = new AbortController()
    async function cargarTareas() {
      setCargando(true)
      setError('')
      try {
        const registros = await obtenerTareas({ signal: controlador.signal })
        setTareas(registros)
      } catch (err) {
        if (err.name !== 'AbortError') {
          setError(err.message || 'No se pudieron cargar las tareas.')
        }
      } finally {
        if (!controlador.signal.aborted) setCargando(false)
      }
    }
    cargarTareas()
    return () => controlador.abort()
  }, [intento])

  // POST real, seguido de la actualizacion LOCAL.
  async function crearTarea({ todo, completed }) {
    const userId = Number(usuario.id) || 1
    const creadaPorAPI = await agregarTarea({ todo, completed, userId })
    setTareas((anteriores) => {
      // DummyJSON responde con el mismo ID en POST sucesivos.
      // Para las filas nuevas usamos un ID local, siempre unico.
      const siguienteId = Math.max(0, ...anteriores.map((t) => Number(t.id) || 0)) + 1
      const nuevaTarea = {
        ...creadaPorAPI,
        id: siguienteId,
        todo,
        completed,
        userId,
        esLocal: true,
      }
      return [nuevaTarea, ...anteriores]
    })
  }

  // PUT real para tareas existentes en DummyJSON; cambios locales para
  // registros nuevos que la API no conserva en su servidor.
  async function actualizarTarea(tarea, cambios) {
    if (!tarea.esLocal) {
      await editarTarea(tarea.id, cambios)
    }
    setTareas((anteriores) => anteriores.map((registro) =>
      registro.id === tarea.id ? { ...registro, ...cambios } : registro
    ))
  }

  // DELETE real para tareas originales; solo local para tareas de esta sesion.
  async function borrarTarea(tarea) {
    if (!tarea.esLocal) {
      await eliminarTarea(tarea.id)
    }
    setTareas((anteriores) => anteriores.filter((registro) => registro.id !== tarea.id))
  }

  const total = tareas.length
  const terminadas = tareas.filter((tarea) => tarea.completed).length
  const pendientes = total - terminadas
  const porcentaje = total > 0 ? `${Math.round((terminadas / total) * 100)}%` : '0%'
  const tarjetas = [
    { titulo: 'Tareas totales', valor: total },
    { titulo: 'Pendientes', valor: pendientes },
    { titulo: 'Terminadas', valor: terminadas },
    { titulo: 'Porcentaje completado', valor: porcentaje },
  ]

  return (
    <div className="app-shell">
      <Sidebar seccion={seccion} onNavigate={setSeccion} />
      <div className="app-content">
        <Navbar usuario={usuario} onLogout={onLogout} />
        <main className="dashboard-main">
          {seccion === 'Dashboard' ? (
            <>
              <h1>Dashboard</h1>
              <p className="dashboard-subtitle">Resumen general del sistema</p>
              <div className="stats-grid">
                {tarjetas.map(({ titulo, valor }) => (
                  <article className="stat-card" key={titulo}>
                    <span className="stat-label">{titulo}</span>
                    <strong className="stat-number">{cargando || error ? '--' : valor}</strong>
                  </article>
                ))}
              </div>
              {cargando && <p className="dashboard-note" role="status">Cargando estad&iacute;sticas...</p>}
              {error && (
                <div className="dashboard-note" role="alert">
                  {error} <button type="button" onClick={() => setIntento((n) => n + 1)}>Reintentar</button>
                </div>
              )}
              {!cargando && !error && (
                <p className="dashboard-note">Estad&iacute;sticas calculadas con DummyJSON y los cambios locales.</p>
              )}
            </>
          ) : seccion === 'Mis tareas' ? (
            <Tareas
              tareas={tareas}
              cargando={cargando}
              error={error}
              usuario={usuario}
              onReintentar={() => setIntento((n) => n + 1)}
              onCrear={crearTarea}
              onEditar={actualizarTarea}
              onEliminar={borrarTarea}
            />
          ) : (
            <>
              <h1>{seccion}</h1>
              <p className="dashboard-subtitle">Esta secci&oacute;n se desarrollar&aacute; m&aacute;s adelante.</p>
            </>
          )}
        </main>
      </div>
    </div>
  )
}
