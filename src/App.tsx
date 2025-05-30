import { useLocation } from 'react-router-dom';
import './App.css'
import Footer from './components/Footer/Footer'
import Header from './components/Header/Header'
import AppRouter from './routes/AppRouter'

const App: React.FC = () => {
  const { pathname } = useLocation();
  const noLayout = ['/login', '/register'];

  const useLayout = !noLayout.includes(pathname);
  return (
    <div className="app-container">
      {useLayout && <Header />}
      <main className="main-content">
        <AppRouter />
      </main>
      {useLayout && <Footer />}
    </div>
  );
};

export default App;