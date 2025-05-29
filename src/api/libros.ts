import { api } from "./index";
import type { Libro } from "../types/Libro";

export const getAllLibros = () => api.get<Libro[]>('/Libro');
export const getLibroById = (id: number) => api.get<Libro>(`/Libro/${id}`);
export const searchLibros = (params: { titulo?: string; autor?: string; categoriaId?: number }) =>
  api.get<Libro[]>('/Libro/search', { params });