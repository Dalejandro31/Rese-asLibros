import { api } from ".";
import type { Resena } from "../types/Resena";
export const getResenasByLibro = (libroId: number) =>
  api.get<Resena[]>(`/Resenas/libro/${libroId}`);
export const createResena = (data: {
  usuarioId: number;
  libroId: number;
  calificacion: number;
  comentario?: string;
}) => api.post<Resena>('/Resenas', data);
export const getResenasByUsuario = (usuarioId: number) =>
  api.get<Resena[]>(`/Resenas/usuario/${usuarioId}`);

export const updateResena = (id: number, data: { calificacion: number; comentario: string }) =>
  api.put<Resena>(`/Resenas/${id}`, data);

export const deleteResena = (id: number) =>
  api.delete<void>(`/Resenas/${id}`);