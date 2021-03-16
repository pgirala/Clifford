import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable } from 'rxjs';

import { User } from '~models/user';
import { Response } from '~app/models/response';
import { CONSTANST } from '~utils/constanst';

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

  login(user: User): Observable<Response> {
    return this.http.post<Response>(
      CONSTANST.routes.authorization.login, {
        data: {
          email: user.user_name, // en form.io la identificación es con el correo
          password: user.password
        }
      }
    );
  }

  logout(): Observable<String> {
    return this.http.get(
      CONSTANST.routes.authorization.logout,
      {responseType: 'text'}
    );
  }

  hasToken(): boolean {
    return !!localStorage.getItem('token');
  }

}
