import { FormioModel } from "./formio-model";
import { Permiso } from "./permiso";

export interface Formulario extends FormioModel{
  title: string;
  path: string;
  tags: Array<string>;
  submissionAccess?: Array<Permiso>;
}

