import { Component, AfterViewInit, ViewChild, ChangeDetectorRef, OnInit } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

import { merge, of as observableOf } from 'rxjs';
import { catchError, map, startWith, switchMap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

import { Formulario } from '~models/formulario';
import { FormularioService } from '~services/formulario.service';
import { AuthService } from '~services/auth.service';
import { DetailComponent } from '~modules/formulario/view/detail.component';
import { MetadataComponent } from '~modules/formulario/alternativeView/metadata.component';
import { SnackbarComponent } from '~components/snackbar/snackbar.component';

import { Submission } from '~models/submission';
import { SubmissionService } from '~services/submission.service';

import { Controller } from '~base/controller';
import { FormioContextService } from '~app/services/formio-context.service';

import { CONSTANTS } from '~utils/constants';

@Component({
  selector: 'app-client',
  templateUrl: './formulario.component.html',
  styleUrls: ['./formulario.component.scss'],
  providers: [FormularioService]
})
export class FormularioComponent implements AfterViewInit, OnInit, Controller {
  public displayedColumns = ['title', 'personid'];
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
  public disenoHabilitado = false;
  public formMetadatosPath = CONSTANTS.formularios.formMetadatos;
  public formularioMetadatos: Formulario = {_id:'', owner: '', created: null, modified: null, title: '', path: null, tags:[CONSTANTS.formularios.multiple]};

  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort: MatSort;

  constructor(
    private changeDetectorRef: ChangeDetectorRef,
    private submissionService: SubmissionService,
    private formularioService: FormularioService,
    private authService: AuthService,
    private formioContext: FormioContextService,
    private router: Router,
    public dialog: MatDialog,
    public snack: MatSnackBar
  ) { }

  ngOnInit() {
    if (!this.authService.loggedIn.getValue()) {
      this.router.navigate(['/login']);
    }

    this.formularioService.findByName(CONSTANTS.formularios.formMetadatos).subscribe((formularios:any) => {
      this.formularioMetadatos = formularios[0];
    })

    this.disenoHabilitado = this.formioContext.getUserFormio().admin;
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
    this.paginator.firstPage();
  }

  getDataLength(): void {
    merge(this.sort.sortChange, this.paginator.page)
      .pipe(
        startWith({}),
        switchMap(() => {
          this.isLoading = true;
          return this.formularioService.getList(
            this.sort.active,
            this.sort.direction,
            Number.MAX_SAFE_INTEGER,
            1,
            this.search
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
          return this.formularioService.getList(
            this.sort.active,
            this.sort.direction,
            this.pageSize,
            this.page,
            this.search
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

  view(item: Formulario): void {
    this.router.navigate(['/submissions'], { queryParams: {formId: item._id, formPath: item.path}});
  }

  edit(item: Formulario): void {
    const submission: Submission= {data:{}}; // TODO: rellenarla con los metadatos del formulario recibido
    const dialogRef = this.dialog.open(MetadataComponent, {
      height: '70%',
      width: '40%',
      data: { action: 'update',
            formulario: this.formularioMetadatos,
            submission: this.submissionService.addToken(submission)  }
      });

      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.openSnack({message: "Datos del formulario actualizados: " + result});
          this.paginator._changePageSize(this.paginator.pageSize);
        }
      });
  }

  save(): void {
  }

  delete(item: Object): void {
  }

  design(item: Formulario): void {
    const dialogRef = this.dialog.open(DetailComponent, {
      height: '90%',
      width: '90%',
      data: {formulario: item}
    });
  }
}
