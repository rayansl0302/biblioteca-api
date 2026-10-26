import { useEffect, useState } from 'react';
import * as userService from '../services/userService';
import type { User } from '../types';

export function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    userService.listUsers().then((data) => {
      setUsers(data);
      setLoading(false);
    });
  }, []);

  return (
    <div className="page">
      <h1>Usuarios cadastrados</h1>
      {loading ? (
        <p className="center-message">Carregando...</p>
      ) : (
        <table className="loans-table">
          <thead>
            <tr>
              <th>Nome</th>
              <th>E-mail</th>
              <th>Papel</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id}>
                <td>{u.name}</td>
                <td>{u.email}</td>
                <td>{u.role}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
