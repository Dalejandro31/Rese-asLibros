export interface Resena {
  reseñaId: number;
  usuarioId: number;
  libroId: number;
  calificacion: number;
  comentario?: string;
  fechaResena: string;
  username: string;
}