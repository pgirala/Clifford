import {Injectable} from "@angular/core";
import * as Keycloak from "keycloak-js";
import {KeycloakInstance} from "keycloak-js";
import { CONSTANTS } from '~utils/constants';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import jwt_decode from "jwt-decode";
import { DialogUser } from '~models/dialog-user';
import { UserService } from '~services/user.service';
import { User } from "~app/models/user";

@Injectable({
  providedIn: 'root'
})
export class KeycloakService
{
  private keycloakAuth: KeycloakInstance;

  constructor(public http: HttpClient, public userService: UserService)
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

  obtenerTokenFormio() {
    let acreditacion:DialogUser = this.acreditacionFormio(this.getToken());
    this.formioLogin(acreditacion).subscribe(
      (resp: HttpResponse<any>) => {
        if (resp.headers.get('x-jwt-token')) {
          localStorage.setItem('tokenFormio', resp.headers.get('x-jwt-token'));

          this.userService.getOne(this.acreditacionFormio(this.getToken()).email).subscribe(
            (users: User) => {
              if (users[0])
                localStorage.setItem('userFormio', JSON.stringify(users[0]));
            }
          );
        }
      }
    );
  }

  acreditacionFormio(token: any): DialogUser {
    // obtener el payload del tokenn original y firmarlo con
    let tokenDecodificado = jwt_decode(token);
    let tokenJSON = JSON.parse(JSON.stringify(tokenDecodificado));
    let dialogUser: DialogUser = {email: tokenJSON.user.id,
                                  password: tokenJSON.user.pwd};
    return dialogUser;
  }

  getToken(): string
  {
    return this.keycloakAuth.token;
  }

  getAuthHeader(): string
  {
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
