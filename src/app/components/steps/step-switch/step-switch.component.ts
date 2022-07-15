import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { StepStateEnum } from 'src/app/models';

@Component({
  selector: 'app-step-switch',
  templateUrl: './step-switch.component.html',
  styleUrls: ['./step-switch.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StepSwitchComponent implements OnInit {

  @Input() stepId!: number;
  @Input() stepStateEnum!: StepStateEnum;

  ngOnInit() {
    if(!this.stepId) {
      throw new Error("@Input() \"stepId\" is required");
    }
    if(!this.stepStateEnum) {
      throw new Error("@Input() \"stepStateEnum\" is required");
    }
  }

}
