import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';

import { CONSTANTS } from '~utils/constants';

import {KeycloakService} from "../keycloak/keycloak.service";
import { FormioContextService } from '~services/formio-context.service';
import { User } from '~app/models/user';
import { Role } from '~app/models/role';
import { Formulario } from "~app/models/formulario";
import { TipoPermiso } from "~app/models/enums";

@Injectable()
export class AuthService {
  public loggedIn = new BehaviorSubject<boolean>(this.hasToken());

  get isLoggedIn() {
    return this.loggedIn.asObservable();
  }

  constructor(
    public http: HttpClient,
    public keycloakService:KeycloakService,
    public formioContextService: FormioContextService
  ) { }

  headers = new HttpHeaders({
    'x-access-token': this.getTokenFormio()
  });

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
    return this.formioContextService.getTokenFormio();
  }

  hasTokenFormio(): boolean {
    return !!this.formioContextService.getTokenFormio();
  }

  hasToken(): boolean {
    return this.hasTokenKC() || this.hasTokenFormio();
  }

  getSuperior(): User {
    try {
      return this.formioContextService.getUserFormio().data.superior;
    } catch {
      return null;
    }
  }

  tieneAcceso(user: User, formulario: Formulario, tipoPermiso: TipoPermiso): boolean {
    try {
      if (!user || !formulario || !tipoPermiso)
        return false;
      // primero localiza el tipo de permiso en el formulario
      let roles = new Array<Role>();
      for (let permiso of formulario.submissionAccess)
        if (permiso.type == tipoPermiso.valueOf()) {
          roles = permiso.roles;
          break;
        }
      // después comprueba si alguno de los roles está entre los roles del usuario
      if (roles.length == 0)
        return false;
      for (let roleGranted of roles)
        for (let rolePlayed of user.roles)
          if (rolePlayed == roleGranted) {
            return true;
          }
      return false;
      } catch {
        return false;
      }
  }
}
