import { AfterContentInit, ChangeDetectionStrategy, Component, ContentChild, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, TemplateRef, ViewChild } from '@angular/core';
import { ConfirmationService, PrimeIcons } from 'primeng/api';
import { Table } from 'primeng/table';
import { AbmColum } from 'src/app/models';
import { MessagesService } from 'src/app/services/messages.service';

@Component({
  selector: 'app-abm',
  templateUrl: './abm.component.html',
  styleUrls: ['./abm.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AbmComponent implements OnInit, AfterContentInit, OnChanges {

  @Input() title: string = '';
  @Input() headerIcon: PrimeIcons = '';
  @Input() dataset: any[] = [];
  @Input() columns: AbmColum[] = [];
  @Input() detailFormValid = false;

  @Output() deleteEvent = new EventEmitter<string[]>();
  @Output() saveDetailEvent = new EventEmitter<any>();
  @Output() openDetailEvent = new EventEmitter<any>();

  @ViewChild('primeNgTable', { static: true }) primeNgTable: Table | undefined;

  @ContentChild(TemplateRef) abmDetailForm: any;

  paginator = true;
  rows = 5;
  selected: any[] = [];
  detailDialogVisible = false;

  get deleteDisabled(): boolean {
    return this.selected.length === 0;
  }

  constructor(
    private confirmationService: ConfirmationService,
    private messagesService: MessagesService
  ) { }

  ngOnInit() { }

  ngAfterContentInit() {
    if (!this.abmDetailForm) {
      throw new Error("@Input abmDetailForm is required");
    }
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

  clearSelected() {
    this.selected = [];
  }

  filterDataset(event: Event) {
    if (!this.primeNgTable) {
      return;
    }

    const { value } = event.target as HTMLInputElement;
    this.primeNgTable.filterGlobal(value, 'contains')
  }

  deleteSelected() {
    if (this.deleteDisabled) {
      this.messagesService.info('Seleccione elementos para borrar');
      return;
    }

    this.confirmationService.confirm({
      message: '¿Eliminar los elementos seleccionados?',
      header: 'Confirmar borrado',
      icon: PrimeIcons.EXCLAMATION_TRIANGLE,
      defaultFocus: "reject",
      acceptButtonStyleClass: "p-button-danger",
      accept: () => {
        this.deleteEvent.emit(this.selected.map(s => s.id));
      },
      reject: () => {
        this.messagesService.warn('Borrado cancelado');
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
      },
      reject: () => {
        this.messagesService.warn('Borrado cancelado');
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
}
