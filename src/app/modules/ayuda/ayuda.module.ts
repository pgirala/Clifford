import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AyudaComponent } from './ayuda.component';



@NgModule({
  declarations: [AyudaComponent],
  imports: [
    RouterModule.forChild([{path: '', component: AyudaComponent}]),
    CommonModule
  ]
})
export class AyudaModule { }
