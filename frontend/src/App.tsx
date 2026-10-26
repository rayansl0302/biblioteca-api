import { Route, Routes } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { ProtectedRoute } from './routes/ProtectedRoute';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { BooksPage } from './pages/BooksPage';
import { BookFormPage } from './pages/BookFormPage';
import { LoansPage } from './pages/LoansPage';
import { UsersPage } from './pages/UsersPage';
import { GabaritoPage } from './pages/GabaritoPage';
import './App.css';

function App() {
  return (
    <>
      <Navbar />
      <main>
        <Routes>
          {/* Rota interna do desafio — o acesso e controlado pelo backend (GET /gabarito exige conta master) */}
          <Route path="/gabarito" element={<GabaritoPage />} />
          <Route path="/" element={<BooksPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route
            path="/books/new"
            element={
              <ProtectedRoute requireRole="admin">
                <BookFormPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/books/:id/edit"
            element={
              <ProtectedRoute requireRole="admin">
                <BookFormPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/loans"
            element={
              <ProtectedRoute>
                <LoansPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/users"
            element={
              <ProtectedRoute requireRole="admin">
                <UsersPage />
              </ProtectedRoute>
            }
          />
        </Routes>
      </main>
    </>
  );
}

export default App;
