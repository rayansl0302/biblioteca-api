export type Role = 'admin' | 'member';

export interface User {
  id: number;
  name: string;
  email: string;
  role: Role;
}

export interface Book {
  id: number;
  title: string;
  author: string;
  isbn: string | null;
  category: string | null;
  total_copies: number;
  available_copies: number;
  created_at: string;
}

export interface Loan {
  id: number;
  book_id: number;
  user_id: number;
  loan_date: string;
  due_date: string;
  return_date: string | null;
  status: 'active' | 'returned';
  book_title?: string;
  user_name?: string;
}

export type BugStatus = 'corrigido' | 'encontrado' | 'parcial' | 'pendente';

export interface Bug {
  id: string;
  titulo: string;
  area: string;
  severidade: 'CRÍTICA' | 'ALTA' | 'MÉDIA' | 'BAIXA';
  dificuldade: 'Alta' | 'Média' | 'Baixa';
  local: string[];
  porque: string;
  passos: string[];
  esperado: string;
  atual: string;
  descoberta?: string;
  status?: BugStatus;
}

export interface Gabarito {
  titulo: string;
  descricao: string;
  bugs: Bug[];
}
