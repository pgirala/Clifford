import { Component, OnInit, AfterContentChecked, ChangeDetectorRef, NgZone, ElementRef, ViewChild, Renderer2 } from '@angular/core';
import { Router, Event as RouterEvent, NavigationStart, NavigationEnd, NavigationCancel, NavigationError } from '@angular/router';
import { MediaMatcher } from '@angular/cdk/layout';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';

import { AuthService } from '~services/auth.service';
import { ContextService } from '~services/context.service';
import { FormioContextService } from '~services/formio-context.service';
import { FormularioService } from '~services/formulario.service';
import { EnvioService } from '~services/envio.service';
import { ConfirmComponent } from '~components/confirm/confirm.component';

import { Dominio } from '~app/models/dominio';

@Component({
  selector: 'app-admin-layout',
  templateUrl: './admin-layout.component.html',
  styleUrls: ['./admin-layout.component.scss'],
  providers: [AuthService]
})

export class AdminLayoutComponent implements OnInit, AfterContentChecked {
  isLoggedIn$: Observable<boolean>;
  mobileQuery: MediaQueryList;
  private mobileQueryListener: () => void;

  dominioVacio:Dominio = {data: {nombre:'Seleccione la agrupación de formularios', path:'',envios:false, individual:false}};
  dominioActual:Dominio = this.dominioVacio;
  userName:string;
  dominios:Array<Dominio>;

  @ViewChild('progressBar', { static: false })
  progressBar: ElementRef;


  constructor(
    private authService: AuthService,
    private formularioService: FormularioService,
    private envioService: EnvioService,
    private formioContextService: FormioContextService,
    private contextService: ContextService,
    changeDetectorRef: ChangeDetectorRef,
    media: MediaMatcher,
    public dialog: MatDialog,

    private router: Router,
    private ngZone: NgZone,
    private renderer: Renderer2
  ) {
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this.mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this.mobileQueryListener);

    router.events.subscribe((event: RouterEvent) => {
      this._navigationInterceptor(event);
    });
  }

  ngOnInit() {
    this.isLoggedIn$ = this.authService.isLoggedIn;
    if (this.contextService.getDominio())
      this.dominioActual = this.contextService.getDominio();
    else
      this.dominioActual = this.dominioVacio;
    this.envioService.setEnviosVisibility(this.dominioActual.data.envios);
    if (this.dominioActual.data.path)
      this.formularioService.setFormulariosVisibility(true);
    else
      this.formularioService.setFormulariosVisibility(false);
  }

  ngAfterContentChecked() {
    this.envioService.setEnviosVisibility(this.dominioActual.data.envios);
    if (this.dominioActual.data.path)
      this.formularioService.setFormulariosVisibility(true);
    else
      this.formularioService.setFormulariosVisibility(false);
    this.userName = this.formioContextService.getUserName();
  }

  ngOnDestroy(): void {
    this.mobileQuery.removeListener(this.mobileQueryListener);
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(ConfirmComponent, {
      width: '250px',
      data: {
        title: 'Salir',
        message: '¿Quiere cerrar la sesión?'
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.authService.logout().subscribe(response => {
          if(response == "OK") {
            this.authService.loggedIn.next(false);
            this.contextService.removeTokenFormio();
          }
        });
      }
    });
  }

  // PROGRESS BAR
  private _navigationInterceptor(event: RouterEvent): void {
    if (event instanceof NavigationStart) {
      this.ngZone.runOutsideAngular(() => {
        this.renderer.setStyle(this.progressBar.nativeElement, 'opacity', '1');
      });
    }
    if (event instanceof NavigationEnd) {
      setTimeout(() => {
        this.hideProgressBar();
      }, 1000);
    }
    if (event instanceof NavigationCancel) {
      setTimeout(() => {
        this.hideProgressBar();
      }, 1000);
    }
    if (event instanceof NavigationError) {
      setTimeout(() => {
        this.hideProgressBar();
      }, 1000);
    }
  }

  private hideProgressBar(): void {
    this.ngZone.runOutsideAngular(() => {
      this.renderer.setStyle(this.progressBar.nativeElement, 'opacity', '0');
    });
  }

  determinarContextos():void {
    try {
      this.dominios = this.formioContextService.getDominios();
    } catch {
      this.dominios = new Array<Dominio>();
    }
  }

  cambiarContexto(pathDominio:string): void {
    let resultado = this.dominioVacio;
    for (let dominio of this.dominios)
      if (dominio.data.path == pathDominio) {
        this.dominioActual = dominio;
        break;
      }
      this.contextService.setDominio(this.dominioActual);
      this.envioService.setEnviosVisibility(this.dominioActual.data.envios);
      if (this.dominioActual.data.path)
        this.formularioService.setFormulariosVisibility(true);
      else
        this.formularioService.setFormulariosVisibility(false);
      this.router.navigate(['']); // vuelve a la página inicial
  }
}
