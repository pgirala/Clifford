import { Component, Inject, OnInit, EventEmitter, HostListener, ViewChild, ElementRef } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SnackbarComponent } from '~components/snackbar/snackbar.component';
import { CONSTANTS } from '~app/utils/constants';
import { RequiredValidator } from '@angular/forms';
import { Formulario } from '~app/models/formulario';
import { Role } from '~app/models/role';
import { FormularioService } from '~app/services/formulario.service';
import { AuthService } from '~services/auth.service';

@Component({
  selector: 'app-metadata',
  templateUrl: './metadata.component.html',
  styleUrls: ['./metadata.component.scss'],
  providers: [FormularioService]
})
export class MetadataComponent implements OnInit {
  public submission: any;
  public renderOptions: any;
  public readOnly: boolean = false;
  public successEmitter: any = new EventEmitter();
  public triggerRefresh: any=new EventEmitter();
  public currentForm: any;
  constructor(public dialogRef: MatDialogRef<MetadataComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {
    action: string, formulario: any, submission: any},
    public snack: MatSnackBar,
    private formularioService: FormularioService,
    private authService: AuthService) {
      this.submission = JSON.parse(JSON.stringify(data.submission));
      this.readOnly = (data.action == 'view');
      this.renderOptions = {
        language: 'sp',
        i18n: CONSTANTS.formularios.i18n,
        submitMessage: "Acción realizada",
        disableAlerts: true,
        noAlerts: true
      };
  }

  ngOnInit() {
    if (this.data.action == 'save' || this.data.action == 'update') {
      this.dialogRef.disableClose = true;
      this.dialogRef.backdropClick().subscribe(_ => {
        let cn = confirm('¿Está seguro de abandonar la edición?')
        if (cn) {
          this.dialogRef.close();
        }
      });
    }
  }

  private openSnack(data: any): void {
    this.snack.openFromComponent(SnackbarComponent, {
      data: { data: data },
      duration: 3000
    });
  }

  // ready function
  ready(event) {
    this.currentForm = event.formio;
  }

  obtenerFormulario(formularioBase:Formulario) {
    let resultado:Formulario = formularioBase;
    delete resultado.token;
    delete resultado.submit;
    return this.transformarIdRoles(resultado);
  }

  transformarIdRoles(item: Formulario):Formulario {
    let formulario = JSON.stringify(item);
    for (let role of this.authService.getListaRoles()) {
      formulario = formulario.split(role.machineName).join(role._id);
    }
    return JSON.parse(formulario);
  }

  onSubmit(event) {
    this.successEmitter.emit('Operación solicitada');
    this.currentForm.emit('submitDone');
    this.formularioService.save(this.obtenerFormulario(event.data)).subscribe((res: any) => {
      this.dialogRef.close("OK");
    }, (error: any) => {
      this.openSnack(error);
    });
  }

  @HostListener('window:keyup.esc') onKeyUp() {
    let cn = confirm('¿Está seguro de abandonar la edición?')
    if (cn) {
      this.dialogRef.close();
    }
  }
}
