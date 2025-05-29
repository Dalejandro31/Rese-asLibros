import React, {useEffect, useState} from 'react';
import { getAllLibros, searchLibros } from '../api/libros'; 
import { getAllCategorias } from '../api/categorias';
import { getAllAutores } from '../api/autores';
import type { Libro } from '../types/Libro';
import type { Categoria } from '../types/Categoria';
import type { Autor } from '../types/Autor';
import BookCard from '../components/BookCard/BookCard';
import styles from './Home.module.css';

const Home: React.FC = () => {
    // Estado para datos
    const [libros, setLibros] = useState<Libro[]>([]);
    const [categorias, setCategorias] = useState<Categoria[]>([]);
    const [autores, setAutores] = useState<Autor[]>([]);
    // Filtros
    const [titulo, setTitulo] = useState('');
    const [autor, setAutor] = useState<number | ''>('');
    const [categoria, setCategoria] = useState<number | ''>('');
    
    useEffect(() => {
        async function fetchData() {
        try {
            const [{ data: L }, { data: C }, { data: A }] = await Promise.all([
            getAllLibros(),
            getAllCategorias(),
            getAllAutores()
            ]);
            setLibros(L);
            setCategorias(C);
            setAutores(A);
        } catch (err) {
            console.error('Error cargando datos:', err);
        }
        }
        fetchData();
    }, []);

    const handleSearch = async () => {
        try {
        const params: { titulo?: string; autor?: string; categoriaId?: number } = {};
        if (titulo.trim()) params.titulo = titulo;
        if (autor)  params.autor = autores.find(a => a.autorId === autor)?.nombre || '';
        if (categoria)  params.categoriaId = Number(categoria);
        const { data } = await searchLibros(params);
        setLibros(data);
        } catch (err) {
        console.error('Error buscando libros:', err);
        }
    };

    return (
    <div className={styles.container}>
      <h1 className={styles.title}>Explora nuestros libros</h1>

      {/* Filtros */}
      <div className={styles.filters}>
        <input
          type="text"
          placeholder="Buscar por título..."
          value={titulo}
          onChange={e => setTitulo(e.target.value)}
          className={styles.input}
        />

        <select
          value={autor}
          onChange={e => setAutor(e.target.value ? Number(e.target.value) : '')}
          className={styles.select}
        >
          <option value="">Todos los autores</option>
          {autores.map(a => (
            <option key={a.autorId} value={a.autorId}>{a.nombre}</option>
          ))}
        </select>

        <select
          value={categoria}
          onChange={e => setCategoria(e.target.value ? Number(e.target.value) : '')}
          className={styles.select}
        >
          <option value="">Todas las categorías</option>
          {categorias.map(c => (
            <option key={c.categoriaId} value={c.categoriaId}>{c.nombre}</option>
          ))}
        </select>

        <button onClick={handleSearch} className={styles.button}>
          Buscar
        </button>
      </div>

      {/* Lista de libros */}
      <div className={styles.list}>
        {libros.length
          ? libros.map(libro => (
              <BookCard key={libro.libroId} libro={libro} />
            ))
          : <p>No se encontraron libros.</p>
        }
      </div>
    </div>
  );
}

export default Home;
