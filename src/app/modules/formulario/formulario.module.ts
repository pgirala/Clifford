import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from '~utils/shared.module';

import { FormularioComponent } from './formulario.component';

@NgModule({
  imports: [
    RouterModule.forChild([{path: '', component: FormularioComponent}]),
    SharedModule
  ],
  declarations: [
    FormularioComponent
  ],
  providers: [],
  entryComponents: [
  ],
  exports: [
    RouterModule,
  ]
})
export class FormularioModule { }

