import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';

import { DialogUser } from '~models/dialog-user';
import { CONSTANTS } from '~utils/constants';

import {KeycloakService} from "../keycloak/keycloak.service";

import jwt_decode from "jwt-decode";

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
    if (this.keycloakService != null && this.keycloakService.getToken() != null) {
      this.keycloakService.logout();
      return of('OK');
    } else
    return this.http.get(
      CONSTANTS.routes.authorization.logout,
      {responseType: 'text'}
    );
  }

  tokenTransformado(token: string): string {
    // obtener el payload del tokenn original y firmarlo con
    let tokenDecodificado = jwt_decode(token);
    return token; // TODO: falta firmarlo
  }

  hasToken(): boolean {
    if (this.keycloakService != null && this.keycloakService.getToken() != null)
      localStorage.setItem('token', this.tokenTransformado(this.keycloakService.getToken()))

    return !!localStorage.getItem('token');
  }

}
