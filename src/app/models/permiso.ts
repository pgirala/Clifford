import { Role } from "./role";
import { TipoPermiso } from "./enums";

export interface Permiso {
  roles: Array<Role>;
  type: TipoPermiso;
}
