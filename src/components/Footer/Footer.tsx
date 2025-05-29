import React from 'react';
import styles from './Footer.module.css';

const Footer: React.FC = () => {
  return (
    <footer className={styles.footer}>
      <p>
        &copy; {new Date().getFullYear()} ReseñasLibros. Todos los derechos reservados.
      </p>
      <p>
        <a href="/terms">Términos y Condiciones</a> | <a href="/privacy">Política de Privacidad</a>
      </p>
    </footer>
  );
};

export default Footer;
