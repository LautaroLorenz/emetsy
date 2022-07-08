import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, Output, SimpleChanges, TemplateRef } from '@angular/core';
import { FormArray, FormControl } from '@angular/forms';

@Component({
  selector: 'app-form-array-controls-order-list',
  templateUrl: './form-array-controls-order-list.component.html',
  styleUrls: ['./form-array-controls-order-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FormArrayControlsOrderListComponent implements OnChanges {

  @Input() headerText: string | null = null;
  @Input() itemTemplate: TemplateRef<any> | null = null;
  @Input() arrayOfControls: FormArray = new FormArray<FormControl>([]);
  @Input() scrollToIndex: number | null = null;
  @Input() selectedIndex: number | null = null;
  @Output() selectedIndexChange = new EventEmitter<number | null>();
  @Output() onChanges = new EventEmitter<void>();

  get buttonMoveUpDisabled(): boolean {
    return this.selectedIndex === null || this.selectedIndex === 0;
  }
  get buttonMoveDownDisabled(): boolean {
    return this.selectedIndex === null || this.selectedIndex === this.arrayOfControls.controls.length - 1;
  }
  get buttonRemoveDisabled(): boolean {
    return this.selectedIndex === null;
  }

  private getNearestIndex = (index: number | null): number | null => {
    if (index === null) {
      return null;
    }
    if (this.arrayOfControls.controls[index - 1]) {
      return index - 1;
    }
    if (this.arrayOfControls.controls[index]) {
      return index;
    }
    return null;
  }

  constructor() { }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes) {
      if (changes['scrollToIndex']) {
        const scrollToIndexValue = changes['scrollToIndex'].currentValue ?? this.scrollToIndex;
        setTimeout(() => this.scrollIntoViewByIndex(scrollToIndexValue));
      }
    }
  }

  scrollIntoViewByIndex(index: number | null): void {
    if (index === null) {
      return;
    }
    const itemToScrollTo = document.getElementById(`panel-index-${index}`);
    itemToScrollTo?.scrollIntoView({ behavior: 'auto', block: 'center', inline: 'center' })
  }

  moveUpByIndex(index: number | null): void {
    if (index === null) {
      return;
    }
    if (index === 0) {
      return;
    }
    const temp = this.arrayOfControls.at(index);
    this.arrayOfControls.removeAt(index);
    this.arrayOfControls.insert(index - 1, temp);
    this.selectIndex(index - 1);
    this.scrollIntoViewByIndex(index - 1);
    this.onChanges.emit();
  }

  moveDownByIndex(index: number | null): void {
    if (index === null) {
      return;
    }
    if (index === this.arrayOfControls.length - 1) {
      return;
    }
    const temp = this.arrayOfControls.at(index + 1);
    this.arrayOfControls.removeAt(index + 1);
    this.arrayOfControls.insert(index, temp);
    this.selectIndex(index + 1);
    this.scrollIntoViewByIndex(index + 1);
    this.onChanges.emit();
  }

  removeByIndex(index: number | null): void {
    if (index === null) {
      return;
    }
    this.arrayOfControls.removeAt(index);
    const nearestIndex = this.getNearestIndex(index);
    this.selectIndex(nearestIndex, { toggle: false });
    this.onChanges.emit();
  }

  selectIndex(index: number | null, { toggle } = { toggle: true }): void {
    if (toggle && this.selectedIndex === index) {
      this.selectedIndexChange.emit(null);
      return;
    }
    this.selectedIndexChange.emit(index);
  }

}
