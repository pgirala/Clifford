import {Injectable} from "@angular/core";
import * as Keycloak from "keycloak-js";
import {KeycloakInstance} from "keycloak-js";
import { CONSTANTS } from '~utils/constants';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import jwt_decode from "jwt-decode";
import { DialogUser } from '~models/dialog-user';

@Injectable({
  providedIn: 'root'
})
export class KeycloakService
{
  private keycloakAuth: KeycloakInstance;
  private acreditacionFio: DialogUser;

  constructor(public http: HttpClient)
  {

  }

  init(): Promise<any>
  {
    return new Promise((resolve, reject) =>
    {
      const config = {
        'url': CONSTANTS.keycloak.url,
        'realm': CONSTANTS.keycloak.realm,
        'clientId': CONSTANTS.keycloak.clientId
      };
      // @ts-ignore
      this.keycloakAuth = new Keycloak(config);
      this.keycloakAuth.init({onLoad: 'login-required'})
          .then(() =>
          {
            this.obtenerTokenFormio(); // va pidiendo el token con form.io
            resolve();
          })
          .catch(() =>
          {
            reject();
          });
    });
  }

  formioLogin(dialogUser: DialogUser): Observable<HttpResponse<any>> {
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

  public getAcreditacionFio() {
    if (this.acreditacionFio == null)
      this.acreditacionFio = this.acreditacionFormio();
    return this.acreditacionFio;
  }

  private obtenerTokenFormio() {
    this.formioLogin(this.getAcreditacionFio()).subscribe(
      (resp: HttpResponse<any>) => {
        if (resp.headers.get('x-jwt-token')) {
          localStorage.setItem('token', resp.headers.get('x-jwt-token'));
        }
      }
    );
  }

  private acreditacionFormio(): DialogUser {
    // obtener el payload del token original y firmarlo con
    let tokenDecodificado = jwt_decode(this.getToken());
    let tokenJSON = JSON.parse(JSON.stringify(tokenDecodificado));
    let dialogUser: DialogUser = {email: tokenJSON.user.id,
                                  password: tokenJSON.user.pwd};
    return dialogUser;
  }

  getToken(): string
  {
    return this.keycloakAuth.token;
  }

  getAuthHeader(url:string): string
  {
    if (url.match(CONSTANTS.routes.jbpm.patronURL)) {
      return "Basic " + btoa(this.getAcreditacionFio().email + ':' + this.getAcreditacionFio().password);
    }

    const authToken = this.getToken() || "";
    return "Bearer " + authToken;
  }

  logout()
  {
    const options = {
      'redirectUri': CONSTANTS.routes.local.root,
      'realm': CONSTANTS.keycloak.realm,
      'clientId': CONSTANTS.keycloak.clientId
    };
    this.keycloakAuth.logout(options);
  }

}
