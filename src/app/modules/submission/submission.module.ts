import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from '~utils/shared.module';

import { SubmissionComponent } from './submission.component';

@NgModule({
  imports: [
    RouterModule.forChild([{path: '', component: SubmissionComponent}]),
    SharedModule
  ],
  declarations: [
    SubmissionComponent
  ],
  providers: [],
  entryComponents: [
  ],
  exports: [
    RouterModule,
  ]
})
export class SubmissionModule { }

