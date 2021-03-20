import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from '~utils/shared.module';
import { AdminLayoutComponent } from './admin-layout.component';
import { DashboardModule } from '~modules/dashboard/dashboard.module';
import { ClientModule } from '~modules/client/client.module';
import { FormularioModule } from '~modules/formulario/formulario.module';
import { SubmissionModule } from '~modules/submission/submission.module';
import { FormioModule } from 'angular-formio';
import { MatFormioModule } from '@formio/angular-material';

@NgModule({
  imports: [
    RouterModule,
    SharedModule,
    DashboardModule,
    ClientModule,
    FormularioModule,
    SubmissionModule,
    FormioModule,
    MatFormioModule
  ],
  declarations: [
    AdminLayoutComponent
  ],
  providers: [],
  exports: []
})
export class AdminLayoutModule {
}
