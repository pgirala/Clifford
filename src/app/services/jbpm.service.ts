import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { CONSTANTS } from '~utils/constants';

import { Observable } from 'rxjs';
import { AuthService } from '~services/auth.service';
import { KeycloakService } from '../keycloak/keycloak.service';

@Injectable()
export class JbpmService {

  constructor(
    private http: HttpClient,
    private keycloakService: KeycloakService,
    private authService: AuthService
  ) { }

  createInstance(flujo: string, submissionId: string, urlEnvio: string, urlUsuario: string): Observable<any> {
    let path = CONSTANTS.routes.jbpm.crearInstanciaProceso.replace(':flujo', flujo);
    return this.http.post<any>(
      path,
      {
        submissionId: submissionId,
        kctoken: this.authService.getTokenKC(),
        urlEnvio: urlEnvio,
        urlUsuario: urlUsuario
      },
      {
        headers: new HttpHeaders({
          'Authorization': this.keycloakService.getAuthHeader()
        }),
        responseType: 'json',
        observe: 'body'
      }
    );
  }

}
