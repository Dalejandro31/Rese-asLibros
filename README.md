## Front-end (ReseñasLibros-UI)

ReseñasLibros-UI/
├── public/
│   └── index.html
├── src/
│   ├── api/               # Cliente Axios
│   ├── components/        # Header, Footer, BookCard, ResenaForm…
│   ├── contexts/          # AuthContext
│   ├── pages/             # Home, Login, Register, BookDetail, MyReviews…
│   ├── routes/            # AppRouter.tsx
│   ├── types/             # Tipos TS (Libro, Resena…)
│   └── main.tsx
├── vite.config.ts
└── package.json


# Requisitos previos

Node.js ≥ 16

Cuenta en Vercel

Repo GitHub (o similar) con el código del front

Ejecutar localmente
Clonar el repositorio y situarse en él:

git clone <URL-del-repo-UI>
cd ReseñasLibros-UI
Instalar dependencias:


npm install
Crear un archivo .env en la raíz con:


VITE_API_URL=https://localhost:5001/api o el puerto que especifique la ApiRest

Arrancar el servidor de desarrollo:


npm run dev
Abrir http://localhost:5173 en el navegador.

Despliegue en Vercel
Push al repo en GitHub (o GitLab/Bitbucket).

En Vercel Dashboard:

New Project → Import from Git → selecciona tu repo.

Framework Preset: Vite.

Build Command: npm run build

Output Directory: dist

En Environment Variables de Vercel, define:

VITE_API_URL=https://<tu-app-service>.azurewebsites.net/api
Vercel desplegará automáticamente en cada push.

Tu aplicación front quedará en:

https://<tu-proyecto-vercel>.vercel.app
