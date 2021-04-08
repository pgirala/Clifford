import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { CONSTANTS } from '~utils/constants';

import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

import { Submission } from '~app/models/submission';

@Injectable()
export class JbpmService {

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) { }

  headers = new HttpHeaders({
    'x-jwt-token': localStorage.getItem('token')
  });

  createInstance(flujo: string, submission: Submission): Observable<any> {
    console.log('====>', flujo);
    console.log('====>', JSON.stringify(submission));
    let path = CONSTANTS.routes.jbpm.createInstance.replace(':flujo', flujo);
    console.log('====>', path);
    return this.http.put<any>(
      path,
      {submission: submission._id},
      { headers: this.headers, responseType: 'json', observe: 'body'}
    )
  }

}
