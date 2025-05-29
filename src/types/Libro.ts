import type { Resena } from "./Resena";

export interface Libro {
    libroId: number;
    titulo: string;
    resumen?: string;
    fechaPublicacion?: string;
    autores: {autorId: number; nombre: string}[];
    categorias: {categoriaId: number; nombre: string}[];
    resenas: Resena[];
}