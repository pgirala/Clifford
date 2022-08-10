import { Submission } from "./submission";
import { Procedimiento } from "./procedimiento";

export interface Dominio extends Submission {
  data: { nombre: string, path: string, envios: boolean, tareas: boolean, individual: boolean, procedimientos?: Array<Procedimiento> };
}
