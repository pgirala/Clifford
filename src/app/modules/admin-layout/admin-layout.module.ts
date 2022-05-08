import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from '~utils/shared.module';
import { AdminLayoutComponent } from './admin-layout.component';
import { DashboardModule } from '~modules/dashboard/dashboard.module';
import { FormularioModule } from '~modules/formulario/formulario.module';
import { SubmissionModule } from '~modules/submission/submission.module';
import { TareaModule } from '~modules/tarea/tarea.module';
import { FormioModule } from '@formio/angular';
import { AyudaModule } from '~modules/ayuda/ayuda.module';

@NgModule({
  imports: [
    RouterModule,
    SharedModule,
    DashboardModule,
    FormularioModule,
    SubmissionModule,
    EnvioModule,
    FormioModule,
    AyudaModule
  ],
  declarations: [
    AdminLayoutComponent
  ],
  providers: [],
  exports: []
})
export class AdminLayoutModule {
}
