import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, Output, SimpleChanges, TemplateRef } from '@angular/core';
import { FormArray, FormControl } from '@angular/forms';
import { moveAnimation } from 'src/app/animations';

@Component({
  selector: 'app-form-array-controls-order-list',
  templateUrl: './form-array-controls-order-list.component.html',
  styleUrls: ['./form-array-controls-order-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [moveAnimation]
})
export class FormArrayControlsOrderListComponent implements OnChanges {

  @Input() headerText: string | null = null;
  @Input() itemTemplate: TemplateRef<any> | null = null;
  @Input() arrayOfControls: FormArray = new FormArray<FormControl>([]);
  @Input() scrollToIndex: number | null = null;
  @Input() selectedIndex: number | null = null;
  @Output() selectedIndexChange = new EventEmitter<number | null>();
  @Output() onChanges = new EventEmitter<void>();

  animationRemoveInProgress: boolean = false;

  get buttonMoveUpDisabled(): boolean {
    return this.selectedIndex === null || this.selectedIndex === 0;
  }
  get buttonMoveDownDisabled(): boolean {
    return this.selectedIndex === null || this.selectedIndex === this.arrayOfControls.controls.length - 1;
  }
  get buttonRemoveDisabled(): boolean {
    return this.selectedIndex === null;
  }

  private readonly getNearestIndex = (index: number | null): number | null => {
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

  constructor(
    private readonly changeDetectorRef: ChangeDetectorRef,
  ) { }

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
    itemToScrollTo?.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' })
  }

  moveUpByIndex(indexFrom: number | null): void {
    if (indexFrom === null) {
      return;
    }
    if (indexFrom === 0) {
      return;
    }
    const indexTo = indexFrom - 1;
    this.animateItemByIndex(indexFrom, 'move-from-start-up', 'move-done');
    this.animateItemByIndex(indexTo, 'move-to-start', 'move-done');
    const temp = this.arrayOfControls.at(indexFrom);
    this.arrayOfControls.removeAt(indexFrom);
    this.arrayOfControls.insert(indexTo, temp);
    this.selectIndex(indexTo);
    this.scrollIntoViewByIndex(indexTo);
    this.onChanges.emit();
  }

  moveDownByIndex(indexFrom: number | null): void {
    if (indexFrom === null) {
      return;
    }
    if (indexFrom === this.arrayOfControls.length - 1) {
      return;
    }
    const indexTo = indexFrom + 1;
    this.animateItemByIndex(indexFrom, 'move-from-start-down', 'move-done');
    this.animateItemByIndex(indexTo, 'move-to-start', 'move-done');
    const temp = this.arrayOfControls.at(indexFrom);
    this.arrayOfControls.removeAt(indexFrom);
    this.arrayOfControls.insert(indexTo, temp);
    this.selectIndex(indexTo);
    this.scrollIntoViewByIndex(indexTo);
    this.onChanges.emit();
  }

  removeByIndex(index: number | null): void {
    if (index === null) {
      return;
    }
    this.animationRemoveInProgress = true;
    this.animateItemByIndex(index, 'move-to-trash', 'move-to-trash-done');
    setTimeout(() => {
      this.animationRemoveInProgress = false;
      this.arrayOfControls.removeAt(index);
      const nearestIndex = this.getNearestIndex(index);
      this.selectIndex(nearestIndex, { toggle: false });
    }, 250);
    this.onChanges.emit();
  }

  selectIndex(index: number | null, { toggle } = { toggle: true }): void {
    if (toggle && this.selectedIndex === index) {
      this.selectedIndexChange.emit(null);
      return;
    }
    this.selectedIndexChange.emit(index);
  }

  animateItemByIndex(index: number | null, animationFrom: string, animationTo: string): void {
    if (index === null) {
      return;
    }
    const { value } = this.arrayOfControls.at(index);
    value.animationState = animationFrom;
    this.changeDetectorRef.detectChanges();
    value.animationState = animationTo;
    this.changeDetectorRef.detectChanges();
  }

}
