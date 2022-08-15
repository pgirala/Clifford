import { Component, AfterViewInit, ViewChild, ChangeDetectorRef, OnInit } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

import { merge, of as observableOf } from 'rxjs';
import { catchError, map, startWith, switchMap } from 'rxjs/operators';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

import { CONSTANTS } from '~utils/constants';

import { Submission } from '~models/submission';
import { SubmissionService } from '~services/submission.service';
import { AuthService } from '~services/auth.service';
import { ConfirmComponent } from '~components/confirm/confirm.component';
import { DetailComponent } from '~modules/tarea/view/detail.component';
import { SnackbarComponent } from '~components/snackbar/snackbar.component';

import { Controller } from '~base/controller';
import { NodeWithI18n } from '@angular/compiler';
import { Formulario } from '~app/models/formulario';
import { TareaService } from '~app/services/tarea.service';
import { FormularioService } from '~app/services/formulario.service';
import { ContextService } from '~app/services/context.service';
import { JbpmService } from '~services/jbpm.service';

import { Procedimiento } from '~app/models/procedimiento';

@Component({
  selector: 'app-client',
  templateUrl: './tarea.component.html',
  styleUrls: ['./tarea.component.scss'],
  providers: [TareaService, FormularioService]
})
export class TareaComponent implements AfterViewInit, OnInit, Controller {
  public displayedColumns = ['task-created-on',
    'task-name', 'task-status',
    'personid'];
  public pageSizeOptions = [5, 10, 20, 40, 100];
  public pageSize = 5;
  public dataSource = new MatTableDataSource();
  public pageEvent: PageEvent;
  public resultsLength = 0;
  public page = 1;
  public isLoading = false;
  public isTotalReached = false;
  public totalItems = 0;
  public search = '';
  public formPath = CONSTANTS.formularios.formTarea;
  public formulario: Formulario = { _id: '', owner: '', created: null, modified: null, title: '', type: null, name: null, display: null, path: null, tags: [CONSTANTS.formularios.multiple] };
  public equivalenciasEstado: Record<string, string> = {
    'Completed': 'Completada',
    //'Created': 'Creada',
    //'Error': 'Error',
    //'Exited': 'Abandonada',
    'Failed': 'Con fallo',
    'InProgress': 'En curso',
    //'Obsolete': 'Obsoleta',
    'Ready': 'Lista',
    'Reserved': 'Pendiente',
    'Suspended': 'Suspendida'
  };
  estadoActual: string = 'Reserved';
  procedimientoVacio: Procedimiento = { 'process-id': '', 'process-name': 'Todos los procedimientos' };
  procedimientoActual: Procedimiento = this.procedimientoVacio;
  procedimientos: Array<Procedimiento>; // todos los procedimientos visibles en el dominio activo
  todosProcedimientos: Array<Procedimiento>; // todos los procedimientos posibles

  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort: MatSort;

  constructor(
    private changeDetectorRef: ChangeDetectorRef,
    private submissionService: SubmissionService,
    private tareaService: TareaService,
    private formularioService: FormularioService,
    private authService: AuthService,
    private contextService: ContextService,
    private jbpmService: JbpmService,
    private router: Router,
    private route: ActivatedRoute,
    public dialog: MatDialog,
    public snack: MatSnackBar
  ) { }

