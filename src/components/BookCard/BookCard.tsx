import React from 'react';
import { Link } from 'react-router-dom';
import type { Libro } from '../../types/Libro';
import styles from './BookCard.module.css';

interface Props {
  libro: Libro;
}

const BookCard: React.FC<Props> = ({ libro }) => {
  return (
    <div className={styles.card}>
      <h3 className={styles.title}>{libro.titulo}</h3>
      <p className={styles.authors}>
        {libro.autores.map(a => a.nombre).join(', ')}
      </p>
      <p className={styles.categories}>
        {libro.categorias.map(c => c.nombre).join(', ')}
      </p>
      <Link to={`/libro/${libro.libroId}`} className={styles.link}>
        Ver detalles
      </Link>
    </div>
  );
};

export default BookCard;
