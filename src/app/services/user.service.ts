import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { CONSTANTS } from '~utils/constants';
import { User } from '~app/models/user';
import { Role } from '~app/models/role';
import { FormioContextService } from '~services/formio-context.service';

import { FormioProvider } from '~base/formio-provider';
import { Observable } from 'rxjs';


@Injectable()
export class UserService implements FormioProvider  {
  constructor(private http: HttpClient, private formioContextService:FormioContextService) { }

  getRoleList(): Observable<Array<Role>>  {
    let path = CONSTANTS.routes.role.list;

    let headers = new HttpHeaders({
      'x-jwt-token': this.formioContextService.getTokenFormio()
    });

    return this.http.get<Array<Role>>(
      path,
      { headers: headers, responseType: 'json', observe: 'body' }
    );
  }

  getList(sortActive: string, order: string, pageSize: number, page: number, search: string): Observable<Array<User>> {
    return null;
  }

  getOne(email: string): Observable<User> {
    let path = CONSTANTS.routes.user.find.replace(':email', email);

    let headers = new HttpHeaders({
      'x-jwt-token': this.formioContextService.getTokenFormio()
    });

    return this.http.get<User>(
      path,
      { headers: headers, responseType: 'json', observe: 'body' }
    );
  }

  getOneIndividual(email: string): Observable<User> {
    let path = CONSTANTS.routes.user.find.replace(':email', email);

    let headers = new HttpHeaders({
      'x-jwt-token': this.formioContextService.getTokenFormioIndividual()
    });

    return this.http.get<User>(
      path,
      { headers: headers, responseType: 'json', observe: 'body' }
    );
  }

  getOneOrganizacion(email: string): Observable<User> {
    let path = CONSTANTS.routes.user.find.replace(':email', email);

    let headers = new HttpHeaders({
      'x-jwt-token': this.formioContextService.getTokenFormioOrganizacion()
    });

    return this.http.get<User>(
      path,
      { headers: headers, responseType: 'json', observe: 'body' }
    );
  }

  save(item: Object): Observable<User> {
    return null;
  }

  delete(id: string): Observable<User> {
    return null;
  }
}
