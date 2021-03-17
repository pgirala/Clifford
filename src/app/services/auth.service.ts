import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';

import { Observable } from 'rxjs';

import { DialogUser } from '~models/dialog-user';
import { CONSTANTS } from '~utils/constants';

@Injectable()
export class AuthService {
  public loggedIn = new BehaviorSubject<boolean>(this.hasToken());

  get isLoggedIn() {
    return this.loggedIn.asObservable();
  }

  constructor(
    public http: HttpClient
  ) { }

  headers = new HttpHeaders({
    'x-access-token': localStorage.getItem('token')
  });

  login(dialogUser: DialogUser): Observable<HttpResponse<any>> {
    return this.http.post<HttpResponse<any>>(
      CONSTANTS.routes.authorization.login, {
        data: {
          email: dialogUser.email,
          password: dialogUser.password
        }
      },
      {observe: 'response'}
    );
  }

  logout(): Observable<String> {
    return this.http.get(
      CONSTANTS.routes.authorization.logout,
      {responseType: 'text'}
    );
  }

  hasToken(): boolean {
    return !!localStorage.getItem('token');
  }

}
