// src/pages/MyReviews.tsx
import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { getResenasByUsuario, deleteResena } from '../api/resenas';
import type { Resena } from '../types/Resena';
import { ResenaEditForm } from '../components/ResenaEditForm/ResenaEditForm';
import styles from './MyReviews.module.css';

const MyReviews: React.FC = () => {
    const { userId } = useAuth();
    const [resenas, setResenas] = useState<Resena[]>([]);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!userId) return;
        getResenasByUsuario(userId)
            .then(r => setResenas(r.data))
            .catch(() => setError('No se pudieron cargar tus reseñas.'));
    }, [userId]);

    const handleDelete = async (id: number) => {
        if (!confirm('¿Eliminar esta reseña?')) return;
        try {
            await deleteResena(id);
            setResenas(rs => rs.filter(r => r.resenaId !== id));
        } catch {
            alert('Error al eliminar.');
        }
    };

    const handleUpdated = (updated: Resena) => {
        setResenas(rs => rs.map(r => r.resenaId === updated.resenaId ? updated : r));
        setEditingId(null);
    };

    if (!userId) return <p>Debes iniciar sesión.</p>;
    if (error) return <p className={styles.error}>{error}</p>;

    return (
        <div className={styles.container}>
            <h1>Mis reseñas</h1>
            {resenas.length === 0 && <p>No tienes reseñas aún.</p>}
            {resenas.map(r => (
                <div key={r.resenaId} className={styles.resena}>
                    {editingId === r.resenaId
                        ? <ResenaEditForm
                            resena={r}
                            onCancel={() => setEditingId(null)}
                            onUpdated={handleUpdated}
                        />
                        : <>
                            <p><strong>{r.username}</strong> en libro #{r.libroId}:</p>
                            <p>Calificación: {r.calificacion}</p>
                            <p>{r.comentario}</p>
                            <div className={styles.actions}>
                                <button onClick={() => setEditingId(r.resenaId)}>Editar</button>
                                <button onClick={() => handleDelete(r.resenaId)}>Eliminar</button>
                            </div>
                        </>
                    }
                </div>
            ))}
        </div>
    );
};

export default MyReviews;
