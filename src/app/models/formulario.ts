import { Permission } from "./permission";

export interface Formulario {
  _id: string;
  title: string;
  access: Array<Permission>;
}

