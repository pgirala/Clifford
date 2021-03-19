import { FormioModel } from "./formio-model";
import { SubmissionData } from "./submission-data";

export interface Submission extends FormioModel {
  previousowner: string;
  data: SubmissionData;
}

