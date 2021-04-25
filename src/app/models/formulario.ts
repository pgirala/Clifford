import { FormioModel } from "./formio-model";

export interface Formulario extends FormioModel{
  title: string;
  path: string;
  tags: Array<string>;
}

