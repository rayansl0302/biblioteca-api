import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import * as userService from '../services/userService';
import { useAuth } from '../context/AuthContext';
import type { User } from '../types';

export function UsersPage() {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  function load() {
    setLoading(true);
    userService.listUsers().then((data) => {
      setUsers(data);
      setLoading(false);
    });
  }

  useEffect(() => {
    load();
  }, []);

  async function handleDelete(id: number) {
    if (!confirm('Excluir este usuario?')) return;
    await userService.deleteUser(id);
    load();
  }

  return (
    <div className="page">
      <div className="page-header">
        <h1>Usuarios cadastrados</h1>
        <Link to="/users/new" className="button">
          Novo usuario
        </Link>
      </div>
      {loading ? (
        <p className="center-message">Carregando...</p>
      ) : (
        <table className="loans-table">
          <thead>
            <tr>
              <th>Nome</th>
              <th>E-mail</th>
              <th>Papel</th>
              <th>Acoes</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id}>
                <td>{u.name}</td>
                <td>{u.email}</td>
                <td>{u.role}</td>
                <td>
                  <Link to={`/users/${u.id}/edit`}>Editar</Link>
                  {u.id !== currentUser?.id && (
                    <button className="danger" onClick={() => handleDelete(u.id)}>
                      Excluir
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
