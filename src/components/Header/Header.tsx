import React from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import styles from './Header.module.css';

const Header: React.FC = () => {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/'); // redirige al Home
  };

  return (
    <header className={styles.header}>
      <div className={styles.logo}>
        <Link to="/">ReseñasLibros</Link>
      </div>

      <nav className={styles.nav}>
        <NavLink to="/" className={styles.link} end>
          Inicio
        </NavLink>

        {isAuthenticated ? (
          <>
            <NavLink to="/mis-reseñas" className={styles.link}>
              Mis reseñas
            </NavLink>

            <button
              onClick={handleLogout}
              className={styles.link}
              style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, marginLeft: '1rem' }}
            >
              Cerrar sesión
            </button>
          </>
        ) : (
          <>
            <NavLink to="/login" className={styles.link}>
              Ingresar
            </NavLink>
            <NavLink to="/register" className={styles.link}>
              Registrarse
            </NavLink>
          </>
        )}
      </nav>
    </header>
  );
};

export default Header;