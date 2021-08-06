import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { CONSTANTS } from '~utils/constants';
import { Formulario } from '~app/models/formulario';

import { FormioProvider } from '~base/formio-provider';
import { FormioContextService } from '~app/services/formio-context.service';
import { Observable, Subject } from 'rxjs';
import { ContextService } from '~app/services/context.service';

@Injectable()
export class FormularioService implements FormioProvider {
  formulariosVisibilityChange: Subject<boolean> = new Subject<boolean>();
  loading = true;

  constructor(
    private http: HttpClient,
    private formioContextService: FormioContextService,
    private contextService: ContextService
  ) { }

  headers() {
    return new HttpHeaders({
    'x-jwt-token': this.formioContextService.getTokenFormio()
  }) };

  getList(sortActive: string, order: string, pageSize: number, page: number, search: string): Observable<Array<Formulario>> {
    let params = new HttpParams();
    params = params.append('select', 'type');
    params = params.append('select', 'title');
    params = params.append('select', 'name');
    params = params.append('select', 'display');
    params = params.append('select', 'path');
    params = params.append('select', 'tags');
    params = params.append('select', 'submissionAccess');
    params = params.append('title__regex', search);
    params = params.append('path__regex', '/^' + this.contextService.getDominio().data.path + '/i');
    params = params.append('sort', (order == 'desc' ? '-' : '') + sortActive);
    params = params.append('limit', pageSize.toString());
    let numeroItemsYaMostrados = pageSize * (page - 1);
    params = params.append('skip', numeroItemsYaMostrados.toString());

    return this.http.get<Array<Formulario>>(
      CONSTANTS.routes.formulario.list,
      { headers: this.headers(), params: params, responseType: 'json', observe: 'body' }
    );
  }

  delete(id: string): Observable<Formulario> {
    return null;
  }

  getOne(id: string): Observable<Formulario> {
    return this.http.get<Formulario>(
      CONSTANTS.routes.formulario.get.replace(':id', String(id)),
      { headers: this.headers() }
    );
  }

  findByName(name: string): Observable<any> {
    let nameFilter = new HttpParams();
    nameFilter = nameFilter.append('name__regex', '/^' + name + '/i')

    return this.http.get<any>(
      CONSTANTS.routes.formulario.find,
      { headers: this.headers(),
      params: nameFilter }
    );
  }

  save(formulario: Formulario): Observable<Formulario> {
    if (formulario._id) { // actualización
      return this.http.put<Formulario>(
        CONSTANTS.routes.formulario.update.replace(':id', String(formulario._id)),
        formulario,
        { headers: this.headers(), responseType: 'json', observe: 'body'}
      );
      } else {
        return this.http.post<Formulario>(
          CONSTANTS.routes.formulario.create,
          formulario,
          { headers: this.headers(), responseType: 'json', observe: 'body'}
        );
      }
  }

  setFormulariosVisibility(visibilidad:boolean) {
    this.formulariosVisibilityChange.next(visibilidad);
  }
}
