import { Component, Inject, OnInit, EventEmitter, HostListener} from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SubmissionService } from '~services/submission.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SnackbarComponent } from '~components/snackbar/snackbar.component';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss']
})
export class DetailComponent implements OnInit{
  public renderOptions: any;
  public readOnly: boolean = false;
  triggerRefresh: any=new EventEmitter();
  constructor(public dialogRef: MatDialogRef<DetailComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {
    action: string, formulario: any, submission: any},
    private submissionService: SubmissionService,
    public snack: MatSnackBar) {
      this.readOnly = (data.action == 'view');
      this.renderOptions = {
        language: 'sp',
        i18n: {
          sp: {
            error : "Corrija los errores existentes.",
            invalid_date :"{{field}} no es una fecha válida.",
            invalid_email : "{{field}} no es un correo válido.",
            invalid_regex : "{{field}} no cumple el patrón {{regex}}.",
            mask : "{{field}} no cumple la máscara.",
            max : "{{field}} no puede ser mayor que {{max}}.",
            maxLength : "{{field}} debe tener como máximo {{length}} caracteres.",
            min : "{{field}} no puede ser menor que {{min}}.",
            minLength : "{{field}} debe tener como mínimo {{length}} caracteres.",
            next : "Siguiente",
            pattern : "{{field}} no cumple el patrón {{pattern}}",
            previous : "Anterior",
            required : "{{field}} obligatorio",
            complete: "Operación completada",
            submitError: "Corrija los errores existentes",
            submitMessage: "Operación solicitada",
            submitDone: "Operación solicitada",
            unique: "{{field}} debe ser único",
            valueIsNotAvailable: '{{ field }} es un valor no válido.',
            month: 'Mes',
            day: 'Día',
            year: 'Año',
            january: 'Enero',
            february: 'Febrero',
            march: 'Marzo',
            april: 'Abril',
            may: 'Mayo',
            june: 'Junio',
            july: 'Julio',
            august: 'Agosto',
            september: 'Septiembre',
            october: 'Octubre',
            november: 'Noviembre',
            december: 'Diciembre',
            cancel: 'Cancelar',
            submit: 'Aceptar',
            confirmCancel: '¿Está seguro de que quiere cancelar?',
            'Type to search': 'Filtro',
            'Add Another': 'Añadir'
          }
        }
      };
  }

  ngOnInit()
  {
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

  onSubmit(event) {
    let subm: any;

    if (this.data.action == 'save')
      subm = {data: event.data};
    else if (this.data.action == 'update')
      subm = {_id:this.data.submission._id, data: event.data};

    this.submissionService.save(subm, this.data.formulario.path).subscribe((res: any) => {
      this.dialogRef.close(res.data.resumen);
    }, (error:any) => {
      this.openSnack(error);});
  }

  @HostListener('window:keyup.esc') onKeyUp() {
    let cn = confirm('¿Está seguro de abandonar la edición?')
    if (cn) {
      this.dialogRef.close();
    }
  }
}
