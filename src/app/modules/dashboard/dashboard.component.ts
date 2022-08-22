import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from '../../services/auth.service';
import { EnvioService } from '~services/envio.service';
import { TareaService } from '~services/tarea.service';
import { ContextService } from '~services/context.service';
import { FormularioService } from '~services/formulario.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  formulariosVisibles = false;
  enviosVisibles = false;
  tareasVisibles = false;

  constructor(
    private authService: AuthService,
    private formularioService: FormularioService,
    private envioService: EnvioService,
    private tareaService: TareaService,
    private contextService: ContextService,
    private router: Router
  ) {
    this.formularioService.formulariosVisibilityChange.subscribe((value) => {
      this.formulariosVisibles = value;
    })
    this.envioService.enviosVisibilityChange.subscribe((value) => {
      this.enviosVisibles = value;
    })
    this.tareaService.tareasVisibilityChange.subscribe((value) => {
      this.tareasVisibles = value;
    })
  }

  ngOnInit() {
    if (!this.authService.loggedIn.getValue()) {
      this.router.navigate(['/login']);
    }
  }

}
