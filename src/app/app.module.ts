import { APP_INITIALIZER, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { FormioModule } from '@formio/angular';

/*ESTE ARCHIVO CONTIENE IMPORTACIONES QUE ESTAN EN TODOS LOS MODULOS
PARA AHORRARSE LINEAS SE IMPORTAN EN EL Y LUEGO EL ARCHIVO SE IMPORTA
EN TODOS LOS MODULOS*/
import { SharedModule } from '~utils/shared.module';

// IMPORTACION DEL MODULO DE RUTAS
import { AppRoutingModule } from '~app/app.routes';

// IMPORTACION DE LOS GUARDS
import { AuthGuard } from '~guards/auth.guard';

// KEYCLOAK
import {TokenInterceptor} from "./interceptors/token-interceptor";
import {KeycloakService} from "./keycloak/keycloak.service";
import { OAuthModule, OAuthStorage  } from 'angular-oauth2-oidc';

// COMPONENTS
import { AppComponent } from '~components/app/app.component';
import { TablesComponent } from '~components/tables/tables.component';
import { ContactUsComponent } from '~components/contact-us/contact-us.component';
import { NotFoundComponent } from '~components/not-found/not-found.component';
import { ConfirmComponent } from '~components/confirm/confirm.component';
import { SnackbarComponent } from '~components/snackbar/snackbar.component';

// IMPORTACIÓN DE LOS SERVICES
import { AuthService } from '~services/auth.service';
import { UserService } from '~services/user.service';
import { ClientService } from '~app/services/client.service';
import { FormularioService } from '~app/services/formulario.service';
import { SubmissionService } from '~app/services/submission.service';
import { EnvioService } from '~app/services/envio.service';
import { FormioContextService } from '~app/services/formio-context.service';
import { ContextService } from '~app/services/context.service';

/*IMPORTACION DE LOS MODULES QUE A SU VEZ ELLOS IMPORTAN SUS PROPIOS COMPONENTES
ASI SE EVITA SATURAR ESTE ARCHIVO DE IMPORTACIONES Y SE MODULARIZA EL PROYECTO.*/
import { UserModule } from '~modules/user/user.module';
import { AdminLayoutModule } from '~modules/admin-layout/admin-layout.module';
import { LoginLayoutModule } from '~modules/login-layout/login-layout.module';

import { BackButtonDisableModule } from 'angular-disable-browser-back-button';

export function kcFactory(keycloakService: KeycloakService) {
  return () => keycloakService.init();
}
@NgModule({
  declarations: [ /*DECLARACIÓN DE COMPONENTES*/
    AppComponent,
    TablesComponent,
    ContactUsComponent,
    NotFoundComponent,
    ConfirmComponent,
    SnackbarComponent,
  ],
  imports: [ /*DECLARACIÓN DE MODULOS*/
    SharedModule,
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    HttpClientModule,
    OAuthModule.forRoot({
      resourceServer: {
          allowedUrls: [],
          sendAccessToken: true
      }
    }),
    AdminLayoutModule,
    LoginLayoutModule,
    UserModule,
    FormioModule,
    BackButtonDisableModule.forRoot()
  ],
  providers: [ /*DECLARACIÓN DE SERVICIOS*/
    KeycloakService,
    {
      provide: APP_INITIALIZER,
      useFactory: kcFactory,
      deps: [KeycloakService],
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true
    },
    { provide: OAuthStorage, useValue: localStorage },
    AuthGuard,
    AuthService,
    UserService,
    ClientService,
    FormularioService,
    SubmissionService,
    EnvioService,
    FormioContextService,
    ContextService
  ],
  entryComponents: [ /*AQUI SE AGREGAN LOS MAT-CONFIRM Y LOS MAT-SNACKBAR DE ANGULAR MATERIAL*/
    ConfirmComponent,
    SnackbarComponent
  ],
  bootstrap: [AppComponent]
})

export class AppModule { }
