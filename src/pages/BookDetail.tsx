import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { getLibroById } from '../api/libros';
import { getResenasByLibro } from '../api/resenas';
import type { Libro } from '../types/Libro';
import type { Resena } from '../types/Resena';
import styles from './BookDetail.module.css';
import { AxiosError } from 'axios';
import ResenaForm from '../components/ResenaForm/ResenaForm';
import { Link } from 'react-router-dom';

const BookDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const libroId = Number(id);
  const { isAuthenticated, /* user, token si lo necesitas */ } = useAuth();

  const [libro, setLibro] = useState<Libro | null>(null);
  const [resenas, setResenas] = useState<Resena[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Para el formulario de nueva reseña


  // Carga libro y reseñas
  useEffect(() => {
    async function fetchAll() {
      try {
        const [{ data: L }, { data: R }] = await Promise.all([
          getLibroById(libroId),
          getResenasByLibro(libroId)
        ]);
        setLibro(L);
        setResenas(R);
      } catch (err: unknown) {
        if (err instanceof AxiosError && err.response?.data?.mensaje) {
          setError(err.response.data.mensaje);
        } else {
          setError('Error cargando el libro o reseñas');
        }
      }
    }
    fetchAll();
  }, [libroId]);



  if (error) return <p className={styles.error}>{error}</p>;
  if (!libro) return <p>Cargando...</p>;

  return (
    <div className={styles.container}>
      <h1>{libro.titulo}</h1>
      <p><strong>Autores:</strong> {libro.autores.map(a => a.nombre).join(', ')}</p>
      <p><strong>Categorías:</strong> {libro.categorias.map(c => c.nombre).join(', ')}</p>
      <p><strong>Publicado:</strong> {libro.fechaPublicacion}</p>
      <p className={styles.resumen}>{libro.resumen}</p>

      <section className={styles.resenas}>
        <h2>Reseñas</h2>
        {resenas.length === 0 && <p>No hay reseñas aún.</p>}
        {resenas.map(r => (
          <div key={r.reseñaId} className={styles.resena}>
            <p><strong>{r.username}</strong> ({new Date(r.fechaResena).toLocaleDateString()}):</p>
            <p>Calificación: {r.calificacion} ⭐</p>
            <p>{r.comentario}</p>
          </div>
        ))}
      </section>

      {isAuthenticated ? (
        <section className={styles.nuevaResena}>
          <h3>Deja tu reseña</h3>
          <ResenaForm
            libroId={libroId}
            onNuevaResena={r => setResenas(prev => [r, ...prev])}
          />
        </section>
      ) : (
        <p>
          Debes <Link to="/login">iniciar sesión</Link> para dejar una reseña.
        </p>
      )}
    </div>
  );
};

export default BookDetail;
