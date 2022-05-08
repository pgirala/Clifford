import { Submission } from "./submission";

export interface Dominio extends Submission {
  data: {nombre: string, path: string, tareas: boolean, individual: boolean};
}
