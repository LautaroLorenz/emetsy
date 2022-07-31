import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { ResultEnum, StandResult } from 'src/app/models';

@Component({
  selector: 'app-stand-result',
  templateUrl: './stand-result.component.html',
  styleUrls: ['./stand-result.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StandResultComponent implements OnInit {

  ResultEnum = ResultEnum;
  @Input() results: StandResult[] = [];

  constructor() { }

  ngOnInit(): void {
  }

}
