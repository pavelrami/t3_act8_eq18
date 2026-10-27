const API = 'https://dummyjson.com/todos'

// Todas las llamadas HTTP se realizan aqui, nunca directamente desde la tabla.
async function solicitarJSON(url, opciones = {}, mensaje = 'No se pudo completar la operacion.') {
  let respuesta
  try {
    respuesta = await fetch(url, opciones)
  } catch (error) {
    if (error.name === 'AbortError') throw error
    throw new Error('No hay conexion con DummyJSON. Comprueba tu internet.')
  }

  if (!respuesta.ok) {
    throw new Error(`${mensaje} (HTTP ${respuesta.status}).`)
  }

  try {
    return await respuesta.json()
  } catch {
    throw new Error('DummyJSON devolvio una respuesta no valida.')
  }
}

export async function obtenerTareas({ signal } = {}) {
  const datos = await solicitarJSON(
    `${API}?limit=0`,
    { signal },
    'No se pudieron consultar las tareas.'
  )
  if (!Array.isArray(datos.todos)) {
    throw new Error('La API no devolvio una lista de tareas.')
  }
  return datos.todos
}

export async function agregarTarea({ todo, completed, userId }) {
  const datos = await solicitarJSON(
    `${API}/add`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ todo, completed, userId }),
    },
    'No se pudo agregar la tarea.'
  )
  if (datos.id == null || typeof datos.todo !== 'string') {
    throw new Error('La API no confirmo la creacion de la tarea.')
  }
  return datos
}

export async function editarTarea(id, { todo, completed }) {
  const datos = await solicitarJSON(
    `${API}/${id}`,
    {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ todo, completed }),
    },
    'No se pudo actualizar la tarea.'
  )
  if (datos.id == null) {
    throw new Error('La API no confirmo la actualizacion.')
  }
  return datos
}

export async function eliminarTarea(id) {
  const datos = await solicitarJSON(
    `${API}/${id}`,
    { method: 'DELETE' },
    'No se pudo eliminar la tarea.'
  )
  if (datos.isDeleted !== true) {
    throw new Error('La API no confirmo que la tarea se elimino.')
  }
  return datos
}
