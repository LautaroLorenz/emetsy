import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit, ViewChild } from '@angular/core';
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
export class AbmComponent implements OnInit {

  @Input() title: string = '';
  @Input() headerIcon: PrimeIcons = '';
  @Input() dataset: any[] = [];
  @Input() columns: AbmColum[] = [];

  @ViewChild('primeNgTable', { static: true }) primeNgTable: Table | undefined;

  paginator = true;
  rows = 5;
  selected: any[] = [];

  get deleteDisabled(): boolean {
    return this.selected.length === 0;
  }

  constructor(
    private confirmationService: ConfirmationService,
    private messagesService: MessagesService,
    private changesDetectorRef: ChangeDetectorRef
  ) { }

  ngOnInit() { }

  filterDataset(event: Event) {
    if(!this.primeNgTable) {
      return;
    }

    const { value } = event.target as HTMLInputElement;
    this.primeNgTable.filterGlobal(value, 'contains')
  }

  clearSelected() {
    this.selected = [];
    this.changesDetectorRef.detectChanges();
  }

  deleteSelected() {
    if(this.deleteDisabled) {
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
        // TODO:
        // this.products = this.products.filter(val => !this.selectedProducts.includes(val));
        this.clearSelected();
        this.messagesService.success('Elementos eliminados');
      },
      reject: () => {
        this.messagesService.warn('Borrado cancelado correctamente');
      }
    });
  }
  
  deleteElement(element: any) {
    // TODO:
    console.log(element);
  }

  editElement(element: any) {
    // TODO:
    console.log(element);
  }

}
