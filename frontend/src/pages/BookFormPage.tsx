import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import * as bookService from '../services/bookService';

export function BookFormPage() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [isbn, setIsbn] = useState('');
  const [category, setCategory] = useState('');
  const [totalCopies, setTotalCopies] = useState(1);
  const [availableCopies, setAvailableCopies] = useState(1);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isEdit) {
      bookService.getBook(Number(id)).then((book) => {
        setTitle(book.title);
        setAuthor(book.author);
        setIsbn(book.isbn || '');
        setCategory(book.category || '');
        setTotalCopies(book.total_copies);
        setAvailableCopies(book.available_copies);
      });
    }
  }, [id, isEdit]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    try {
      if (isEdit) {
        await bookService.updateBook(Number(id), {
          title,
          author,
          isbn,
          category,
          total_copies: totalCopies,
          available_copies: availableCopies,
        });
      } else {
        await bookService.createBook({ title, author, isbn, category, total_copies: totalCopies });
      }
      navigate('/');
    } catch {
      setError('Nao foi possivel salvar o livro.');
    }
  }

  return (
    <div className="page">
      <h1>{isEdit ? 'Editar livro' : 'Novo livro'}</h1>
      <form className="book-form" onSubmit={handleSubmit}>
        {error && <p className="form-error">{error}</p>}
        <label>
          Titulo
          <input value={title} onChange={(e) => setTitle(e.target.value)} required />
        </label>
        <label>
          Autor
          <input value={author} onChange={(e) => setAuthor(e.target.value)} required />
        </label>
        <label>
          ISBN
          <input value={isbn} onChange={(e) => setIsbn(e.target.value)} />
        </label>
        <label>
          Categoria
          <input value={category} onChange={(e) => setCategory(e.target.value)} />
        </label>
        <label>
          Total de copias
          <input
            type="number"
            value={totalCopies}
            onChange={(e) => setTotalCopies(Number(e.target.value))}
            min={0}
            required
          />
        </label>
        {isEdit && (
          <label>
            Copias disponiveis
            <input
              type="number"
              value={availableCopies}
              onChange={(e) => setAvailableCopies(Number(e.target.value))}
              min={0}
              required
            />
          </label>
        )}
        <button type="submit">Salvar</button>
      </form>
    </div>
  );
}
