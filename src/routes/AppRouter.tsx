import { Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import Login from "../pages/Login";
import Register from "../pages/Register";
import BookDetail from "../pages/BookDetail";
import LibroForm from "../components/LibroForm/LibroForm";
import AdminRoute from "../components/ProtectedRoute";
import MyReviews from "../pages/MyReviews";


export default function AppRouter() {
    return (

        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/libro/:id" element={<BookDetail />} />
            <Route path="mis-reseñas" element={<MyReviews />} />
            {/* Rutas protegidas para admin */}
            <Route element={<AdminRoute redirectTo="/login" />}>
                <Route path="/crear-libro" element={<LibroForm />} />
            </Route>

            {/* 404 */}
            <Route path="*" element={<h2>Página no encontrada</h2>} />
        </Routes>

    )
}