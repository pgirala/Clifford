import { Submission } from "./submission";
import { Role } from "./role";

export interface User extends Submission {
  roles: Array<any>;
  admin: boolean;
  super: boolean;
  data: {superior: User, dominios?:Array<any>, email?:string};
}
