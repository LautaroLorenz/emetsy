import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { Observable, take } from 'rxjs';
import { UsbHandlerService } from 'src/app/services/usb-handler.service';

@Component({
  selector: 'app-connection-status',
  templateUrl: './connection-status.component.html',
  styleUrls: ['./connection-status.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ConnectionStatusComponent implements OnInit, OnDestroy {

  get connected$(): Observable<boolean> {
    return this.usbHandlerService.connected$;
  }

  constructor(
    private readonly usbHandlerService: UsbHandlerService,
  ) { }

  ngOnInit(): void {
    this.connect();
  }

  connect(): void {
    this.usbHandlerService.connect().pipe(
      take(1),
    ).subscribe();
  }

  ngOnDestroy(): void {
    this.usbHandlerService.disconnect().pipe(
      take(1),
    ).subscribe();
  }
}
