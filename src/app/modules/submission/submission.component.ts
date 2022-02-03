import { Component, AfterViewInit, ViewChild, ChangeDetectorRef, OnInit } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

import { merge, of as observableOf } from 'rxjs';
import { catchError, map, startWith, switchMap } from 'rxjs/operators';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

import { Submission } from '~models/submission';
import { SubmissionService } from '~services/submission.service';
import { AuthService } from '~services/auth.service';
import { ConfirmComponent } from '~components/confirm/confirm.component';
import { DetailComponent } from '~modules/submission/view/detail.component';
import { SnackbarComponent } from '~components/snackbar/snackbar.component';

import { Controller } from '~base/controller';
import { Formulario } from '~app/models/formulario';
import { TipoPermiso } from '~app/models/enums';
import { FormularioService } from '~app/services/formulario.service';
import { CONSTANTS } from '~utils/constants';
import { Formio } from 'formiojs';
import { FormioContextService } from '~app/services/formio-context.service';
import {FormioExport} from 'formio-export';

@Component({
  selector: 'app-client',
  templateUrl: './submission.component.html',
  styleUrls: ['./submission.component.scss'],
  providers: [SubmissionService, FormularioService]
})
export class SubmissionComponent implements AfterViewInit, OnInit, Controller {
  public displayedColumns = ['resumen', 'created', 'modified', 'personid'];
  public pageSizeOptions = [5, 10, 20, 40, 100];
  public pageSize = 20;
  public dataSource = new MatTableDataSource();
  public pageEvent: PageEvent;
  public resultsLength = 0;
  public page = 1;
  public isLoading = false;
  public isTotalReached = false;
  public totalItems = 0;
  public search = '';
  public formId = '';
  public formPath = '';
  public formulario: Formulario = {_id:'', owner: '', created: null, modified: null, title: '', type:null, name: null, display: null, path: null, tags: [CONSTANTS.formularios.multiple]};
  public multiple = CONSTANTS.formularios.multiple;
  public altaHabilitada = false;
  public modificacionHabilitada = false;
  public eliminacionHabilitada = false;

  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort: MatSort;

  constructor(
    private changeDetectorRef: ChangeDetectorRef,
    private submissionService: SubmissionService,
    private formularioService: FormularioService,
    private authService: AuthService,
    private formioContext: FormioContextService,
    private router: Router,
    private route: ActivatedRoute,
    public dialog: MatDialog,
    public snack: MatSnackBar
  ) { }

  ngOnInit() {
    if (!this.authService.loggedIn.getValue()) {
      this.router.navigate(['/login']);
    }

    this.route.queryParams.subscribe(params => {
      this.formId = params['formId'];
      this.formPath = params['formPath'];

      this.formularioService.getOne(this.formId).subscribe((form:Formulario) => {
        this.formulario = form;
        Formio.clearCache(); // en caso contrario los select cargados no volverán a refrescarse
        // determina los permisos
        this.altaHabilitada = this.authService.tieneAcceso(this.formioContext.getUserFormio(), this.formulario, TipoPermiso.CrearPropio) ||
                              this.authService.tieneAcceso(this.formioContext.getUserFormio(), this.formulario, TipoPermiso.CrearCualquiera);
        this.modificacionHabilitada = this.authService.tieneAcceso(this.formioContext.getUserFormio(), this.formulario, TipoPermiso.ActualizarPropio) ||
                              this.authService.tieneAcceso(this.formioContext.getUserFormio(), this.formulario, TipoPermiso.ActualizarCualquiera);
        this.eliminacionHabilitada = this.authService.tieneAcceso(this.formioContext.getUserFormio(), this.formulario, TipoPermiso.EliminarPropio) ||
                              this.authService.tieneAcceso(this.formioContext.getUserFormio(), this.formulario, TipoPermiso.EliminarCualquiera);

      })
    });
  }

  ngAfterViewInit() {
    // ANTES QUE LA VISTA CARGUE INICIA LA CARGA DE DATOS EN EL GRID
    this.getDataLength();
    this.getData();
  }

  ngAfterViewChecked() {
    this.changeDetectorRef.detectChanges();
  }

  private openSnack(data: any): void {
    this.snack.openFromComponent(SnackbarComponent, {
      data: { data: data },
      duration: 3000
    });
  }

  public onPaginateChange(event: any): void {
    this.page = event.pageIndex + 1;
    this.pageSize = event.pageSize;
    this.getData();
  }

  public applyFilter(filterValue: string): void {
    filterValue = filterValue.trim().toLowerCase();
    this.getDataLength();
    this.getData();
    this.getDataLength();
  }

