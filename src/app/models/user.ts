import { Submission } from "./submission";

export interface User extends Submission {
  data: {superior: User};
}
