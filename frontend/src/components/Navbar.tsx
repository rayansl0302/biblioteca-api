import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate('/login');
  }

  return (
    <header className="navbar">
      <Link to="/" className="brand">
        📚 Biblioteca Digital
      </Link>
      <nav className="nav-links">
        <Link to="/">Catálogo</Link>
        {user && <Link to="/loans">Meus Empréstimos</Link>}
        {user?.role === 'admin' && <Link to="/books/new">Novo Livro</Link>}
        {user?.role === 'admin' && <Link to="/users">Usuários</Link>}
      </nav>
      <div className="nav-user">
        {user ? (
          <>
            <span>
              {user.name} <small>({user.role})</small>
            </span>
            <button onClick={handleLogout}>Sair</button>
          </>
        ) : (
          <>
            <Link to="/login">Entrar</Link>
            <Link to="/register">Cadastrar</Link>
          </>
        )}
      </div>
    </header>
  );
}
