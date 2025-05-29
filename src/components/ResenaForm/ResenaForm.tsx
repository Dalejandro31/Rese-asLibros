import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { createResena } from '../../api/resenas';
import type { Resena } from '../../types/Resena';
import styles from './ResenaForm.module.css';
import { AxiosError } from 'axios';
interface Props {
  libroId: number;
  onNuevaResena: (resena: Resena) => void;
}

const ResenaForm: React.FC<Props> = ({ libroId, onNuevaResena }) => {
  const { isAuthenticated, userId } = useAuth();
  const [calificacion, setCalificacion] = useState(5);
  const [comentario, setComentario]     = useState('');
  const [error, setError]               = useState<string | null>(null);
  const [submitting, setSubmitting]     = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated) {
      setError('Debes iniciar sesión para dejar una reseña.');
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      // Asumimos que el AuthContext inyecta el header JWT y que la API infiere usuarioId del token
      const { data: nueva } = await createResena({
        usuarioId: userId!, 
        libroId,
        calificacion,
        comentario
      });
      onNuevaResena(nueva);
      setComentario('');
      setCalificacion(5);
    } catch (err: unknown) {
        if (err instanceof AxiosError && err.response?.data?.mensaje) {
          setError(err.response.data.mensaje);
        } else {
          setError('Error al enviar la reseña');
        }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      {error && <p className={styles.error}>{error}</p>}
      <label>
        Calificación:
        <select
          value={calificacion}
          onChange={e => setCalificacion(Number(e.target.value))}
          disabled={submitting}
        >
          {[1,2,3,4,5].map(n => (
            <option key={n} value={n}>{n} ⭐</option>
          ))}
        </select>
      </label>

      <label>
        Comentario:
        <textarea
          value={comentario}
          onChange={e => setComentario(e.target.value)}
          rows={4}
          disabled={submitting}
          required
        />
      </label>

      <button type="submit" disabled={submitting}>
        {submitting ? 'Enviando...' : 'Enviar reseña'}
      </button>
    </form>
  );
};

export default ResenaForm;
