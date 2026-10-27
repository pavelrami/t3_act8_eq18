import { useEffect, useMemo, useState } from 'react'
import ModalTarea from '../components/ModalTarea'
import '../styles/Tareas.css'

const LIMITES = [10, 20, 40, 50]

function leerPaginacion() {
  const parametros = new URLSearchParams(window.location.search)
  const paginaRecibida = Number(parametros.get('page'))
  const limiteRecibido = Number(parametros.get('limit'))
  return {
    pagina: Number.isInteger(paginaRecibida) && paginaRecibida > 0 ? paginaRecibida : 1,
    limite: LIMITES.includes(limiteRecibido) ? limiteRecibido : 10,
  }
}

function escribirPaginacion(pagina, limite, reemplazar = false) {
  const url = new URL(window.location.href)
  url.searchParams.set('page', String(pagina))
  url.searchParams.set('limit', String(limite))
  window.history[reemplazar ? 'replaceState' : 'pushState']({}, '', url)
}

export default function Tareas({
  tareas, cargando, error, usuario, onReintentar,
  onCrear, onEditar, onEliminar,
}) {
  const [busqueda, setBusqueda] = useState('')
  const [estado, setEstado] = useState('todas')
  const [paginacion, setPaginacion] = useState(leerPaginacion)
  const [modal, setModal] = useState(null)
  const [guardando, setGuardando] = useState(false)
  const [errorModal, setErrorModal] = useState('')
  const [eliminandoId, setEliminandoId] = useState(null)
  const [aviso, setAviso] = useState(null)
  const { pagina, limite } = paginacion

  // La URL debe guardar la pagina inicial y la cantidad seleccionada.
  useEffect(() => {
    const parametros = new URLSearchParams(window.location.search)
    if (!parametros.has('page') || !parametros.has('limit')) {
      escribirPaginacion(pagina, limite, true)
    }
  }, [pagina, limite])

  // Sincroniza el componente cuando el usuario usa Atras/Adelante.
  useEffect(() => {
    const sincronizarConURL = () => setPaginacion(leerPaginacion())
    window.addEventListener('popstate', sincronizarConURL)
    return () => window.removeEventListener('popstate', sincronizarConURL)
  }, [])

  const tareasFiltradas = useMemo(() => {
    const texto = busqueda.toLocaleLowerCase().trim()
    return tareas.filter((tarea) => {
      const coincideTexto = tarea.todo.toLocaleLowerCase().includes(texto)
      const coincideEstado =
        estado === 'todas' ||
        (estado === 'terminadas' && tarea.completed) ||
        (estado === 'pendientes' && !tarea.completed)
      return coincideTexto && coincideEstado
    })
  }, [tareas, busqueda, estado])

  const totalPaginas = Math.max(1, Math.ceil(tareasFiltradas.length / limite))
  const paginaVisible = Math.min(pagina, totalPaginas)

  useEffect(() => {
    if (!cargando && !error && pagina > totalPaginas) {
      escribirPaginacion(totalPaginas, limite, true)
      setPaginacion({ pagina: totalPaginas, limite })
    }
  }, [pagina, limite, totalPaginas, cargando, error])

  const inicio = (paginaVisible - 1) * limite
  const visibles = tareasFiltradas.slice(inicio, inicio + limite)
  const primerRegistro = tareasFiltradas.length ? inicio + 1 : 0
  const ultimoRegistro = Math.min(inicio + limite, tareasFiltradas.length)

  // Mostrar hasta cinco NUMEROS de pagina que pueden recibir clic.
  const primeraPaginaBotones = Math.max(1, Math.min(paginaVisible - 2, totalPaginas - 4))
  const numerosPagina = Array.from(
    { length: Math.min(5, totalPaginas) },
    (_, indice) => primeraPaginaBotones + indice
  )

  function cambiarPagina(nuevaPagina, reemplazar = false) {
    if (nuevaPagina < 1 || nuevaPagina > totalPaginas) return
    if (nuevaPagina === paginaVisible) return
    escribirPaginacion(nuevaPagina, limite, reemplazar)
    setPaginacion({ pagina: nuevaPagina, limite })
  }

  function cambiarLimite(evento) {
    const nuevoLimite = Number(evento.target.value)
    escribirPaginacion(1, nuevoLimite)
    setPaginacion({ pagina: 1, limite: nuevoLimite })
  }

  function reiniciarPaginaAlFiltrar() {
    if (paginaVisible !== 1) {
      escribirPaginacion(1, limite, true)
      setPaginacion({ pagina: 1, limite })
    }
  }

  function abrirModal(tarea = null) {
    setAviso(null)
    setErrorModal('')
    setModal({ tipo: tarea ? 'editar' : 'crear', tarea })
  }

  async function guardarModal(datos) {
    if (!modal || guardando) return
    if (modal.tipo === 'editar') {
      const confirmado = window.confirm('Estas seguro de guardar los cambios de esta tarea?')
      if (!confirmado) return
    }
    setGuardando(true)
    setErrorModal('')
    try {
      if (modal.tipo === 'crear') {
        await onCrear(datos)
        setBusqueda('')
        setEstado('todas')
        if (paginaVisible !== 1) {
          escribirPaginacion(1, limite, true)
          setPaginacion({ pagina: 1, limite })
        }
        setAviso({ tipo: 'exito', texto: 'Tarea agregada con POST y mostrada en la tabla local.' })
      } else {
        await onEditar(modal.tarea, datos)
        setAviso({
          tipo: 'exito',
          texto: modal.tarea.esLocal
            ? 'Tarea de esta sesion editada localmente (no existe en el servidor).'
            : 'Tarea actualizada con PUT y reflejada en la tabla.',
        })
      }
      setModal(null)
    } catch (err) {
      setErrorModal(err.message || 'No se pudo guardar la tarea.')
    } finally {
      setGuardando(false)
    }
  }

  async function confirmarEliminar(tarea) {
    if (eliminandoId !== null) return
    const confirmado = window.confirm(`Eliminar la tarea #${tarea.id}? Esta accion la quitara de la tabla.`)
    if (!confirmado) return
    setAviso(null)
    setEliminandoId(tarea.id)
    try {
      await onEliminar(tarea)
      setAviso({
        tipo: 'exito',
        texto: tarea.esLocal
          ? 'Tarea de esta sesion eliminada localmente (no existe en el servidor).'
          : 'DELETE confirmado por la API; tarea eliminada de la tabla local.',
      })
    } catch (err) {
      setAviso({ tipo: 'error', texto: err.message || 'No se pudo eliminar la tarea.' })
    } finally {
      setEliminandoId(null)
    }
  }

  return (
    <section className="tareas-page">
      <div className="tareas-encabezado">
        <div>
          <h1>Gesti&oacute;n de tareas</h1>
          <p className="dashboard-subtitle">Consulta y organiza las tareas del sistema</p>
        </div>
        <button className="tarea-boton-primario" type="button" onClick={() => abrirModal()} disabled={cargando || Boolean(error)}>
          + Nueva tarea
        </button>
      </div>

      <div className="tareas-panel">
        {aviso && (
          <div className={`tareas-aviso ${aviso.tipo === 'error' ? 'es-error' : 'es-exito'}`} role={aviso.tipo === 'error' ? 'alert' : 'status'}>
            {aviso.texto}
            <button type="button" onClick={() => setAviso(null)} aria-label="Ocultar mensaje">&times;</button>
          </div>
        )}
        <div className="tareas-toolbar">
          <div className="tareas-filter">
            <label htmlFor="buscar-tarea">Buscar tarea</label>
            <input id="buscar-tarea" type="search" placeholder="Buscar por nombre o descripcion..." value={busqueda}
              onChange={(evento) => { setBusqueda(evento.target.value); reiniciarPaginaAlFiltrar() }} />
          </div>
          <div className="tareas-filter">
            <label htmlFor="filtrar-estado">Estado</label>
            <select id="filtrar-estado" value={estado}
              onChange={(evento) => { setEstado(evento.target.value); reiniciarPaginaAlFiltrar() }}>
              <option value="todas">Todos los estados</option>
              <option value="pendientes">Pendientes</option>
              <option value="terminadas">Terminadas</option>
            </select>
          </div>
        </div>

        {cargando ? (
          <p className="tareas-feedback" role="status">Cargando tareas desde DummyJSON...</p>
        ) : error ? (
          <div className="tareas-feedback tareas-error" role="alert">
            <p>{error}</p><button type="button" onClick={onReintentar}>Reintentar</button>
          </div>
        ) : (
          <>
            <div className="tareas-scroll">
              <table className="tareas-tabla">
                <thead>
                  <tr>
                    <th scope="col">ID</th>
                    <th scope="col">Descripci&oacute;n de la tarea</th>
                    <th scope="col">Usuario</th>
                    <th scope="col">Estado</th>
                    <th scope="col">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {visibles.map((tarea) => (
                    <tr key={tarea.id}>
                      <td>{tarea.id}{tarea.esLocal && <small className="tarea-local" title="Solo existe en esta sesion">Local</small>}</td>
                      <td>{tarea.todo}</td>
                      <td>{tarea.userId}</td>
                      <td><span className={`tarea-estado ${tarea.completed ? 'completada' : 'pendiente'}`}>
                        {tarea.completed ? 'Terminada' : 'Pendiente'}
                      </span></td>
                      <td>
                        <div className="tarea-acciones">
                          <button type="button" className="tarea-editar" disabled={eliminandoId !== null}
                            aria-label={`Editar tarea ${tarea.id}`} onClick={() => abrirModal(tarea)}>Editar</button>
                          <button type="button" className="tarea-eliminar" disabled={eliminandoId !== null}
                            aria-label={`Eliminar tarea ${tarea.id}`} onClick={() => confirmarEliminar(tarea)}>
                            {eliminandoId === tarea.id ? 'Eliminando...' : 'Eliminar'}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {visibles.length === 0 && (
                    <tr><td colSpan="5" className="tareas-vacio">No hay tareas que coincidan con los filtros.</td></tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="tareas-footer">
              <div className="tareas-resumen" aria-live="polite">Mostrando {primerRegistro}-{ultimoRegistro} de {tareasFiltradas.length} tareas</div>
              <div className="tareas-controles">
                <label htmlFor="cantidad-tareas">Mostrar</label>
                <select id="cantidad-tareas" value={limite} onChange={cambiarLimite}>
                  {LIMITES.map((valor) => <option key={valor} value={valor}>{valor}</option>)}
                </select>
                <button type="button" className="tareas-pagina" onClick={() => cambiarPagina(paginaVisible - 1)} disabled={paginaVisible === 1} aria-label="Pagina anterior">&larr;</button>
                {numerosPagina.map((numero) => (
                  <button key={numero} type="button" className={`tareas-pagina ${numero === paginaVisible ? 'actual' : ''}`}
                    onClick={() => cambiarPagina(numero)} aria-current={numero === paginaVisible ? 'page' : undefined}>{numero}</button>
                ))}
                <button type="button" className="tareas-pagina" onClick={() => cambiarPagina(paginaVisible + 1)} disabled={paginaVisible === totalPaginas} aria-label="Pagina siguiente">&rarr;</button>
              </div>
            </div>
          </>
        )}
      </div>
      <p className="tareas-nota">DummyJSON simula las escrituras. Los cambios se conservan durante esta sesi&oacute;n; al recargar pueden perderse.</p>
      {modal && <ModalTarea key={modal.tarea?.id ?? 'nueva'} tarea={modal.tarea} userId={usuario.id}
        guardando={guardando} error={errorModal} onGuardar={guardarModal} onCerrar={() => { if (!guardando) setModal(null) }} />}
    </section>
  )
}
