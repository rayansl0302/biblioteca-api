import { useEffect, useState } from 'react';
import * as loanService from '../services/loanService';
import { useAuth } from '../context/AuthContext';
import type { Loan } from '../types';

export function LoansPage() {
  const { user } = useAuth();
  const [loans, setLoans] = useState<Loan[]>([]);
  const [statusFilter, setStatusFilter] = useState('');
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    try {
      const data = await loanService.listLoans(statusFilter || undefined);
      setLoans(data);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusFilter]);

  async function handleReturn(loanId: number) {
    await loanService.returnLoan(loanId);
    load();
  }

  function formatDate(value: string) {
    return new Date(value).toLocaleString('pt-BR');
  }

  return (
    <div className="page">
      <h1>{user?.role === 'admin' ? 'Todos os emprestimos' : 'Meus emprestimos'}</h1>

      <div className="filters">
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          <option value="">Todos os status</option>
          <option value="active">Ativos</option>
          <option value="returned">Devolvidos</option>
        </select>
      </div>

      {loading ? (
        <p className="center-message">Carregando...</p>
      ) : (
        <table className="loans-table">
          <thead>
            <tr>
              <th>Livro</th>
              {user?.role === 'admin' && <th>Usuario</th>}
              <th>Emprestado em</th>
              <th>Vencimento</th>
              <th>Status</th>
              <th>Acoes</th>
            </tr>
          </thead>
          <tbody>
            {loans.map((loan) => (
              <tr key={loan.id}>
                <td>{loan.book_title}</td>
                {user?.role === 'admin' && <td>{loan.user_name}</td>}
                <td>{formatDate(loan.loan_date)}</td>
                <td>{formatDate(loan.due_date)}</td>
                <td>
                  <span className={`status status-${loan.status}`}>{loan.status}</span>
                </td>
                <td>
                  {loan.status === 'active' && (
                    <button onClick={() => handleReturn(loan.id)}>Devolver</button>
                  )}
                </td>
              </tr>
            ))}
            {loans.length === 0 && (
              <tr>
                <td colSpan={6}>Nenhum emprestimo encontrado.</td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
}
