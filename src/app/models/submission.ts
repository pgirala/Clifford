import { FormioModel } from "./formio-model";

export interface Submission extends FormioModel {
  previousowner?: string;
  data: any;
}

