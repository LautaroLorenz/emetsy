import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { Phases } from 'src/app/models';

@Component({
  selector: 'app-phases',
  templateUrl: './phases.component.html',
  styleUrls: ['./phases.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PhasesComponent implements OnInit {

  @Input() phases!: Phases;

  constructor() { }

  ngOnInit(): void {
  }

}
