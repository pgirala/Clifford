import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from '~utils/shared.module';
import { SubmissionComponent } from './submission.component';
import { DetailComponent } from './view/detail.component';
import { FormioModule } from 'angular-formio';
import { MatFormioModule } from '@formio/angular-material';

@NgModule({
  imports: [
    RouterModule.forChild([{path: '', component: SubmissionComponent}]),
    FormioModule,
    MatFormioModule,
    SharedModule
  ],
  declarations: [
    SubmissionComponent,
    DetailComponent
  ],
  providers: [],
  entryComponents: [
  ],
  exports: [
    RouterModule,
  ]
})
export class SubmissionModule { }

