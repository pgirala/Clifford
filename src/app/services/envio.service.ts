import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { CONSTANTS } from '~utils/constants';

import { Observable } from 'rxjs';
import { KeycloakService } from '../keycloak/keycloak.service';

import { Submission } from '~app/models/submission';

import { Response } from '~app/models/response';

@Injectable()
export class EnvioService {

  constructor(
    private http: HttpClient,
    private keycloakService: KeycloakService
  ) { }

  create(submissionId: string): Observable<any> {
    // perfecciona la instancia del envío generado a través de su formulario
    return this.http.post<any>(
      CONSTANTS.routes.envio.create,
      {submissionId: submissionId},
      {responseType: 'json', observe: 'body'}
    );
  }

}
