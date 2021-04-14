import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';

import { DialogUser } from '~models/dialog-user';
import { CONSTANTS } from '~utils/constants';

import {KeycloakService} from "../keycloak/keycloak.service";
import { User } from '~app/models/user';
import { errorObject } from 'rxjs/internal-compatibility';

@Injectable()
export class AuthService {
  public loggedIn = new BehaviorSubject<boolean>(this.hasToken());

  get isLoggedIn() {
    return this.loggedIn.asObservable();
  }

  constructor(
    public http: HttpClient,
    public keycloakService:KeycloakService
  ) { }

  headers = new HttpHeaders({
    'x-access-token': this.getTokenFormio()
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
    if (this.keycloakService != null && this.keycloakService.getToken() != null) {
      this.keycloakService.logout();
      return of('OK');
    } else
    return this.http.get(
      CONSTANTS.routes.authorization.logout,
      {responseType: 'text'}
    );
  }

  hasTokenKC(): boolean {
    return (this.keycloakService != null && this.keycloakService.getToken() != null);
  }

  public getTokenFormio():string {
    return localStorage.getItem('token');
  }

  hasTokenFormio(): boolean {
    return !!this.getTokenFormio();
  }

  hasToken(): boolean {
    return this.hasTokenKC() || this.hasTokenFormio();
  }

  getSuperior(): User {
    try {
      return JSON.parse(localStorage.getItem('userFormio')).data.superior;
    } catch {
      return null;
    }
  }
}
