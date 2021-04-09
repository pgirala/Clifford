import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpXsrfTokenExtractor} from "@angular/common/http";
import {Injectable, SystemJsNgModuleLoader} from "@angular/core";
import {Observable} from "rxjs";
import {KeycloakService} from "../keycloak/keycloak.service";

@Injectable()
export class TokenInterceptor implements HttpInterceptor
{
  constructor(private kcService: KeycloakService,private tokenExtractor: HttpXsrfTokenExtractor)
  {
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>>
  {
    const token = this.tokenExtractor.getToken() as string;

    request = request.clone({
      setHeaders: {
        "Authorization": this.kcService.getAuthHeader(request.url)
      }
    });
    return next.handle(request);
  }
}
