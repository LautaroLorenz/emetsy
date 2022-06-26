import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { filter, map, Observable } from 'rxjs';

@Component({
  templateUrl: './execute-essay.component.html',
  styleUrls: ['./execute-essay.component.scss']
})
export class ExecuteEssayComponent implements OnInit {

  readonly id$: Observable<number>;

  constructor(
    private readonly route: ActivatedRoute,
  ) {
    this.id$ = this.route.queryParams.pipe(
      filter(({ id }) => id),
      map(({ id }) => id)
    );
  }

  ngOnInit(): void {
  }

}
