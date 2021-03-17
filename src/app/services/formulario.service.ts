import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { CONSTANST } from '~utils/constanst';
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
/*    params = params.append('active', sortActive);
    params = params.append('order', order);
    params = params.append('search', search);
    params = params.append('pageSize', pageSize.toString());
    params = params.append('page', page.toString());*/

    return this.http.get<Array<Formulario>>(
      CONSTANST.routes.formulario.list,
      { headers: this.headers, params: params, responseType: 'json', observe: 'body' }
    );
  }

  delete(id: number): Observable<Response> {
    return null;
  }

  getOne(id: number): Observable<Response> {
    return this.http.get<Response>(
      CONSTANST.routes.formulario.get.replace(':id', String(id)),
      { headers: this.headers }
    );
  }

  save(formulario: Formulario): Observable<Response> {
    return null;
  }
}
