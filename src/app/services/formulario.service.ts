import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { CONSTANTS } from '~utils/constants';
import { Formulario } from '~app/models/formulario';

import { FormioProvider } from '~base/formio-provider';
import { Observable } from 'rxjs';

@Injectable()
export class FormularioService implements FormioProvider {
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
    params = params.append('select', 'path');
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

  delete(id: string): Observable<Formulario> {
    return null;
  }

  getOne(id: string): Observable<Formulario> {
    return this.http.get<Formulario>(
      CONSTANTS.routes.formulario.get.replace(':id', String(id)),
      { headers: this.headers }
    );
  }

  findOne(name: string): Observable<Formulario> {
    let nameFilter = new HttpParams();
    nameFilter = nameFilter.append('name__regex', '/^' + name + '/i')

    return this.http.get<Formulario>(
      CONSTANTS.routes.formulario.find,
      { headers: this.headers,
      params: nameFilter }
    );
  }

  save(formulario: Formulario): Observable<Formulario> {
    return null;
  }
}
