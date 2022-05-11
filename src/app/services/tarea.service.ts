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
    return this.jbpmService.createInstance(CONSTANTS.routes.jbpm.flujoEnvio, submissionId, CONSTANTS.routes.tarea.url, CONSTANTS.routes.usuario.url);
  }

  setTareasVisibility(visibilidad:boolean) {
    this.tareasVisibilityChange.next(visibilidad);
  }
}
