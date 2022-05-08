import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from '~utils/shared.module';
import { TareaComponent } from './tarea.component';
import { DetailComponent } from './view/detail.component';
import { FormioModule } from '@formio/angular';

@NgModule({
  imports: [
    RouterModule.forChild([{path: '', component: EnvioComponent}]),
    FormioModule,
    SharedModule
  ],
  declarations: [
    TareaComponent,
    DetailComponent
  ],
  providers: [],
  entryComponents: [
  ],
  exports: [
    RouterModule,
  ]
})
export class TareaModule { }

