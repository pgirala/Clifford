import { FormioModel } from "./formio-model";
import { Permiso } from "./permiso";

export interface Formulario extends FormioModel{
  type: string;
  title: string;
  name: string;
  path: string;
  display: string,
  tags: Array<string>;
  submissionAccess?: Array<Permiso>;
  token?: string;
  submit?: boolean;
}

