import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from '~utils/shared.module';
import { FormularioComponent } from './formulario.component';
import { DetailComponent } from './view/detail.component';
import { FormioModule } from '@formio/angular';

@NgModule({
  imports: [
    RouterModule.forChild([{path: '', component: FormularioComponent}]),
    FormioModule,
    SharedModule
  ],
  declarations: [
    FormularioComponent,
    DetailComponent
  ],
  providers: [],
  entryComponents: [
  ],
  exports: [
    RouterModule,
  ]
})
export class FormularioModule { }

