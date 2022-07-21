import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { StepBuilder } from 'src/app/models';

@Component({
  selector: 'app-step-execution-status-list',
  templateUrl: './step-execution-status-list.component.html',
  styleUrls: ['./step-execution-status-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StepExecutionStatusListComponent implements OnInit {

  @Input() steps!: StepBuilder[];
  @Input() activeStepIndex!: number;
  @Input() activeActionIndex!: number;

  constructor() { }

  ngOnInit(): void {
    console.log(this.steps); // TODO: borrar esta linea
  }

}
