import { Component, Inject, OnInit, EventEmitter, HostListener} from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { EnvioService } from '~services/envio.service';
import { SubmissionService } from '~services/submission.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SnackbarComponent } from '~components/snackbar/snackbar.component';
import { CONSTANTS } from '~app/utils/constants';

@Component({
  selector: 'app-detalle',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss']
})
export class DetailComponent implements OnInit{
  public submission: any;
  public renderOptions: any;
  public readOnly: boolean = false;
  public successEmitter: any = new EventEmitter();
  triggerRefresh: any=new EventEmitter();
  public currentForm: any;
  constructor(public dialogRef: MatDialogRef<DetailComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {
    action: string, formulario: any, submission: any},
    private submissionService: SubmissionService,
    private envioService: EnvioService,
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

  // ready function
  ready(event) {
    this.currentForm = event.formio;
  }

  onSubmit(event) {
    this.successEmitter.emit('Operación solicitada');
    this.currentForm.emit('submitDone');

    let subm: any;

    if (this.data.action == 'save')
      subm = {data: event.data};
    else if (this.data.action == 'update')
      subm = {_id:this.data.submission._id, data: event.data};

    this.submissionService.save(subm, this.data.formulario.path).subscribe((res: any) => {
      let submissionId = res._id;
      let resumen = res.data.resumen;
      this.envioService.create(submissionId).subscribe((res: any) => {
        this.dialogRef.close(resumen);
      }, (error:any) => {
        this.openSnack(error);
        this.eliminarEnvioFallido(submissionId);
      });
    }, (error:any) => {
      this.openSnack(error);});
  }

  eliminarEnvioFallido(submissionId: string){
    // se borra el envío ya que no se ha perfeccionado
    this.submissionService.delete(submissionId, this.data.formulario.path).subscribe((res: any) => {
      this.dialogRef.close('No se ha logrado realizar el envío');
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
