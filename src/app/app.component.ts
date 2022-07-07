import { AfterViewInit, Component, HostListener, OnInit } from '@angular/core';
import { PrimeNGConfig } from 'primeng/api';
import { ScreenService } from './services/screen.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, AfterViewInit {
  title = 'EMeTSy';

  constructor(
    private primengConfig: PrimeNGConfig,
    private screenService: ScreenService,
  ) { }

  ngOnInit() {
    this.primengConfig.ripple = true;
  }

  ngAfterViewInit() {
    this.onResize();
  }

  @HostListener('window:resize', ['$event'])
  onResize(): void {
    this.screenService.addTrackComponent('windowHeight', window.innerHeight);
  }
}
