import { Component, Inject } from '@angular/core';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';

@Component({
  selector: 'app-detail',
  template: '<formio [form]=\'{ "display": "form",  "components": [    {      "type": "button",      "label": "Submit",      "key": "submit",      "disableOnInvalid": true,      "input": true,      "tableView": false}]}\'></formio>'
})
export class DetailComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: {title: string,
    action: string, formulario: string}) { }
}
