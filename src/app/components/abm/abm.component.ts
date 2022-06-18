import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-abm',
  templateUrl: './abm.component.html',
  styleUrls: ['./abm.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AbmComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
