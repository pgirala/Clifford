import { Response } from '~app/models/response';
import { Observable } from 'rxjs';

export abstract class Provider {

  constructor() { }

  abstract getList(sortActive: string, order: string, pageSize: number, page: number, search: string): Observable<Object>;

  abstract getOne(id: string): Observable<Response>;

  abstract save(item: Object): Observable<Response>;

  abstract delete(id: string): Observable<Response>;

}
