import { api } from "./index";
import type { Categoria } from "../types/Categoria";

export const getAllCategorias = () =>
  api.get<Categoria[]>('/Categoria');

export const getCategoriaById = (id: number) =>
  api.get<Categoria>(`/Categoria/${id}`);