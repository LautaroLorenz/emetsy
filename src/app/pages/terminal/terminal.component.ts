import { Component, OnInit } from '@angular/core';


@Component({
  selector: 'app-terminal',
  templateUrl: './terminal.component.html',
  styleUrls: ['./terminal.component.scss']
})
export class TerminalComponent implements OnInit {

  title = 'Terminal';

  constructor() { }

  ngOnInit(): void {
  }

}
