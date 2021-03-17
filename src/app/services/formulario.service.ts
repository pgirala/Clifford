import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { CONSTANTS } from '~utils/constants';
import { Formulario } from '~app/models/formulario';
import { Response } from '~app/models/response';

import { Provider } from '~base/provider';
import { Observable } from 'rxjs';

@Injectable()
export class FormularioService implements Provider {
  loading = true;

  constructor(
    private http: HttpClient,
  ) { }

  headers = new HttpHeaders({
    'x-jwt-token': localStorage.getItem('token')
  });

  getList(sortActive: string, order: string, pageSize: number, page: number, search: string): Observable<Array<Formulario>> {
    let params = new HttpParams();
    params = params.append('select', 'title');
    params = params.append('title__regex', search);
    params = params.append('path__regex', '/^' + CONSTANTS.routes.formulario.scope + '/i');
    params = params.append('sort', (order == 'desc' ? '-' : '') + sortActive);
    params = params.append('limit', pageSize.toString());
    let numeroItemsYaMostrados = pageSize * (page - 1);
    params = params.append('skip', numeroItemsYaMostrados.toString());

    return this.http.get<Array<Formulario>>(
      CONSTANTS.routes.formulario.list,
      { headers: this.headers, params: params, responseType: 'json', observe: 'body' }
    );
  }

  delete(id: string): Observable<Response> {
    return null;
  }

  getOne(id: string): Observable<Response> {
    return this.http.get<Response>(
      CONSTANTS.routes.formulario.get.replace(':id', String(id)),
      { headers: this.headers }
    );
  }

  save(formulario: Formulario): Observable<Response> {
    return null;
  }
}
