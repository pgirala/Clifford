import { Component, Inject, OnInit, EventEmitter, HostListener } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TareaService } from '~services/tarea.service';
import { SubmissionService } from '~services/submission.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SnackbarComponent } from '~components/snackbar/snackbar.component';
import { CONSTANTS } from '~app/utils/constants';

@Component({
  selector: 'app-detalle',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss']
})
export class DetailComponent implements OnInit {
  public submission: any;
  public renderOptions: any;
  public readOnly: boolean = false;
  public successEmitter: any = new EventEmitter();
  public triggerRefresh: any = new EventEmitter();
  public currentForm: any;
  constructor(public dialogRef: MatDialogRef<DetailComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {
      action: string, formulario: any, submission: any
    },
    private submissionService: SubmissionService,
    private tareaService: TareaService,
    public snack: MatSnackBar) {
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

  onSubmit(event) {
    this.successEmitter.emit('Operación solicitada');
    this.currentForm.emit('submitDone');
    this.tareaService.comenzar(event.data).subscribe((res: any) => {
      this.tareaService.completar(event.data).subscribe((res: any) => {
        this.dialogRef.close("Tarea completada");
      }, (error: any) => {
        this.openSnack(error);
      })
    }, (error: any) => {
      this.openSnack(error);
    });
  }

  tratarEvento(event) {
    if (event.type === 'guardarBorrador') {
      if (event.data.estado === 'Disponible') {
        this.tareaService.comenzar(event.data).subscribe((res: any) => {
          this.tareaService.guardarBorrador(event.data).subscribe((res: any) => {
            this.openSnack({ message: "Borrador guardado" });
          }, (error: any) => {
            this.openSnack(error);
          });
        }, (error: any) => {
          this.openSnack(error);
        });
      } else {
        this.tareaService.guardarBorrador(event.data).subscribe((res: any) => {
          this.openSnack({ message: "Borrador guardado" });
        }, (error: any) => {
          this.openSnack(error);
        });
      }
    }
  }

  @HostListener('window:keyup.esc') onKeyUp() {
    let cn = confirm('¿Está seguro de abandonar la edición?')
    if (cn) {
      this.dialogRef.close();
    }
  }
}
