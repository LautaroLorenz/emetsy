import { Component, OnInit } from '@angular/core';

@Component({
  templateUrl: './essay-template-builder.component.html',
  styleUrls: ['./essay-template-builder.component.scss']
})
export class EssayTemplateBuilderComponent implements OnInit {

  readonly title: string = 'Ensayo';

  constructor() { }

  ngOnInit(): void {
  }

}
