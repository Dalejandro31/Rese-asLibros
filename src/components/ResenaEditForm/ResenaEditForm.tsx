// src/components/ResenaEditForm/ResenaEditForm.tsx
import React, { useState } from 'react';
import { updateResena } from '../../api/resenas';
import type { Resena } from '../../types/Resena';
import styles from './ResenaEditForm.module.css';
import axios from 'axios';

interface Props {
    resena: Resena;
    onCancel: () => void;
    onUpdated: (r: Resena) => void;
}

export const ResenaEditForm: React.FC<Props> = ({ resena, onCancel, onUpdated }) => {
    const [calificacion, setCalificacion] = useState(resena.calificacion);
    const [comentario, setComentario] = useState(resena.comentario);
    const [error, setError] = useState<string | null>(null);
    const [saving, setSaving] = useState(false);

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setError(null);

        try {
            const { data: updated } = await updateResena(resena.resenaId, { calificacion, comentario: comentario || "" });
            onUpdated(updated);
        } catch (err: unknown) {
            // 1) Imprime TODO el error para verlo en DevTools
            console.error('Error al actualizar reseña:', err);

            // 2) Si es AxiosError, puedes inspeccionar err.response.data entero
            if (axios.isAxiosError(err)) {
                console.error('Detalles de la respuesta del servidor:', err.response);
                // Intenta mostrar un mensaje más rico:
                const apiMsg = err.response?.data?.mensaje
                    ?? err.response?.data
                    ?? err.message;
                setError(String(apiMsg));
            } else {
                setError('Error al actualizar la reseña.');
            }
        } finally {
            setSaving(false);
        }
    };

    return (
        <form onSubmit={handleSave} className={styles.form}>
            {error && <p className={styles.error}>{error}</p>}
            <label>
                Calificación:
                <select
                    value={calificacion}
                    onChange={e => setCalificacion(Number(e.target.value))}
                    disabled={saving}
                >
                    {[1, 2, 3, 4, 5].map(n => <option key={n} value={n}>{n}</option>)}
                </select>
            </label>
            <label>
                Comentario:
                <textarea
                    value={comentario}
                    onChange={e => setComentario(e.target.value)}
                    disabled={saving}
                    required
                />
            </label>
            <div className={styles.actions}>
                <button type="submit" disabled={saving}>Guardar</button>
                <button type="button" onClick={onCancel} disabled={saving}>Cancelar</button>
            </div>
        </form>
    );
};
