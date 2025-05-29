import { api } from './index';
import type { Autor } from '../types/Autor';

export const getAllAutores = () =>
  api.get<Autor[]>('/Autor');

export const getAutorById = (id: number) =>
  api.get<Autor>(`/autores/${id}`);