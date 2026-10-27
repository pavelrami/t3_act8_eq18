# Gestor de Tareas Academicas - Actividad 8 (Equipo 18)

Mini sistema web desarrollado en **React + Vite** para consumir APIs externas,
simular un inicio de sesion y gestionar una tabla de tareas con filtros,
paginacion y operaciones CRUD.

## Integrantes

- **Integrante 1:** [NOMBRE COMPLETO]
- **Integrante 2:** [NOMBRE COMPLETO]

## Enlaces de entrega

- **Repositorio GitHub:** [PEGAR URL DEL REPOSITORIO]
- **Aplicacion desplegada en VPS:** http://[IP_DEL_VPS]/t3_act8_eq18/

> Sustituir los textos entre corchetes por los datos reales antes de entregar.

## Tecnologias

- React (componentes y estado con `useState`)
- Vite (entorno de desarrollo y build)
- JavaScript / JSX
- CSS
- `fetch` para el consumo de APIs
- Git y GitHub para control de versiones
- VPS con Nginx para el despliegue

## APIs de terceros

**Autenticacion:** [DummyJSON Auth](https://dummyjson.com/docs/auth)

- `POST https://dummyjson.com/auth/login`
- Credenciales publicas para probar: `emilys` / `emilyspass`

**Tabla de tareas:** [DummyJSON Todos](https://dummyjson.com/docs/todos)

- `GET https://dummyjson.com/todos?limit=0` - consultar tareas
- `POST https://dummyjson.com/todos/add` - simular creacion
- `PUT https://dummyjson.com/todos/:id` - simular edicion
- `DELETE https://dummyjson.com/todos/:id` - simular eliminacion

## Funcionalidades

- Login con validacion de campos y manejo de credenciales invalidas.
- Vista del sistema condicionada por el estado de sesion.
- Sidebar y navbar con nombre, fotografia y opcion Cerrar sesion.
- Dashboard con estadisticas calculadas a partir de las tareas.
- Tabla con filtro de texto y filtro por estado.
- Paginacion de 10, 20, 40 o 50 tareas con `?page=N&limit=N` en la URL.
- Indicadores de carga y errores de la API.
- Crear, editar y eliminar tareas con confirmacion cuando corresponde.
- Actualizacion de la tabla mediante el estado local de React.

## Consideraciones sobre la API

**DummyJSON simula las escrituras y no guarda permanentemente las modificaciones.**
Las acciones POST, PUT y DELETE se prueban con peticiones HTTP reales para tareas
existentes en la API; despues se actualiza el estado local de React. Las tareas
nuevas se distinguen como *locales* porque el servidor no las conserva; su
edicion y eliminacion posteriores ocurren solo en el estado local de la sesion.
Al recargar, estos cambios locales pueden perderse.

## Estructura de carpetas

```text
src/
  components/    # Sidebar, Navbar y modal reutilizable
  pages/         # Login, Dashboard y Gestion de tareas
  services/      # Llamadas fetch a DummyJSON
  styles/        # Hojas de estilo CSS
  App.jsx        # Estado de sesion y seleccion de vista
  main.jsx       # Punto de entrada
```

## Ejecucion local

1. Instalar Node.js y npm.
2. Clonar el repositorio y entrar a la carpeta.
3. Instalar dependencias:

```bash
npm install
```

4. Iniciar el entorno de desarrollo:

```bash
npm run dev
```

Con `base: '/t3_act8_eq18/'`, abrir la direccion indicada por Vite,
normalmente `http://localhost:5173/t3_act8_eq18/`.

## Compilacion para produccion

```bash
npm run build
npm run preview
```

La carpeta `dist/` contiene los archivos estaticos que deben publicarse
en el VPS, bajo la ruta `/t3_act8_eq18/`.

## Pruebas sugeridas

1. Login vacio y con contraseña incorrecta; comprobar mensajes de error.
2. Login valido; comprobar nombre y fotografia en la navbar.
3. Ir a Mis tareas; observar la tabla y probar filtros de texto y estado.
4. Probar los limites 10, 20, 40, 50 y verificar `page` / `limit` en la URL.
5. Crear una tarea y comprobar que aparece en la tabla.
6. Editar y eliminar tareas **originales** de DummyJSON; verificar PUT/DELETE
   en DevTools > Network y los mensajes de confirmacion.
7. Volver al Dashboard y comprobar que cambian las estadisticas.
8. Cerrar sesion y verificar que vuelve al Login.
9. Verificar desde la URL publica del VPS en una ventana privada.

## Nota academica

Proyecto realizado para la **Actividad 8: Consumo de APIs de Terceros - Login y Sistema con Tabla CRUD**.
El prototipo visual se realizo previamente en Figma.
