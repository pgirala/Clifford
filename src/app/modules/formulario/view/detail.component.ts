import { Component, Inject, OnInit, EventEmitter, HostListener, ViewChild, ElementRef } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SnackbarComponent } from '~components/snackbar/snackbar.component';
import { CONSTANTS } from '~app/utils/constants';
import { RequiredValidator } from '@angular/forms';
import { Formulario } from '~app/models/formulario';
import { FormularioService } from '~app/services/formulario.service';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss'],
  providers: [FormularioService]
})
export class DetailComponent implements OnInit {
  @ViewChild('json') jsonElement?: ElementRef;
  public form: Object = {components: []};
  public id: string;
  public title: string;

  constructor(public dialogRef: MatDialogRef<DetailComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {
      action: string, formulario: any
    },
    private formularioService: FormularioService,
    public snack: MatSnackBar) {
      this.id = data.formulario._id;
      this.title = data.formulario.title;
  }

  ngOnInit() {
    this.formularioService.getOne(this.id).subscribe((form:Formulario) => {
      this.form = form;
    })

    this.dialogRef.disableClose = true;
    this.dialogRef.backdropClick().subscribe(_ => {
      let cn = confirm('¿Está seguro de abandonar la edición?')
      if (cn) {
        this.dialogRef.close();
      }
    });
  }

  onChange(event) {
    this.formularioService.save(event.form).subscribe((res: any) => {
      this.dialogRef.close(res.data.resumen);
    }, (error: any) => {
      this.openSnack(error);
    });
  }

  private openSnack(data: any): void {
    this.snack.openFromComponent(SnackbarComponent, {
      data: { data: data },
      duration: 3000
    });
  }

  @HostListener('window:keyup.esc') onKeyUp() {
    let cn = confirm('¿Está seguro de abandonar la edición?')
    if (cn) {
      this.dialogRef.close();
    }
  }
}
