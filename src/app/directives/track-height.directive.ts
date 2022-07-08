import { Directive, ElementRef, Input, HostListener, AfterViewInit } from '@angular/core';
import { ScreenService } from '../services/screen.service';

@Directive({
  selector: '[appTrackHeight]'
})
export class TrackHeightDirective implements AfterViewInit {

  @Input() appTrackHeight!: string;
  private readonly element: HTMLElement;

  constructor(
    private readonly hostElement: ElementRef,
    private readonly screenService: ScreenService,
  ) {
    this.element = this.hostElement.nativeElement;
  }
  
  ngAfterViewInit(): void {
    this.onResize();
  }

  @HostListener('window:resize', ['$event'])
  onResize(): void {
    this.screenService.addTrackComponent(this.appTrackHeight, this.element.offsetHeight);
  }
}