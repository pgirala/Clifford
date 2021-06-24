import { Submission } from "./submission";
import { Role } from "./role";

export interface User extends Submission {
  roles: Array<Role>;
  data: {superior: User, dominios?:Array<any>};
}
