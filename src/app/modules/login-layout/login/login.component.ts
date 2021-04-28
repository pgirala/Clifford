import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

import { AuthService } from '~services/auth.service';
import { SnackbarComponent } from '~components/snackbar/snackbar.component';
import { HttpResponse } from '@angular/common/http';
import { FormioContextService } from '~services/formio-context.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  providers: []
})

export class LoginComponent implements OnInit {
  public form: FormGroup;
  public isLogin = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private formioContextService: FormioContextService,
    private router: Router,
    public snack: MatSnackBar,
  ) { }

  ngOnInit() {
    if (this.formioContextService.getTokenFormio()) {
      this.router.navigate(['/']);
    }

    this.initLoginForm();
  }

  private initLoginForm(): void {
    this.form = this.fb.group({
      email: [
        null,
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(20)
        ]
      ],
      password: [
        null,
        [
          Validators.required,
          Validators.minLength(6),
          Validators.maxLength(12)
        ]
      ]
    });
  }

  public isFieldInvalid(field: string) {
    if (this.form.get(field).touched) {
      return !this.form.get(field).valid;
    }
  }

  public login() {
    if (this.form.valid) {
      this.isLogin = true;
      this.authService.login(this.form.value).subscribe(
        (resp: HttpResponse<any>) => {
          this.isLogin = false;
          if (resp.headers.get('x-jwt-token')) {
            this.authService.loggedIn.next(true);
            this.formioContextService.setTokenFormioOrganizacion(resp.headers.get('x-jwt-token'));
            this.router.navigate(['/']);
          } else {
            this.snack.openFromComponent(SnackbarComponent, {
              data: { data: resp },
              duration: 3000
            });
          }
        },
        (error) => {
          this.isLogin = false;
        }
      );
    }
  }

}
