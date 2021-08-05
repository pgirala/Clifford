import {Injectable} from "@angular/core";
import * as Keycloak from "keycloak-js";
import {KeycloakInstance} from "keycloak-js";
import { CONSTANTS } from '~utils/constants';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { UserService } from '~services/user.service';
import { FormioContextService } from '~services/formio-context.service';
import { ContextService } from '~services/context.service';
import { User } from "~app/models/user";
import { Role } from "~app/models/role";

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

  formioLoginIndividual(): Observable<HttpResponse<any>> {
    return this.http.get<HttpResponse<any>>(
      CONSTANTS.routes.authorization.loginIndividual,
      {observe: 'response'}
    );
  }

  formioLoginOrganizacion(): Observable<HttpResponse<any>> {
    return this.http.get<HttpResponse<any>>(
      CONSTANTS.routes.authorization.loginOrganizacion,
      {observe: 'response'}
    );
  }

  obtenerTokensFormio() {
    // El usuario puede actuar en nombre propio o en nombre de su organización, por lo que se obtienen los dos tokens
    this.contextService.removeDominio();
    this.obtenerTokenFormioIndividual();
    this.obtenerTokenFormioOrganizacion();
  }

  obtenerTokenFormioIndividual() {
    // elimina los token existentes
    this.formioContextService.removeTokenFormioIndividual();
    this.formioContextService.removeUserFormioIndividual();

    this.formioLoginIndividual().subscribe(
      (resp: HttpResponse<any>) => {
        if (resp.body.token) {
          this.formioContextService.setTokenFormioIndividual(resp.body.token);
          this.userService.getOneIndividual(resp.body.codigoUsuario + CONSTANTS.permissions.sufijoCorreo).subscribe(
            (users: User) => {
              if (users[0]) {
                let usuario = users[0];
                this.contextService.setUserFormioIndividual(usuario);
                this.contextService.setUserNameIndividual(usuario.data.name);
                // determina si es administrador
                if (this.userService.getListaRoles() != null && this.userService.getListaRoles().length > 0)
                  this.determinarCondicionAdministrador(usuario);
                else
                  this.userService.getRoleList(this.contextService.getTokenFormioIndividual()).subscribe(
                    (roles: Array<Role>) => {
                      if (roles != null && roles.length > 0)
                        this.userService.setListaRoles(roles);
                      this.determinarCondicionAdministrador(usuario);
                    }
                  )
              }
            }
          );
        }
      }
    );
  }

  determinarCondicionAdministrador(usuario: User) {
    usuario.admin = this.esAdministrador(usuario, this.userService.getListaRoles());
    this.contextService.setUserFormioOrganizacion(usuario);
  }

  obtenerTokenFormioOrganizacion() {
    // elimina los token existentes
    this.formioContextService.removeTokenFormioOrganizacion();
    this.formioContextService.removeUserFormioOrganizacion();

    this.formioLoginOrganizacion().subscribe(
      (resp: HttpResponse<any>) => {
        if (resp.body.token) {
          this.formioContextService.setTokenFormioOrganizacion(resp.body.token);
          this.userService.getOneOrganizacion(resp.body.codigoUsuario + CONSTANTS.permissions.sufijoCorreo).subscribe(
            (users: User) => {
              if (users[0]) {
                let usuario = users[0];
                this.contextService.setUserFormioOrganizacion(usuario);
                this.contextService.setUserNameOrganizacion(usuario.data.name);
                // determina si es el administrador
                if (this.userService.getListaRoles() != null && this.userService.getListaRoles().length > 0)
                  this.determinarCondicionAdministrador(usuario);
                else
                  this.userService.getRoleList(this.contextService.getTokenFormioOrganizacion()).subscribe(
                    (roles: Array<Role>) => {
                      if (roles != null && roles.length > 0)
                        this.userService.setListaRoles(roles);
                      this.determinarCondicionAdministrador(usuario);
                    }
                  )
              }
            }
          );
        }
      }
    );
  }

  esAdministrador(user: User, roles: Array<Role>) {
    if (!user || !roles)
      return false;

    for (let userRole of user.roles) {
      for (let role of roles) {
        if (userRole == role._id && role.admin == true) {
          return true;
        }
      }
    }
    return false;
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
