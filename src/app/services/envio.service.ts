import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { CONSTANTS } from '~utils/constants';

import { Observable, Subject } from 'rxjs';
import { KeycloakService } from '../keycloak/keycloak.service';

import { environment } from '../../environments/environment';

@Injectable()
export class EnvioService {
  enviosVisibilityChange: Subject<boolean> = new Subject<boolean>();

  constructor(
    private http: HttpClient,
    private keycloakService: KeycloakService
  ) { }

  headers = new HttpHeaders({
    'Authorization': this.keycloakService.getAuthHeader()
  });

  create(submissionId: string): Observable<any> {
    // perfecciona la instancia del envío generado a través de su formulario
    return this.http.post<any>(
      environment.settings.BK_HOST + CONSTANTS.routes.envio.create,
      { submissionId: submissionId },
      {
        headers: this.headers,
        responseType: 'json', observe: 'body'
      }
    );
  }

  setEnviosVisibility(visibilidad: boolean) {
    this.enviosVisibilityChange.next(visibilidad);
  }
}
