// src/pages/MyReviews.tsx
import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { getResenasByUsuario, deleteResena } from '../api/resenas';
import type { Resena } from '../types/Resena';
import { ResenaEditForm } from '../components/ResenaEditForm/ResenaEditForm';
import styles from './MyReviews.module.css';
import { getLibroById } from '../api/libros';

const MyReviews: React.FC = () => {
    const { userId } = useAuth();
    const [resenas, setResenas] = useState<Resena[]>([]);
    const [libros, setLibros] = useState<Record<number, string>>({});
    const [editingId, setEditingId] = useState<number | null>(null);
    const [error, setError] = useState<string | null>(null);

    // ✅ Cargar reseñas y títulos de libros relacionados
    useEffect(() => {
        if (!userId) return;

        getResenasByUsuario(userId)
            .then(async (res) => {
                setResenas(res.data);

                const ids = [...new Set(res.data.map((resena: Resena) => resena.libroId))];

                const librosData = await Promise.all(
                    ids.map(id => getLibroById(id).then(res => ({ id, titulo: res.data.titulo })))
                );

                const mapping = Object.fromEntries(librosData.map(l => [l.id, l.titulo]));
                setLibros(mapping);
            })
            .catch(() => setError('No se pudieron cargar tus reseñas.'));
    }, [userId]);

    const handleDelete = async (id: number) => {
        if (!confirm('¿Eliminar esta reseña?')) return;
        try {
            await deleteResena(id);
            setResenas(rs => rs.filter(r => r.reseñaId !== id));
        } catch {
            alert('Error al eliminar.');
        }
    };

    const handleUpdated = (updated: Resena) => {
        setResenas(rs => rs.map(r => r.reseñaId === updated.reseñaId ? updated : r));
        setEditingId(null);
    };

    if (!userId) return <p>Debes iniciar sesión.</p>;
    if (error) return <p className={styles.error}>{error}</p>;

    return (
        <div className={styles.container}>
            <h1>Mis reseñas</h1>
            {resenas.length === 0 && <p>No tienes reseñas aún.</p>}
            {resenas.map(r => (
                <div key={r.reseñaId} className={styles.resena}>
                    {editingId === r.reseñaId
                        ? <ResenaEditForm
                            resena={r}
                            onCancel={() => setEditingId(null)}
                            onUpdated={handleUpdated}
                        />
                        : <>
                            <p>
                                <strong>{r.username}</strong> en <em>{libros[r.libroId] || `#${r.libroId}`}</em>:
                            </p>
                            <p>Calificación: {r.calificacion}</p>
                            <p>{r.comentario}</p>
                            <div className={styles.actions}>
                                <button onClick={() => setEditingId(r.reseñaId)}>Editar</button>
                                <button onClick={() => handleDelete(r.reseñaId)}>Eliminar</button>
                            </div>
                        </>
                    }
                </div>
            ))}
        </div>
    );
};

export default MyReviews;