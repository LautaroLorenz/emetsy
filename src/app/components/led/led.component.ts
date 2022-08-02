import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { LedColor, LedColorEnum } from 'src/app/models';

@Component({
  selector: 'app-led',
  templateUrl: './led.component.html',
  styleUrls: ['./led.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LedComponent {

  @Input() color: LedColor = LedColorEnum.WHITE;

  constructor() { }

}
