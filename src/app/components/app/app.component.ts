import { Component, OnInit } from '@angular/core';
import { Formio } from 'formiojs';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'app';
  ngOnInit() {
    Formio.setBaseUrl(environment.settings.FI_BASE_URL);
    Formio.setProjectUrl(environment.settings.FI_PROJECT_URL);
  }
}
