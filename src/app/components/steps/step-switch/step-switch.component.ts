import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-step-switch',
  templateUrl: './step-switch.component.html',
  styleUrls: ['./step-switch.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StepSwitchComponent implements OnInit, OnChanges {

  @Input() selectedIndex!: number | null;
  @Input() stepId!: number;
  @Input() actionsRawData!: any[];
  @Output() actionsRawDataChange = new EventEmitter<any[]>();

  readonly refreshInterface = new BehaviorSubject<boolean>(true);

  constructor() { }

  ngOnInit() {
    if (!this.stepId) {
      throw new Error("@Input() \"stepId\" is required");
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes) {
      if (changes['selectedIndex']) {
        if (changes['selectedIndex'].currentValue !== changes['selectedIndex'].previousValue) {
          this.refreshInterface.next(false);
          setTimeout(() => this.refreshInterface.next(true));
        }
      }
    }
  }
}
