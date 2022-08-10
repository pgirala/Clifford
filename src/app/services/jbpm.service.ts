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

  headers = new HttpHeaders({
    'Authorization': this.keycloakService.getAuthHeader()
  });

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

  getList(sortActive: string, order: string,
    pageSize: number, page: number,
    search: string): Observable<any> {
    return this.http.post<any>(
      CONSTANTS.routes.jbpm.tareas.replace(':page', (page - 1).toString())
        .replace(':pageSize', pageSize.toString()),
      {
        "order-by": sortActive,
        "order-asc": (order == "asc"),
        "query-params": [{
          "cond-column": "name",
          "cond-operator": "LIKE_TO",
          "cond-values": [search + "%"]
        }]
      },
      { headers: this.headers, responseType: 'json', observe: 'body' }
    );
  }

  getProcedimientos(): Observable<any> {
    return this.http.get<any>(
      CONSTANTS.routes.jbpm.procesos,
      { headers: this.headers, responseType: 'json', observe: 'body' }
    );
  }
}
