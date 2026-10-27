import { useState } from 'react'

// El mismo formulario sirve para CREAR y EDITAR una tarea.
export default function ModalTarea({ tarea, userId, onGuardar, onCerrar, guardando, error }) {
  const editando = Boolean(tarea)
  const [descripcion, setDescripcion] = useState(tarea?.todo ?? '')
  const [estado, setEstado] = useState(tarea?.completed ? 'terminada' : 'pendiente')
  const [validacion, setValidacion] = useState('')

  function enviarFormulario(evento) {
    evento.preventDefault()
    const todo = descripcion.trim()
    if (!todo) {
      setValidacion('Escribe una descripcion para la tarea.')
      return
    }
    if (todo.length < 3) {
      setValidacion('La descripcion debe tener al menos 3 caracteres.')
      return
    }
    setValidacion('')
    onGuardar({ todo, completed: estado === 'terminada' })
  }

  return (
    <div className="modal-fondo" onMouseDown={(evento) => {
      if (evento.target === evento.currentTarget && !guardando) onCerrar()
    }}>
      <div className="modal-tarea" role="dialog" aria-modal="true" aria-labelledby="modal-titulo">
        <div className="modal-titulo-fila">
          <div>
            <h2 id="modal-titulo">{editando ? 'Editar tarea' : 'Nueva tarea'}</h2>
            <p>{editando ? 'Modifica los datos de la tarea.' : 'Agrega una actividad a tu lista.'}</p>
          </div>
          <button className="modal-cerrar" type="button" onClick={onCerrar} disabled={guardando} aria-label="Cerrar formulario">
            &times;
          </button>
        </div>

        <form onSubmit={enviarFormulario}>
          <label className="modal-etiqueta" htmlFor="modal-descripcion">Descripci&oacute;n de la tarea</label>
          <textarea
            id="modal-descripcion"
            value={descripcion}
            maxLength={200}
            rows={3}
            placeholder="Ej. Estudiar para el examen de programacion"
            onChange={(evento) => setDescripcion(evento.target.value)}
            disabled={guardando}
            autoFocus
          />
          <label className="modal-etiqueta" htmlFor="modal-estado">Estado</label>
          <select id="modal-estado" value={estado} onChange={(evento) => setEstado(evento.target.value)} disabled={guardando}>
            <option value="pendiente">Pendiente</option>
            <option value="terminada">Terminada</option>
          </select>
          <p className="modal-ayuda">
            Usuario asociado: {editando ? tarea.userId : userId}
          </p>
          {editando && tarea.esLocal && (
            <p className="modal-aviso">Esta tarea se cre&oacute; en esta sesi&oacute;n y solo existe en el navegador. Sus cambios ser&aacute;n locales.</p>
          )}
          {(validacion || error) && <p className="modal-error" role="alert">{validacion || error}</p>}
          <div className="modal-botones">
            <button type="button" className="tarea-boton-secundario" onClick={onCerrar} disabled={guardando}>Cancelar</button>
            <button type="submit" className="tarea-boton-primario" disabled={guardando}>
              {guardando ? 'Guardando...' : editando ? 'Guardar cambios' : 'Agregar tarea'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
