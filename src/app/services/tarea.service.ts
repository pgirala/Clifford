import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { CONSTANTS } from '~utils/constants';

import { Observable, Subject } from 'rxjs';
import { KeycloakService } from '../keycloak/keycloak.service';
import { JbpmService } from '~app/services/jbpm.service';

import { Submission } from '~app/models/submission';

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

  getList(processId: string, sortActive: string, order: string,
    pageSize: number, page: number,
    search: string
    //, formPath?: string, dominioPath?: string
  ): Observable<any> {
    if (sortActive === "task-created-on")
      sortActive = "createdOn";
    else if (sortActive === "task-name")
      sortActive = "name";
    else if (sortActive === "task-status")
      sortActive = "status";
    else // por defecto la fecha de creación
      sortActive = "createdOn";
    return this.jbpmService.getList(processId, sortActive, order, pageSize, page, search)
  }

  setTareasVisibility(visibilidad: boolean) {
    this.tareasVisibilityChange.next(visibilidad);
  }
}
