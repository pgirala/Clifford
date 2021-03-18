import { FormioModel } from '~app/models/formio-model';
import { Observable } from 'rxjs';

export abstract class FormioProvider {

  constructor() { }

  abstract getList(sortActive: string, order: string, pageSize: number, page: number, search: string): Observable<Array<FormioModel>>;

  abstract getOne(id: string): Observable<FormioModel>;

  abstract save(item: Object): Observable<FormioModel>;

  abstract delete(id: string): Observable<FormioModel>;

}
