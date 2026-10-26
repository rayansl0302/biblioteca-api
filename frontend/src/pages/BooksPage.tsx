import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import * as bookService from '../services/bookService';
import * as loanService from '../services/loanService';
import { useAuth } from '../context/AuthContext';
import type { Book } from '../types';

export function BooksPage() {
  const { user } = useAuth();
  const [books, setBooks] = useState<Book[]>([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    try {
      const data = await bookService.listBooks({ search, category, page, limit: 8 });
      setBooks(data);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  function handleSearchSubmit(e: React.FormEvent) {
    e.preventDefault();
    setPage(1);
    load();
  }

  async function handleBorrow(bookId: number) {
    setMessage(null);
    try {
      await loanService.createLoan(bookId);
      setMessage('Livro emprestado com sucesso!');
      load();
    } catch {
      setMessage('Nao foi possivel emprestar este livro.');
    }
  }

  async function handleDelete(bookId: number) {
    if (!confirm('Excluir este livro?')) return;
    await bookService.deleteBook(bookId);
    load();
  }

  return (
    <div className="page">
      <h1>Catalogo de livros</h1>

      <form className="filters" onSubmit={handleSearchSubmit}>
        <input
          placeholder="Buscar por titulo ou autor..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <input
          placeholder="Categoria"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        />
        <button type="submit">Filtrar</button>
      </form>

      {message && <p className="form-info">{message}</p>}
      {loading ? (
        <p className="center-message">Carregando...</p>
      ) : (
        <div className="book-grid">
          {books.map((book) => (
            <div className="book-card" key={book.id}>
              <h3>{book.title}</h3>
              <p className="author">{book.author}</p>
              {book.category && <span className="tag">{book.category}</span>}
              <p className="copies">
                {book.available_copies} / {book.total_copies} disponiveis
              </p>
              <div className="card-actions">
                {user && (
                  <button onClick={() => handleBorrow(book.id)} disabled={book.available_copies <= 0}>
                    Pegar emprestado
                  </button>
                )}
                {user?.role === 'admin' && (
                  <>
                    <Link to={`/books/${book.id}/edit`}>Editar</Link>
                    <button className="danger" onClick={() => handleDelete(book.id)}>
                      Excluir
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
          {books.length === 0 && <p>Nenhum livro encontrado.</p>}
        </div>
      )}

      <div className="pagination">
        <button disabled={page === 1} onClick={() => setPage((p) => Math.max(1, p - 1))}>
          Anterior
        </button>
        <span>Pagina {page}</span>
        <button onClick={() => setPage((p) => p + 1)}>Proxima</button>
      </div>
    </div>
  );
}
