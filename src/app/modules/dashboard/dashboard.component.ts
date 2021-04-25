import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from '../../services/auth.service';
import { EnvioService } from '~services/envio.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  enviosVisibles = false;

  constructor(
    private authService: AuthService,
    private envioService: EnvioService,
    private router: Router
  ) {
    this.envioService.enviosVisibilityChange.subscribe((value) => {
      this.enviosVisibles = value;
    })
  }

  ngOnInit() {
    if (!this.authService.loggedIn.getValue()) {
      this.router.navigate(['/login']);
    }
  }

}
