import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { CONSTANTS } from '~utils/constants';

import { Observable, Subject } from 'rxjs';
import { KeycloakService } from '../keycloak/keycloak.service';
import { JbpmService } from '~app/services/jbpm.service';

import { Submission } from '~app/models/submission';
import { Task } from '~app/models/Task';

import { Response } from '~app/models/response';

@Injectable()
export class TareaService {
  tareasVisibilityChange: Subject<boolean> = new Subject<boolean>();

  constructor(
    private http: HttpClient,
    private keycloakService: KeycloakService,
    private jbpmService: JbpmService
  ) { }

  headers = new HttpHeaders({
    'Authorization': this.keycloakService.getAuthHeader()
  });

  create(submissionId: string): Observable<any> {
    // crea la instancia de un proceso
    return null;
    //return this.jbpmService.createInstance(CONSTANTS.routes.jbpm.flujoEnvio, submissionId, CONSTANTS.routes.tarea.url, CONSTANTS.routes.usuario.url);
  }

  getList(//sortActive: string, order: string, 
    pageSize: number, page: number,
    //search: string, formPath?: string, dominioPath?: string
  ): Observable<any> {
    let params = new HttpParams();
    //params = params.append('data.resumen__regex', search);
    params = params.append('mapper', 'UserTasks');
    //params = params.append('sort', (order == 'desc' ? '-' : '') + (sortActive == 'resumen' ? 'data.' : '') + sortActive);
    params = params.append('pageSize', pageSize.toString());
    params = params.append('page', (page - 1).toString());

    return this.http.post<any>(
      CONSTANTS.routes.jbpm.tareas,
      { headers: this.headers, params: params, responseType: 'json', observe: 'body' }
    );
  }

  setTareasVisibility(visibilidad: boolean) {
    this.tareasVisibilityChange.next(visibilidad);
  }
}
