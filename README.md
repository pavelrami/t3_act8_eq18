### Gestor de Tareas Académicas - Actividad 8 (Equipo 18)

Mini sistema web desarrollado con React y Vite para consumir APIs externas, simular un inicio de sesión y administrar una tabla de tareas con filtros, paginación y operaciones CRUD.

### Integrantes

- Integrante 1: Carlos Pavel
- Integrante 2: Pérez Jiménez Xana Amalinalli

### Tecnologías

- React (componentes y estado con useState)
- Vite (entorno de desarrollo y build)
- JavaScript / JSX
- CSS
- fetch para el consumo de APIs
- Git y GitHub para control de versiones
- VPS con Nginx para el despliegue

### APIs de terceros

Autenticación: DummyJSON Auth (https://dummyjson.com/docs/auth)
- POST https://dummyjson.com/auth/login
- Credenciales públicas para probar: emilys / emilyspass

Tabla de tareas: DummyJSON Todos (https://dummyjson.com/docs/todos)
- GET https://dummyjson.com/todos?limit=0 - consultar tareas
- POST https://dummyjson.com/todos/add - simular creación
- PUT https://dummyjson.com/todos/:id - simular edición
- DELETE https://dummyjson.com/todos/:id - simular eliminación

### Funcionalidades

- Login con validación de campos y manejo de credenciales inválidas.
- Vista del sistema condicionada por el estado de sesión.
- Sidebar y navbar con nombre, fotografía y opción Cerrar sesión.
- Dashboard con estadísticas calculadas a partir de las tareas.
- Tabla con filtro de texto y filtro por estado.
- Paginación de 10, 20, 40 o 50 tareas con ?page=N&limit=N en la URL.
- Indicadores de carga y errores de la API.
- Crear, editar y eliminar tareas con confirmación cuando corresponde.
- Actualización de la tabla mediante el estado local de React.

### Consideraciones sobre la API

DummyJSON simula las escrituras y no guarda permanentemente las modificaciones. Las acciones POST, PUT y DELETE se prueban con peticiones HTTP reales para tareas existentes en la API; después se actualiza el estado local de React. Las tareas nuevas se distinguen como locales porque el servidor no las conserva; su edición y eliminación posteriores ocurren solo en el estado local de la sesión. Al recargar, estos cambios locales pueden perderse.

### Estructura de carpetas

src/
  components/
  pages/
  services/
  styles/
  App.jsx
  main.jsx

### Ejecución local

1. Instalar Node.js y npm.
2. Clonar el repositorio y entrar a la carpeta.
3. Instalar dependencias:
   npm install
4. Iniciar el entorno de desarrollo:
   npm run dev

Con base: '/t3_act8_eq18/', abrir la dirección indicada por Vite, normalmente http://localhost:5173/t3_act8_eq18/.

### Compilación para producción

npm run build
npm run preview

La carpeta dist/ contiene los archivos estáticos que deben publicarse en el VPS, bajo la ruta /t3_act8_eq18/.

### Pruebas sugeridas

1. Login vacío y con contraseña incorrecta; comprobar mensajes de error.
2. Login válido; comprobar nombre y fotografía en la navbar.
3. Ir a Mis tareas; observar la tabla y probar filtros de texto y estado.
4. Probar los límites 10, 20, 40, 50 y verificar page / limit en la URL.
5. Crear una tarea y comprobar que aparece en la tabla.
6. Editar y eliminar tareas originales de DummyJSON; verificar PUT/DELETE en DevTools > Network y los mensajes de confirmación.
7. Volver al Dashboard y comprobar que cambian las estadísticas.
8. Cerrar sesión y verificar que vuelve al Login.
9. Verificar desde la URL pública del VPS en una ventana privada.

### Nota académica

Proyecto realizado para la Actividad 8: Consumo de APIs de Terceros - Login y Sistema con Tabla CRUD. El prototipo visual se realizó previamente en Figma.
