import {Injectable} from "@angular/core";
import * as Keycloak from "keycloak-js";
import {KeycloakInstance} from "keycloak-js";
import { CONSTANTS } from '~utils/constants';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import jwt_decode from "jwt-decode";
import { DialogUser } from '~models/dialog-user';
import { UserService } from '~services/user.service';
import { FormioContextService } from '~services/formio-context.service';
import { ContextService } from '~services/context.service';
import { User } from "~app/models/user";

@Injectable({
  providedIn: 'root'
})
export class KeycloakService
{
  private keycloakAuth: KeycloakInstance;

  constructor(public http: HttpClient, public userService: UserService,
              public formioContextService: FormioContextService,
              public contextService: ContextService)
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
            this.obtenerTokensFormio(); // va pidiendo el token con form.io
            resolve();
          })
          .catch(() =>
          {
            reject();
          });
    });
  }

  formioLogin(dialogUser: DialogUser, individual:boolean = false): Observable<HttpResponse<any>> {
    return this.http.post<HttpResponse<any>>(
      CONSTANTS.routes.authorization.login, {
        data: {
          email: (individual ?  dialogUser.email : dialogUser.organization + CONSTANTS.permissions.sufijoCorreo),
          password: dialogUser.password
        }
      },
      {observe: 'response'}
    );
  }

  obtenerTokensFormio() {
    // El usuario puede actuar en nombre propio o en nombre de su organización, por lo que se obtienen los dos tokens
    let acreditacion:DialogUser = this.acreditacionFormio(this.getToken());
    this.contextService.removeDominio();
    this.obtenerTokenFormioIndividual(acreditacion);
    this.obtenerTokenFormioOrganizacion(acreditacion);
  }

  obtenerTokenFormioIndividual(acreditacion:DialogUser) {
    // elimina los token existentes
    this.formioContextService.removeTokenFormioIndividual();
    this.formioContextService.removeUserFormioIndividual();

    this.formioLogin(acreditacion, true).subscribe(
      (resp: HttpResponse<any>) => {
        if (resp.headers.get('x-jwt-token')) {
          this.formioContextService.setTokenFormioIndividual(resp.headers.get('x-jwt-token'));
          this.userService.getOneIndividual(acreditacion.email).subscribe(
            (users: User) => {
              if (users[0]) {
                this.contextService.setUserFormioIndividual(users[0]);
                this.contextService.setUserNameIndividual(acreditacion.name);
              }
            }
          );
        }
      }
    );
  }

  obtenerTokenFormioOrganizacion(acreditacion:DialogUser) {
    // elimina los token existentes
    this.formioContextService.removeTokenFormioOrganizacion();
    this.formioContextService.removeUserFormioOrganizacion();

    this.formioLogin(acreditacion, false).subscribe(
      (resp: HttpResponse<any>) => {
        if (resp.headers.get('x-jwt-token')) {
          this.formioContextService.setTokenFormioOrganizacion(resp.headers.get('x-jwt-token'));
          this.userService.getOneOrganizacion(acreditacion.organization + CONSTANTS.permissions.sufijoCorreo).subscribe(
            (users: User) => {
              if (users[0]) {
                this.contextService.setUserFormioOrganizacion(users[0]);
                this.contextService.setUserNameOrganizacion(acreditacion.organization);
              }
            }
          );
        }
      }
    );
  }

  acreditacionFormio(token: any): DialogUser {
    let tokenDecodificado = jwt_decode(token);
    let tokenJSON = JSON.parse(JSON.stringify(tokenDecodificado));
    let dialogUser: DialogUser = {name: tokenJSON.preferred_username,
                                  email: tokenJSON.email,
                                  password: tokenJSON.user.pwd,
                                  organization: tokenJSON.user.organization};
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
