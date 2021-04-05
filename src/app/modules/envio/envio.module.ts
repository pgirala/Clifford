import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from '~utils/shared.module';
import { EnvioComponent } from './envio.component';
import { DetailComponent } from './view/detail.component';
import { FormioModule } from '@formio/angular';

@NgModule({
  imports: [
    RouterModule.forChild([{path: '', component: EnvioComponent}]),
    FormioModule,
    SharedModule
  ],
  declarations: [
    EnvioComponent,
    DetailComponent
  ],
  providers: [],
  entryComponents: [
  ],
  exports: [
    RouterModule,
  ]
})
export class EnvioModule { }

