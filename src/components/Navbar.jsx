export default function Navbar({ usuario, onLogout }) {
  const nombre = [usuario.firstName, usuario.lastName].filter(Boolean).join(' ')

  return (
    <header className="navbar">
      <span className="navbar-title">Panel Principal</span>
      <div className="navbar-profile">
        <img className="navbar-avatar" src={usuario.image} alt="Foto del usuario" />
        <span className="navbar-name">{nombre || usuario.username}</span>
        <button type="button" onClick={onLogout} className="logout-button">
          Cerrar sesi&oacute;n
        </button>
      </div>
    </header>
  )
}
