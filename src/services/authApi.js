const AUTH_URL = 'https://dummyjson.com/auth/login'

export async function iniciarSesion(username, password) {
  let respuesta

  try {
    respuesta = await fetch(AUTH_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    })
  } catch {
    throw new Error('No se pudo conectar con DummyJSON. Revisa tu internet.')
  }

  let datos
  try {
    datos = await respuesta.json()
  } catch {
    throw new Error('La API respondio con un formato inesperado.')
  }

  if (!respuesta.ok) {
    if (respuesta.status === 400 || respuesta.status === 401) {
      throw new Error('Usuario o contrasena incorrectos.')
    }
    throw new Error(datos.message || 'No se pudo iniciar sesion.')
  }

  if (!datos.id || !datos.accessToken) {
    throw new Error('La respuesta de autenticacion esta incompleta.')
  }

  return datos
}
