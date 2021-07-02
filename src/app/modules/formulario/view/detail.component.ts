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
  public updatedform;
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
      this.updatedform = form;
    })

    this.dialogRef.disableClose = true;
    this.dialogRef.backdropClick().subscribe(_ => {
      this.abandonarEdicion();
    });
  }

  abandonarEdicion(): void {
    let cn = confirm('¿Terminar la edición?')
    if (cn) {
      let cn = confirm('¿Guardar el formulario?')
        if (cn) {
          this.dialogRef.close('Se procede a guardar el formulario');
          this.saveUpdatedForm();
        } else
          this.dialogRef.close('Se abandona la edición sin guardar el formulario');
      }

  }

  onChange(event) {
    this.updatedform = event.form;
  }

  saveUpdatedForm(): void {
    this.formularioService.save(this.updatedform).subscribe((res: any) => {
      this.openSnack({message: "Se ha guardado el formulario"});
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
    this.abandonarEdicion();
  }
}
