import { AfterContentInit, ChangeDetectionStrategy, Component, ContentChild, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges, TemplateRef, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ConfirmationService, MenuItem, PrimeIcons } from 'primeng/api';
import { Table } from 'primeng/table';
import { ReplaySubject, takeUntil, tap } from 'rxjs';
import { AbmColum } from 'src/app/models';
import { MessagesService } from 'src/app/services/messages.service';

@Component({
  selector: 'app-abm',
  templateUrl: './abm.component.html',
  styleUrls: ['./abm.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AbmComponent implements OnInit, AfterContentInit, OnChanges, OnDestroy {

  @Input() dataset: any[] = [];
  @Input() columns: AbmColum[] = [];
  @Input() detailFormValid = false;
  @Input() actionColumnStyleClass: string = 'w-8rem';

  @Output() deleteEvent = new EventEmitter<string[]>();
  @Output() saveDetailEvent = new EventEmitter<any>();
  @Output() openDetailEvent = new EventEmitter<any>();

  @ViewChild('primeNgTable', { static: true }) primeNgTable: Table | undefined;

  @ContentChild(TemplateRef) abmDetailForm: any;

  readonly checkboxColumnMenuItems: MenuItem[] = [];
  readonly paginator = true;
  readonly rows = 5;
  readonly search: FormControl;

  hasDetailForm: boolean = false;
  selected: any[] = [];
  detailDialogVisible = false;

  get deleteDisabled(): boolean {
    return this.selected.length === 0;
  }

  private readonly destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

  constructor(
    private confirmationService: ConfirmationService,
    private messagesService: MessagesService,
  ) {
    this.search = new FormControl('');
    this.checkboxColumnMenuItems = [{
      label: 'Seleccionados',
      items: [
        {
          label: 'Seleccionar página',
          icon: PrimeIcons.CHECK_SQUARE,
          command: () => this.selectPage()
        },
        {
          label: 'Anular selección',
          icon: PrimeIcons.STOP,
          command: () => this.clearSelected()
        },
        { separator: true },
        {
          label: 'Eliminar elementos',
          icon: PrimeIcons.TRASH,
          command: () => this.deleteSelected(),
          tooltipOptions: {
            appendTo: 'body',
            tooltipLabel: `Hasta un máximo de ${this.rows} por cada vez`
          }
        },
      ]
    }];
    this.initFormValueChangeListeners();
  }

  private initFormValueChangeListeners(): void {
    this.search.valueChanges.pipe(
      takeUntil(this.destroyed$),
      tap((value) => this.filterByText(value)),
    ).subscribe();
  }

  ngOnInit() { }

  ngAfterContentInit() {
    this.hasDetailForm = !!this.abmDetailForm;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['dataset']) {
      const { dataset } = changes;
      if (dataset.currentValue !== dataset.previousValue) {
        this.clearSelected();
        this.closeDialog();
      }
    }
  }
  
  selectPage() {
    this.selected = [...this.primeNgTable?.dataToRender as any[]];
  }

  selectAll() {
    this.selected = [...this.dataset];
  }

  clearSelected() {
    this.selected = [];
  }

  clearSearch(): void {
    this.search.setValue('');
  }

  filterByText(value: string): void {
    this.primeNgTable?.filterGlobal(value, 'contains')
  }

  deleteSelected() {
    if (this.deleteDisabled) {
      this.messagesService.warn('Seleccione elementos para eliminar');
      return;
    }
    if (this.selected.length > this.rows) {
      this.messagesService.warn(`Máximo de elementos para eliminar ${this.rows} por vez`);
      return;
    }

    this.confirmationService.confirm({
      message: `¿Eliminar los elementos seleccionados?<br>Cantidad de elementos seleccionados: ${this.selected.length}`,
      header: 'Confirmar borrado',
      icon: PrimeIcons.EXCLAMATION_TRIANGLE,
      defaultFocus: "reject",
      acceptButtonStyleClass: "p-button-danger",
      accept: () => {
        this.deleteEvent.emit(this.selected.map(s => s.id));
      }
    });
  }

  deleteElement(element: any) {
    this.confirmationService.confirm({
      message: '¿Eliminar fila de la tabla?',
      header: 'Confirmar borrado',
      icon: PrimeIcons.EXCLAMATION_TRIANGLE,
      defaultFocus: "reject",
      acceptButtonStyleClass: "p-button-danger",
      accept: () => {
        this.deleteEvent.emit([element.id]);
      }
    });
  }

  editElement(element: any) {
    this.openDialog(element);
  }

  createElement() {
    this.openDialog({});
  }

  openDialog(element: any): void {
    this.detailDialogVisible = true;
    this.openDetailEvent.emit(element);
  }

  saveElement() {
    this.saveDetailEvent.emit();
  }

  closeDialog() {
    this.detailDialogVisible = false;
  }

  ngOnDestroy() {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }
}
