import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-boot-test-execution-action',
  templateUrl: './boot-test-execution-action.component.html',
  styleUrls: ['./boot-test-execution-action.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BootTestExecutionActionComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
