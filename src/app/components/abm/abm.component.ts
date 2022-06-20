import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
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
export class AbmComponent implements OnInit, OnChanges {

  @Input() title: string = '';
  @Input() headerIcon: PrimeIcons = '';
  @Input() dataset: any[] = [];
  @Input() columns: AbmColum[] = [];

  @Output() deleteEvent = new EventEmitter<string[]>();
  @Output() editEvent = new EventEmitter<any>();
  @Output() createEvent = new EventEmitter<any>();

  @ViewChild('primeNgTable', { static: true }) primeNgTable: Table | undefined;

  paginator = true;
  rows = 5;
  selected: any[] = [];

  get deleteDisabled(): boolean {
    return this.selected.length === 0;
  }

  constructor(
    private confirmationService: ConfirmationService,
    private messagesService: MessagesService
  ) { }

  ngOnInit() { }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['dataset'].currentValue !== changes['dataset'].previousValue) {
      this.clearSelected();
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
        this.messagesService.warn('Borrado cancelado correctamente');
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
        this.messagesService.warn('Borrado cancelado correctamente');
      }
    });
  }

  editElement(element: any) {
    // TODO:
    this.editEvent.emit(element);
  }

  createElement() {
    // TODO:
    // this.createEvent.emit(element);
    this.createEvent.emit({
      name: this.createRandomString(),
      surname: this.createRandomString(),
      identification: this.createRandomString()
    });
  }

  // FIXME:
  createRandomString(): string {
    let id = '';
    var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (var i = 0; i < 15; i++) {
      id += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return id;
  }
}