  getDataLength(): void {
    merge(this.sort.sortChange, this.paginator.page)
      .pipe(
        startWith({}),
        switchMap(() => {
          this.isLoading = true;
          return this.submissionService.getList(
            this.sort.active,
            this.sort.direction,
            Number.MAX_SAFE_INTEGER,
            1,
            this.search,
            this.formPath
          );
        }),
        map(data => {
          this.isLoading = false;
          this.isTotalReached = false;
          this.totalItems = data.length
          return;
        }),
        catchError(() => {
          this.openSnack({message: "No se pudo contactar con el servidor de formularios"});
          this.isLoading = false;
          this.isTotalReached = true;
          return observableOf([]);
        })
      ).subscribe();
  }

  getData(): void {
    this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);

    merge(this.sort.sortChange, this.paginator.page)
      .pipe(
        startWith({}),
        switchMap(() => {
          this.isLoading = true;
          return this.submissionService.getList(
            this.sort.active,
            this.sort.direction,
            this.pageSize,
            this.page,
            this.search,
            this.formPath
          );
        }),
        map(data => {
          this.isLoading = false;
          this.isTotalReached = false;
          // la consulta no devuelve el total general de elementos
          return data;
        }),
        catchError(() => {
          this.openSnack({message: "No se pudo contactar con el servidor de formularios"});
          this.isLoading = false;
          this.isTotalReached = true;
          return observableOf([]);
        })
      ).subscribe(data => this.dataSource.data = data);
  }

  view(item: Submission): void {
    const dialogRef = this.dialog.open(DetailComponent, {
      height: '70%',
      width: this.getFormWidth(),
      data: { action: 'view',
            formulario: this.formulario,
            submission: this.submissionService.addToken(item) }
    });
  }

  edit(submission: Submission): void {
    const dialogRef = this.dialog.open(DetailComponent, {
      height: '70%',
      width: this.getFormWidth(),
      data: { action: 'update',
            formulario: this.formulario,
            submission: this.submissionService.addToken(submission) }
      });

      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.openSnack({message: "Instancia actualizada: " + result});
          this.paginator._changePageSize(this.paginator.pageSize);
        }
      });
  }

  descargar(): void {
    this.submissionService.getList(
      this.sort.active,
      this.sort.direction,
      Number.MAX_SAFE_INTEGER,
      1,
      this.search,
      this.formPath
    ).subscribe((resp: any) => {
      const file = new Blob([JSON.stringify(resp)], {type: 'text/json'});
      this.download(file,"descarga.json");
    });
  }

  download(blob, filename) {
    if (window.navigator.msSaveOrOpenBlob) // IE10+
        window.navigator.msSaveOrOpenBlob(blob, filename);
    else { // Others
        var a = document.createElement("a"),
                url = URL.createObjectURL(blob);
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        setTimeout(function() {
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
        }, 0);
    }
  }

  save(): void {
    const submissionVacia: Submission = {data:{}};
    const dialogRef = this.dialog.open(DetailComponent, {
      height: '70%',
      width: this.getFormWidth(),
      data: { action: 'save',
            formulario: this.formulario,
            submission: this.submissionService.addToken(submissionVacia)  }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.openSnack({message: "Instancia creada: " + result});
        this.paginator._changePageSize(this.paginator.pageSize);
      }
    });
  }

  delete(submission: Submission): void {
    const dialogRef = this.dialog.open(ConfirmComponent, {
      width: '250px',
      data: {
        title: 'Eliminar instancia',
        message: '¿Quiere eliminar la instancia?'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.submissionService.delete(submission._id, this.formulario.path).subscribe((data: any) => {
          this.openSnack({message: "Instancia eliminada: " + submission.data.resumen});
          this.paginator._changePageSize(this.paginator.pageSize);
        });
      }
    });
  }

  print(submission: Submission): void {
    let options = {
      ignoreLayout: true
    }

    let exporter = new FormioExport(JSON.parse(JSON.stringify(this.formulario)), JSON.parse(JSON.stringify(submission)), options);

    let config = {
      download: false,
      filename: 'instancia.pdf'
    };

    exporter.toPdf(config).then((pdf) => {
      // download the pdf file
      pdf.save();
      // get the datauri string
      let datauri = pdf.output('datauristring');
    })
  }

  getFormWidth(): string {
    return (this.formulario.tags.includes(CONSTANTS.formularios.size.small) ? '40%' :
      (this.formulario.tags.includes(CONSTANTS.formularios.size.large) ? '80%': '60%'))
  }
}
