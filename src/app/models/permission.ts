import { Role } from "./Role";

export interface Permission {
  roles: Array<Role>;
  type: string;
}

