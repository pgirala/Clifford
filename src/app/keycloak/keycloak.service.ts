import {Injectable} from "@angular/core";
import * as Keycloak from "keycloak-js";
import {KeycloakInstance} from "keycloak-js";

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
        'url': 'http://localhost:8080/auth',
        'realm': 'Clifford',
        'clientId': 'clifford-front-end'
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
      'redirectUri': 'http://localhost:4200',
      'realm': 'spring-boot-quickstart',
      'clientId': 'angular-app'
    };
    this.keycloakAuth.logout(options);
  }
}
