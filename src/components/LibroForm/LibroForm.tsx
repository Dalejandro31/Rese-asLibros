import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllAutores } from '../../api/autores';
import { getAllCategorias } from '../../api/categorias';
import { createLibro } from '../../api/libros';
import type { Autor } from '../../types/Autor';
import type { Categoria } from '../../types/Categoria';
import styles from './LibroForm.module.css';
import { AxiosError } from 'axios';

const LibroForm: React.FC = () => {
    const navigate = useNavigate();

    // Form state
    const [titulo, setTitulo] = useState('');
    const [resumen, setResumen] = useState('');
    const [fechaPublicacion, setFechaPublicacion] = useState('');
    const [autorIds, setAutorIds] = useState<number[]>([]);
    const [categoriaIds, setCategoriaIds] = useState<number[]>([]);

    // Data for selects
    const [autores, setAutores] = useState<Autor[]>([]);
    const [categorias, setCategorias] = useState<Categoria[]>([]);

    // Error / loading
    const [error, setError] = useState<string | null>(null);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        async function fetchMetadata() {
            try {
                const [aRes, cRes] = await Promise.all([
                    getAllAutores(),
                    getAllCategorias()
                ]);
                setAutores(aRes.data);
                setCategorias(cRes.data);
            } catch (err) {
                console.error(err);
                setError('No se pudieron cargar autores o categorías.');
            }
        }
        fetchMetadata();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!titulo.trim()) {
            setError('El título es obligatorio.');
            return;
        }
        if (autorIds.length === 0 || categoriaIds.length === 0) {
            setError('Selecciona al menos un autor y una categoría.');
            return;
        }

        setSubmitting(true);
        setError(null);

        try {
            await createLibro({
                titulo,
                resumen,
                fechaPublicacion,
                autorIds,
                categoriaIds
            });
            // Redirige a la lista de libros
            navigate('/');
        } catch (err: unknown) {
            if (err instanceof AxiosError && err.response?.data?.mensaje) {
                setError(err.response.data.mensaje);
            } else {
                setError('Error al iniciar sesión');
            }
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className={styles.container}>
            <h2>Crear nuevo libro</h2>
            {error && <p className={styles.error}>{error}</p>}
            <form onSubmit={handleSubmit} className={styles.form}>
                <label>
                    Título*
                    <input
                        type="text"
                        value={titulo}
                        onChange={e => setTitulo(e.target.value)}
                        required
                        disabled={submitting}
                    />
                </label>

                <label>
                    Resumen
                    <textarea
                        value={resumen}
                        onChange={e => setResumen(e.target.value)}
                        rows={4}
                        disabled={submitting}
                    />
                </label>

                <label>
                    Fecha de publicación
                    <input
                        type="date"
                        value={fechaPublicacion}
                        onChange={e => setFechaPublicacion(e.target.value)}
                        disabled={submitting}
                    />
                </label>

                <label>
                    Autores* (Ctrl+click para seleccionar varios)
                    <select
                        multiple
                        value={autorIds.map(String)}
                        onChange={e => {
                            const opts = Array.from(e.target.selectedOptions);
                            setAutorIds(opts.map(o => Number(o.value)));
                        }}
                        size={Math.min(autores.length, 5)}
                        disabled={submitting}
                    >
                        {autores.map(a => (
                            <option key={a.autorId} value={a.autorId}>
                                {a.nombre}
                            </option>
                        ))}
                    </select>
                </label>

                <label>
                    Categorías* (Ctrl+click)
                    <select
                        multiple
                        value={categoriaIds.map(String)}
                        onChange={e => {
                            const opts = Array.from(e.target.selectedOptions);
                            setCategoriaIds(opts.map(o => Number(o.value)));
                        }}
                        size={Math.min(categorias.length, 5)}
                        disabled={submitting}
                    >
                        {categorias.map(c => (
                            <option key={c.categoriaId} value={c.categoriaId}>
                                {c.nombre}
                            </option>
                        ))}
                    </select>
                </label>

                <button type="submit" disabled={submitting}>
                    {submitting ? 'Creando...' : 'Crear Libro'}
                </button>
            </form>
        </div>
    );
};

export default LibroForm;