import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { CONSTANTS } from '~utils/constants';
import { Submission } from '~app/models/submission';

import { FormioProvider } from '~base/formio-provider';
import { Observable } from 'rxjs';

@Injectable()
export class SubmissionService implements FormioProvider {
  loading = true;

  constructor(
    private http: HttpClient,
  ) { }

  headers = new HttpHeaders({
    'x-jwt-token': localStorage.getItem('token')
  });

  getList(sortActive: string, order: string, pageSize: number, page: number, search: string, formPath?: string): Observable<Array<Submission>> {
    let params = new HttpParams();
    /*params = params.append('select', 'created');
    params = params.append('select', 'modified');
    params = params.append('select', 'data.resumen');*/
    params = params.append('data.resumen__regex', search);
    params = params.append('sort', (order == 'desc' ? '-' : '') + (sortActive == 'resumen' ? 'data.' : '') + sortActive);
    params = params.append('limit', pageSize.toString());
    let numeroItemsYaMostrados = pageSize * (page - 1);
    params = params.append('skip', numeroItemsYaMostrados.toString());

    let path = CONSTANTS.routes.submission.list.replace(':formPath', formPath);

    return this.http.get<Array<Submission>>(
      path,
      { headers: this.headers, params: params, responseType: 'json', observe: 'body' }
    );
  }

  delete(id: string, formPath?:string): Observable<Submission> {
    let path = CONSTANTS.routes.submission.delete.replace(':formPath', formPath).replace(':id', String(id));
    return this.http.delete<Submission>(
      path,
      { headers: this.headers, responseType: 'json', observe: 'body' }
    );
  }

  getOne(id: string, formPath?: string): Observable<Submission> {
    let path = CONSTANTS.routes.submission.create.replace(':formPath', formPath).replace(':id', String(id));
    return this.http.get<Submission>(
      path,
      { headers: this.headers, responseType: 'json', observe: 'body' }
    );
  }

  save(submission: Submission, formPath?: string): Observable<Submission> {
    if (submission._id) { // actualización
      let path = CONSTANTS.routes.submission.update.replace(':formPath', formPath).replace(':id', String(submission._id));
      return this.http.put<Submission>(
        path,
        submission,
        { headers: this.headers, responseType: 'json', observe: 'body'}
      );
    } else { // creación
      let path = CONSTANTS.routes.submission.create.replace(':formPath', formPath);
      return this.http.post<Submission>(
        path,
        submission,
        { headers: this.headers, responseType: 'json', observe: 'body' }
      );
    }
  }

}