  ngOnInit() {
    if (!this.authService.loggedIn.getValue()) {
      this.router.navigate(['/login']);
    }

    // se determinan todos los procedimientos posibles (para mejorar tiempos de respuesta)
    this.determinarTodosProcedimientos();
    this.formularioService.findByName(CONSTANTS.formularios.formTarea).subscribe((formularios: any) => {
      this.formulario = formularios[0];
    })
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
          return this.tareaService.getList(
            this.procedimientoActual['process-id'],
            this.estadoActual,
            this.sort.active,
            this.sort.direction,
            1000000000, // Number.MAX_SAFE_INTEGER es un número demasiado grande para pasarlo por query parameter
            1,
            this.search
          );
        }),
        map(data => {
          data = data['task-instance'];
          this.isLoading = false;
          this.isTotalReached = false;
          this.totalItems = data.length;
          return;
        }),
        catchError(() => {
          this.openSnack({ message: "No se pudo contactar con el servidor de BPM" });
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
          return this.tareaService.getList(
            this.procedimientoActual['process-id'],
            this.estadoActual,
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
          return data['task-instance'];
        }),
        catchError(() => {
          this.openSnack({ message: "No se pudo contactar con el servidor de BPM" });
          this.isLoading = false;
          this.isTotalReached = true;
          return observableOf([]);
        })
      ).subscribe(data => this.dataSource.data = data);
  }

  save(): void { }

  delete(submission: any): void { }

  view(item: any): void {
    this.formularioService.findByName(item["task-description"]).subscribe((formularios: any) => {
      let formularioEmbebido: Formulario = formularios[0];
      const dialogRef = this.dialog.open(DetailComponent, {
        height: this.getFormHeight(),
        width: this.getFormWidth(),
        data: {
          action: 'view',
          formulario: JSON.parse(JSON.stringify(this.formulario).replace(':formId', formularioEmbebido._id)),
          submission: this.getSubmission(item)
        }
      });
    })
  }

  edit(item: any): void {
    this.formularioService.findByName(item["task-description"]).subscribe((formularios: any) => {
      let formularioEmbebido: Formulario = formularios[0];
      const dialogRef = this.dialog.open(DetailComponent, {
        height: this.getFormHeight(),
        width: this.getFormWidth(),
        data: {
          action: 'update',
          formulario: JSON.parse(JSON.stringify(this.formulario).replace(':formId', formularioEmbebido._id)),
          submission: this.getSubmission(item)
        }
      });

      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.openSnack({ message: "Instancia actualizada: " + result });
          this.paginator._changePageSize(this.paginator.pageSize);
        }
      });
    })
  }

  getSubmission(item: any): Submission {
    let resultado = { data: item };
    resultado.data["process"] = this.getProcedimiento(item["task-process-id"]);
    resultado.data["estado"] = this.equivalenciasEstado[item["task-status"]];
    resultado.data["fechaCreacion"] = new Date(item["task-created-on"]["java.util.Date"]).toLocaleDateString('es-es');
    return this.submissionService.addToken(resultado);
  }

  determinarTodosProcedimientos(): void {
    this.todosProcedimientos = new Array<Procedimiento>();
    this.jbpmService.getProcedimientos().subscribe((listaProcedimientos: any) => {
      for (let procedimiento of listaProcedimientos['processes']) {
        if (!this.todosProcedimientos.includes(procedimiento))
          this.todosProcedimientos.push(procedimiento);
      }
    })
  }

  determinarProcedimientos(): void {
    this.procedimientos = new Array<Procedimiento>();
    if (this.contextService.getDominio() != null
      && this.contextService.getDominio().data.procedimientos != null
      && this.todosProcedimientos.length > 0) {
      for (let procedimiento of this.todosProcedimientos) {
        for (let idProcedimiento of this.contextService.getDominio().data.procedimientos) {
          if (idProcedimiento === procedimiento["process-id"] && !this.procedimientos.includes(procedimiento))
            this.procedimientos.push(procedimiento);
        }
      }
      // ordenar el vector
      this.procedimientos.sort((a, b) => (a['process-name'] < b['process-name'] ? -1 : (a['process-name'] == b['process-name'] ? 0 : 1)));
    }
  }

  getProcedimiento(idProcedimiento: string): Procedimiento {
    for (let procedimiento of this.todosProcedimientos)
      if (procedimiento['process-id'] === idProcedimiento) {
        return procedimiento;
      }
    return null;
  }

  cambiarProcedimiento(idProcedimiento: string): void {
    this.procedimientoActual = this.getProcedimiento(idProcedimiento);
    this.getDataLength();
    this.getData();
  }

  cambiarEstado(estado: string): void {
    this.estadoActual = estado;
    this.getDataLength();
    this.getData();
  }

  getFormHeight(): string {
    return (this.formulario.tags.includes(CONSTANTS.formularios.size.small) ? '40%' :
      (this.formulario.tags.includes(CONSTANTS.formularios.size.large) ? '90%' : '60%'))
  }

  getFormWidth(): string {
    return (this.formulario.tags.includes(CONSTANTS.formularios.size.small) ? '40%' :
      (this.formulario.tags.includes(CONSTANTS.formularios.size.large) ? '80%' : '60%'))
  }
}
