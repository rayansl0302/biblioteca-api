import { useEffect, useMemo, useState } from 'react';
import * as gabaritoService from '../services/gabaritoService';
import type { Bug, BugStatus } from '../types';

const STATUS_LABEL: Record<BugStatus, string> = {
  corrigido: 'Corrigido',
  encontrado: 'Encontrado',
  parcial: 'Parcial',
  pendente: 'Pendente',
};

function situacao(bug: Bug): BugStatus {
  return bug.status ?? 'pendente';
}

export function GabaritoPage() {
  const [bugs, setBugs] = useState<Bug[] | null>(null);
  const [negado, setNegado] = useState(false);
  const [aberto, setAberto] = useState<string | null>(null);
  const [severidade, setSeveridade] = useState('');
  const [status, setStatus] = useState('');
  const [busca, setBusca] = useState('');

  useEffect(() => {
    gabaritoService
      .getGabarito()
      .then((data) => setBugs(data.bugs))
      .catch(() => setNegado(true));
  }, []);

  const filtrados = useMemo(() => {
    const termo = busca.trim().toLowerCase();
    return (bugs ?? []).filter((bug) => {
      const alvo = `${bug.id} ${bug.titulo} ${bug.area}`.toLowerCase();
      return (
        (!termo || alvo.includes(termo)) &&
        (!severidade || bug.severidade === severidade) &&
        (!status || situacao(bug) === status)
      );
    });
  }, [bugs, busca, severidade, status]);

  if (negado) {
    return (
      <div className="page">
        <p className="center-message">Rota nao encontrada.</p>
      </div>
    );
  }

  if (!bugs) {
    return (
      <div className="page">
        <p className="center-message">Carregando...</p>
      </div>
    );
  }

  const restantes = bugs.filter((bug) => situacao(bug) !== 'corrigido').length;

  return (
    <div className="page gabarito">
      <h1>Gabarito interno</h1>
      <p className="center-message" style={{ textAlign: 'left' }}>
        {restantes} de {bugs.length} defeitos ainda plantados. Documento interno — nao entregar ao QA avaliado.
      </p>

      <div className="filters">
        <input
          placeholder="Buscar por id, titulo ou area"
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
        />
        <select value={severidade} onChange={(e) => setSeveridade(e.target.value)}>
          <option value="">Todas as severidades</option>
          <option value="CRÍTICA">CRÍTICA</option>
          <option value="ALTA">ALTA</option>
          <option value="MÉDIA">MÉDIA</option>
          <option value="BAIXA">BAIXA</option>
        </select>
        <select value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="">Todas as situacoes</option>
          <option value="pendente">Pendente</option>
          <option value="encontrado">Encontrado</option>
          <option value="parcial">Parcial</option>
          <option value="corrigido">Corrigido</option>
        </select>
      </div>

      <ul className="gabarito-list">
        {filtrados.map((bug) => {
          const estaAberto = aberto === bug.id;
          return (
            <li key={bug.id} className={`gabarito-card sev-${bug.severidade.toLowerCase()}`}>
              <button type="button" className="gabarito-card-head" onClick={() => setAberto(estaAberto ? null : bug.id)}>
                <span className="gabarito-id">{bug.id}</span>
                <span className="gabarito-titulo">{bug.titulo}</span>
                <span className="tag">{bug.severidade}</span>
                <span className={`status status-${situacao(bug)}`}>{STATUS_LABEL[situacao(bug)]}</span>
              </button>
              {estaAberto && (
                <div className="gabarito-card-body">
                  <p><strong>Area:</strong> {bug.area} &middot; <strong>Dificuldade:</strong> {bug.dificuldade}</p>
                  <p><strong>Por que acontece:</strong> {bug.porque}</p>
                  <p><strong>Onde esta:</strong> {bug.local.join(', ')}</p>
                  <p><strong>Como reproduzir:</strong></p>
                  <ol>
                    {bug.passos.map((passo, i) => (
                      <li key={i}>{passo}</li>
                    ))}
                  </ol>
                  <p><strong>Esperado:</strong> {bug.esperado}</p>
                  <p><strong>Atual:</strong> {bug.atual}</p>
                </div>
              )}
            </li>
          );
        })}
        {filtrados.length === 0 && <p className="center-message">Nenhum defeito corresponde ao filtro.</p>}
      </ul>
    </div>
  );
}
