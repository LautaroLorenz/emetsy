import { ChangeDetectionStrategy, Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Color, Static } from 'src/app/models';

@Component({
  selector: 'app-execution-by-essay',
  templateUrl: './execution-by-essay.component.html',
  styleUrls: ['./execution-by-essay.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ExecutionByEssayComponent implements OnChanges {

  @Input() executions: Static[] = [];
  @Input() max: number = 5;

  readonly data$: BehaviorSubject<any> = new BehaviorSubject<any>({
    datasets: [{
      data: [],
      backgroundColor: []
    }],
    labels: []
  });
  readonly chartOptions: any;

  constructor() {
    this.chartOptions = {};
  }

  private group(executions: Static[]): void {
    const executionsByEssay = {} as any;
    const metric: { label: string, value: number, color: string }[] = [];
    executions.forEach(({ tags_raw }) => {
      const { essay } = tags_raw as any;
      executionsByEssay[essay] = (executionsByEssay[essay] + 1) || 1;
    });
    for (const [index, key] of Object.keys(executionsByEssay).entries()) {
      const value = executionsByEssay[key];
      metric.push({
        color: Color.getColorByIndex(index, '77'),
        label: key,
        value: value,
      });
    }
    metric.sort(({ value: a }, { value: b }) => b - a);
    const top = metric.slice(0, this.max);
    this.data$.next({
      datasets: [{
        data: top.map(({ value }) => value),
        backgroundColor: top.map(({ color }) => color),
      }],
      labels: top.map(({ label }) => label),
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes) {
      if (changes['executions']) {
        const executions = changes['executions'].currentValue ?? this.executions;
        this.group(executions);
      }
    }
  }

}
