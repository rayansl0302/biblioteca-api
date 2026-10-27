import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import * as userService from '../services/userService';
import type { Role } from '../types';

export function UserFormPage() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<Role>('member');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isEdit) {
      userService.getUser(Number(id)).then((user) => {
        setName(user.name);
        setEmail(user.email);
        setRole(user.role);
      });
    }
  }, [id, isEdit]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    try {
      if (isEdit) {
        await userService.updateUser(Number(id), { name, email, role });
      } else {
        await userService.createUser({ name, email, password, role });
      }
      navigate('/users');
    } catch {
      setError('Nao foi possivel salvar o usuario.');
    }
  }

  return (
    <div className="page">
      <h1>{isEdit ? 'Editar usuario' : 'Novo usuario'}</h1>
      <form className="book-form" onSubmit={handleSubmit}>
        {error && <p className="form-error">{error}</p>}
        <label>
          Nome
          <input value={name} onChange={(e) => setName(e.target.value)} required />
        </label>
        <label>
          E-mail
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </label>
        {!isEdit && (
          <label>
            Senha
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </label>
        )}
        <label>
          Papel
          <select value={role} onChange={(e) => setRole(e.target.value as Role)}>
            <option value="member">Membro</option>
            <option value="admin">Admin</option>
          </select>
        </label>
        <div className="form-actions">
          <button type="submit">Salvar</button>
          <button type="button" className="secondary" onClick={() => navigate('/users')}>
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}
