import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { CONSTANTS } from '~utils/constants';

import { Observable } from 'rxjs';
import { AuthService } from '~services/auth.service';
import { KeycloakService } from '../keycloak/keycloak.service';

import { environment } from '../../environments/environment';

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

  crearInstanciaProceso(idFlujo: string, idContenedor: string): Observable<any> {
    let path = environment.settings.JB_HOST + CONSTANTS.routes.jbpm.crearInstanciaProceso.replace(':idContenedor', idContenedor).replace(':idFlujo', idFlujo);
    return this.http.post<any>(
      path,
      {},
      {
        headers: new HttpHeaders({
          'Authorization': this.keycloakService.getAuthHeader()
        }),
        responseType: 'json',
        observe: 'body'
      }
    );
  }

  // método para dar por completada una tarea
  cambiarEstadoTarea(idTarea: string, idContenedor: string, estado: string, datosFormulario: any): Observable<any> {
    let path = environment.settings.JB_HOST + CONSTANTS.routes.jbpm.cambiarEstadoTarea.replace(':idContenedor', idContenedor).replace(':idTarea', idTarea).replace(':estado', estado);
    return this.http.put<any>(
      path,
      { formData: datosFormulario },
      {
        headers: new HttpHeaders({
          'Authorization': this.keycloakService.getAuthHeader()
        }),
        responseType: 'json',
        observe: 'body'
      }
    );
  }

  getDatosEntradaFormularioTarea(idTarea: string, idContenedor: string): Observable<any> {
    let path: string = environment.settings.JB_HOST + CONSTANTS.routes.jbpm.tratarDatosEntrada.replace(':idContenedor', idContenedor).replace(':idTarea', idTarea);
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

  setDatosSalidaFormularioTarea(idTarea: string, idContenedor: string, datosFormulario: any): Observable<any> {
    let path = environment.settings.JB_HOST + CONSTANTS.routes.jbpm.tratarDatosSalida.replace(':idContenedor', idContenedor).replace(':idTarea', idTarea);
    return this.http.put<any>(
      path,
      { formData: datosFormulario },
      {
        headers: new HttpHeaders({
          'Authorization': this.keycloakService.getAuthHeader()
        }),
        responseType: 'json',
        observe: 'body'
      }
    );
  }

  getDatosSalidaFormularioTarea(idTarea: string, idContenedor: string): Observable<any> {
    let path: string = environment.settings.JB_HOST + CONSTANTS.routes.jbpm.tratarDatosSalida.replace(':idContenedor', idContenedor).replace(':idTarea', idTarea);
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
      environment.settings.JB_HOST + CONSTANTS.routes.jbpm.tareas.replace(':page', (page - 1).toString())
        .replace(':pageSize', pageSize.toString()),
      {
        "order-by": sortActive,
        "order-asc": (order == "asc"),
        "query-params": [{
          "cond-column": "processId",
          "cond-operator": (processId === '' ? "LIKE_TO" : "EQUALS_TO"),
          "cond-values": [(processId === '' ? '%' : processId)]
        },
        {
          "cond-column": null,
          "cond-operator": "OR",
          "cond-values": [{
            "cond-column": "actualowner",
            "cond-operator": (userId === '' ? "LIKE_TO" : "EQUALS_TO"),
            "cond-values": [(userId === '' ? '%' : userId)]
          }, {
            "cond-column": null,
            "cond-operator": "AND",
            "cond-values": [
              {
                "cond-column": "actualowner",
                "cond-operator": "EQUALS_TO",
                "cond-values": [""]
              },
              {
                "cond-column": "id",
                "cond-operator": "IN",
                "cond-values": ["gestor"]
              }
            ]
          }]
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
      environment.settings.JB_HOST + CONSTANTS.routes.jbpm.procesos,
      { headers: this.headers, responseType: 'json', observe: 'body' }
    );
  }
}
