export default function Sidebar({ seccion, onNavigate }) {
  const opciones = [
    { nombre: 'Dashboard', icono: '\u25a6' },
    { nombre: 'Mis tareas', icono: '\u2611' },
    { nombre: 'Configuraci\u00f3n', icono: '\u2699' },
  ]

  return (
    <aside className="sidebar">
      <div className="sidebar-title">Gestor de tareas</div>
      <nav className="sidebar-menu" aria-label="Menu principal">
        {opciones.map(({ nombre, icono }) => (
          <button
            key={nombre}
            type="button"
            className={`sidebar-link ${seccion === nombre ? 'active' : ''}`}
            onClick={() => onNavigate(nombre)}
            aria-current={seccion === nombre ? 'page' : undefined}
          >
            <span className="sidebar-icon" aria-hidden="true">{icono}</span>
            {nombre}
          </button>
        ))}
      </nav>
    </aside>
  )
}
