import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { CONSTANTS } from '~utils/constants';

import { Observable } from 'rxjs';
import { KeycloakService } from '../keycloak/keycloak.service';

import { Submission } from '~app/models/submission';

import { DialogUser } from '~models/dialog-user';

@Injectable()
export class JbpmService {

  constructor(
    private http: HttpClient,
    private keycloakService: KeycloakService
  ) { }

  headers = new HttpHeaders({
    'Authorization': 'Basic ' + btoa(this.keycloakService.acreditacionFormio().email + ':' + this.keycloakService.acreditacionFormio().password),
    'Access-Control-Allow-Origin': '*'
  });

  createInstance(flujo: string, submission: Submission): Observable<any> {
    let path = CONSTANTS.routes.jbpm.createInstance.replace(':flujo', flujo);
    return this.http.put<any>(
      path,
      {submission: submission._id},
      { headers: this.headers, responseType: 'json', observe: 'body'}
    )
  }

}
