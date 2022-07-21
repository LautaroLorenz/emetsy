import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-step-execution-status-list',
  templateUrl: './step-execution-status-list.component.html',
  styleUrls: ['./step-execution-status-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StepExecutionStatusListComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
