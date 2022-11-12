import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { CONSTANTS } from '~utils/constants';
import { Submission } from '~app/models/submission';

import { FormioProvider } from '~base/formio-provider';
import { FormioContextService } from '~app/services/formio-context.service';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

import { environment } from '../../environments/environment';

@Injectable()
export class SubmissionService implements FormioProvider {
  loading = true;

  constructor(
    private http: HttpClient,
    private formioContextService: FormioContextService,
    private authService: AuthService
  ) { }

  headers() {
    return new HttpHeaders({
      'x-jwt-token': this.formioContextService.getTokenFormio()
    })
  };

  getList(sortActive: string, order: string, pageSize: number, page: number, search: string, formPath?: string, dominioPath?: string): Observable<Array<Submission>> {
    let params = new HttpParams();
    /*params = params.append('select', 'created');
    params = params.append('select', 'modified');
    params = params.append('select', 'data.resumen');*/
    params = params.append('data.resumen__regex', search);
    if (dominioPath)
      params = params.append('data.dominio__regex', dominioPath);
    params = params.append('sort', (order == 'desc' ? '-' : '') + (sortActive == 'resumen' ? 'data.' : '') + sortActive);
    params = params.append('limit', pageSize.toString());
    let numeroItemsYaMostrados = pageSize * (page - 1);
    params = params.append('skip', numeroItemsYaMostrados.toString());

    let path = environment.settings.FI_HOST + CONSTANTS.routes.submission.list.replace(':formPath', formPath);

    return this.http.get<Array<Submission>>(
      path,
      { headers: this.headers(), params: params, responseType: 'json', observe: 'body' }
    );
  }

  delete(id: string, formPath?: string): Observable<Submission> {
    let path = environment.settings.FI_HOST + CONSTANTS.routes.submission.delete.replace(':formPath', formPath).replace(':id', String(id));
    return this.http.delete<Submission>(
      path,
      { headers: this.headers(), responseType: 'json', observe: 'body' }
    );
  }

  getOne(id: string, formPath?: string): Observable<Submission> {
    let path = environment.settings.FI_HOST + CONSTANTS.routes.submission.get.replace(':formPath', formPath).replace(':id', String(id));
    return this.http.get<Submission>(
      path,
      { headers: this.headers(), responseType: 'json', observe: 'body' }
    );
  }

  save(submission: Submission, formPath?: string): Observable<Submission> {
    if (submission._id) { // actualización
      let path = environment.settings.FI_HOST + CONSTANTS.routes.submission.update.replace(':formPath', formPath).replace(':id', String(submission._id));
      return this.http.put<Submission>(
        path,
        submission,
        { headers: this.headers(), responseType: 'json', observe: 'body' }
      );
    } else { // creación
      let path = environment.settings.FI_HOST + CONSTANTS.routes.submission.create.replace(':formPath', formPath);
      return this.http.post<Submission>(
        path,
        submission,
        { headers: this.headers(), responseType: 'json', observe: 'body' }
      );
    }
  }


  public addToken(submission: Submission) {
    let resultado = JSON.parse(JSON.stringify(submission)); // obtiene un clon
    let serializedData = JSON.stringify(submission.data);
    let tokenData = '{' + '"tokenkc":"' + this.authService.getHeaderTokenKC() + '",' +
      '"token": "' + this.authService.getTokenFormio() + '"' + (serializedData.length > 2 ? ', ' : '') +
      serializedData.substring(1, serializedData.length);
    resultado.data = JSON.parse(tokenData);
    return resultado;
  }


}
