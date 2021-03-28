import {Injectable} from "@angular/core";
import * as Keycloak from "keycloak-js";
import {KeycloakInstance} from "keycloak-js";
import { CONSTANTS } from '~utils/constants';

@Injectable({
  providedIn: 'root'
})
export class KeycloakService
{
  private keycloakAuth: KeycloakInstance;

  constructor()
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
            resolve();
          })
          .catch(() =>
          {
            reject();
          });
    });
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
