import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import styles from './Header.module.css';

const Header: React.FC = () => {
  const { pathname } = useLocation();

  return (
    <header className={styles.header}>
      <div className={styles.logo}>
        <Link to="/">📚 ReseñasLibros</Link>
      </div>
      <nav className={styles.nav}>
        <Link
          to="/"
          className={pathname === '/' ? styles.active : ''}
        >
          Inicio
        </Link>
        <Link
          to="/login"
          className={pathname === '/login' ? styles.active : ''}
        >
          Ingresar
        </Link>
        <Link
          to="/register"
          className={pathname === '/register' ? styles.active : ''}
        >
          Registrarse
        </Link>
      </nav>
    </header>
  );
};

export default Header;
