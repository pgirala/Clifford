import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { CONSTANTS } from '~utils/constants';
import { User } from '~app/models/user';

import { FormioProvider } from '~base/formio-provider';
import { Observable } from 'rxjs';


@Injectable()
export class UserService implements FormioProvider  {
  constructor(private http: HttpClient) { }

  getList(sortActive: string, order: string, pageSize: number, page: number, search: string): Observable<Array<User>> {
    return null;
  }

  getOne(email: string): Observable<User> {
    let path = CONSTANTS.routes.user.find.replace(':email', email);

    let headers = new HttpHeaders({
      'x-jwt-token': localStorage.getItem('tokenFormio')
    });

    return this.http.get<User>(
      path,
      { headers: headers, responseType: 'json', observe: 'body' }
    );
  }

  save(item: Object): Observable<User> {
    return null;
  }

  delete(id: string): Observable<User> {
    return null;
  }
}
