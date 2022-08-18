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

  // NOTA: las instancias de procesos se crearán desde BusinessCentral

  // método para dar por completada una tarea
  cambiarEstadoTarea(idTarea: string, idContenedor: string, estado: string, datosFormulario: any): Observable<any> {
    let path = CONSTANTS.routes.jbpm.cambiarEstadoTarea.replace(':idContenedor', idContenedor).replace(':idTarea', idTarea).replace(':estado', estado);
    return this.http.put<any>(
      path,
      { formData: JSON.stringify(datosFormulario) },
      {
        headers: new HttpHeaders({
          'Authorization': this.keycloakService.getAuthHeader()
        }),
        responseType: 'json',
        observe: 'body'
      }
    );
  }

  getDatosFormularioTarea(idTarea: string, idContenedor: string): Observable<any> {
    let path: string = CONSTANTS.routes.jbpm.tratarDatosSalida.replace(':idContenedor', idContenedor).replace(':idTarea', idTarea);
    return this.http.get<any>(
      path,
      {
        headers: new HttpHeaders({
          'Authorization': this.keycloakService.getAuthHeader()
        }),
        responseType: 'json',
        observe: 'body'
      }
    );
  }

  getList(processId: string, userId: string, estado: string, sortActive: string, order: string,
    pageSize: number, page: number,
    search: string): Observable<any> {
    return this.http.post<any>(
      CONSTANTS.routes.jbpm.tareas.replace(':page', (page - 1).toString())
        .replace(':pageSize', pageSize.toString()),
      {
        "order-by": sortActive,
        "order-asc": (order == "asc"),
        "query-params": [{
          "cond-column": "processId",
          "cond-operator": (processId === '' ? "LIKE_TO" : "EQUALS_TO"),
          "cond-values": [(processId === '' ? '%' : processId)]
        }, {
          "cond-column": "actualowner",
          "cond-operator": (userId === '' ? "LIKE_TO" : "EQUALS_TO"),
          "cond-values": [(userId === '' ? '%' : userId)]
        }, {
          "cond-column": "name",
          "cond-operator": "LIKE_TO",
          "cond-values": [search + "%"]
        }, {
          "cond-column": "status",
          "cond-operator": (estado === '' ? "LIKE_TO" : "EQUALS_TO"),
          "cond-values": [(estado === '' ? '%' : estado)]
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
