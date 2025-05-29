import { api } from ".";
import type { Resena } from "../types/Resena";
export const getResenasByLibro = (libroId: number) =>
  api.get<Resena[]>(`/Resenas/libro/${libroId}`);
export const createResena = (data: {
  usuarioId: number;
  libroId:   number;
  calificacion: number;
  comentario?:   string;
}) => api.post<Resena>('/Resenas', data);