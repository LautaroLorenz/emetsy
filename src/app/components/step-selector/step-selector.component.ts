import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Step } from 'src/app/models';

@Component({
  selector: 'app-step-selector',
  templateUrl: './step-selector.component.html',
  styleUrls: ['./step-selector.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StepSelectorComponent implements OnInit {

  @Input() steps: Step[] = [];
  @Output() stepSelected = new EventEmitter<Step>();

  constructor() { }

  ngOnInit(): void {
  }

}
