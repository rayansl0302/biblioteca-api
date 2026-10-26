import { useState } from 'react';
import type { FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import * as authService from '../services/authService';
import { useAuth } from '../context/AuthContext';

export function RegisterPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await authService.register(name, email, password);
      await login(email, password);
      navigate('/');
    } catch {
      setError('Nao foi possivel cadastrar. Verifique os dados ou tente outro e-mail.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-page">
      <form className="auth-form" onSubmit={handleSubmit}>
        <h1>Criar conta</h1>
        {error && <p className="form-error">{error}</p>}
        <label>
          Nome
          <input value={name} onChange={(e) => setName(e.target.value)} required />
        </label>
        <label>
          E-mail
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </label>
        <label>
          Senha
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </label>
        <button type="submit" disabled={loading}>
          {loading ? 'Cadastrando...' : 'Cadastrar'}
        </button>
        <p>
          Ja tem conta? <Link to="/login">Entrar</Link>
        </p>
      </form>
    </div>
  );
}
