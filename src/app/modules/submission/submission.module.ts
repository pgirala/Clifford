import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from '~utils/shared.module';
import { SubmissionComponent } from './submission.component';
import { DetailComponent } from './view/detail.component';
import { MatFormioModule } from '@formio/angular-material';

@NgModule({
  imports: [
    RouterModule.forChild([{path: '', component: SubmissionComponent}]),
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

