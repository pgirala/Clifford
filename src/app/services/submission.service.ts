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

  getList(sortActive: string, order: string, pageSize: number, page: number, search: string): Observable<Array<Submission>> {
    let params = new HttpParams();
    params = params.append('select', 'title');
    params = params.append('title__regex', search);
    params = params.append('path__regex', '/^' + CONSTANTS.routes.formulario.scope + '/i');
    params = params.append('sort', (order == 'desc' ? '-' : '') + sortActive);
    params = params.append('limit', pageSize.toString());
    let numeroItemsYaMostrados = pageSize * (page - 1);
    params = params.append('skip', numeroItemsYaMostrados.toString());

    return this.http.get<Array<Submission>>(
      CONSTANTS.routes.formulario.list,
      { headers: this.headers, params: params, responseType: 'json', observe: 'body' }
    );
  }

  delete(id: string): Observable<Submission> {
    return this.http.delete<Submission>(
      CONSTANTS.routes.submission.delete.replace(':id', String(id)),
      { headers: this.headers }
    );
  }

  getOne(id: string): Observable<Submission> {
    return this.http.get<Submission>(
      CONSTANTS.routes.submission.get.replace(':id', String(id)),
      { headers: this.headers }
    );
  }

  save(submission: Submission): Observable<Submission> {
    // TODO: distinguir si es creación o actualización, basándose en la existencia del ID.
    return this.http.post<Submission>(
      CONSTANTS.routes.submission.create,
      {
/*        txtFirstName: client.first_name,
        txtLastName: client.last_name,
        txtAge: client.age,
        txtGender: client.gender,
        id: client._id */
      },
      { headers: this.headers }
    );
  }

}
