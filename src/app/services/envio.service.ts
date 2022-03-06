import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { CONSTANTS } from '~utils/constants';

import { Observable, Subject } from 'rxjs';
import { KeycloakService } from '../keycloak/keycloak.service';
import { JbpmService } from '~app/services/jbpm.service';

@Injectable()
export class EnvioService {
  enviosVisibilityChange: Subject<boolean> = new Subject<boolean>();

  constructor(
    private http: HttpClient,
    private keycloakService: KeycloakService,
    private jbpmService: JbpmService
  ) { }

  headers = new HttpHeaders({
    'Authorization': this.keycloakService.getAuthHeader()
  });

  create(submissionId: string): Observable<any> {
    // perfecciona la instancia del envío generado a través de su formulario
    return this.jbpmService.createInstance(CONSTANTS.routes.jbpm.flujoEnvio, submissionId, CONSTANTS.routes.envio.create);
  }

  setEnviosVisibility(visibilidad:boolean) {
    this.enviosVisibilityChange.next(visibilidad);
  }
}
