import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { Action, ExecutionStatus, ReportEssayDirector, StepBuilder } from "../models";


@Injectable({
  providedIn: "root"
})
export class ExecutionDirector {

  public reportEssayDirector = new ReportEssayDirector();
  public activeStepIndex$ = new BehaviorSubject<number | null>(null);
  public activeActionIndex$ = new BehaviorSubject<number | null>(null);
  public activeAction$ = new BehaviorSubject<Action | null>(null);
  public executionStatus$ = new BehaviorSubject<ExecutionStatus>('CREATED');

  private steps: StepBuilder[] = [];

  setSteps(steps: StepBuilder[]): void {
    this.steps = steps;
    this.reportEssayDirector.setSteps(steps);
  }

  resetState(): void {
    this.steps = [];
    this.activeStepIndex$.next(null);
    this.activeActionIndex$.next(null);
    this.activeAction$.next(null);
    this.executionStatus$.next('CREATED');
  }

  prepareStepsToExecute(): void {
    this.steps.forEach(({ actions }) => {
      actions.forEach((action) => {
        action.executionStatus$.next(action.form.valid ? 'COMPLETED' : 'PENDING');
      });
    });
    if (this.steps.some(({ actions }) => actions.some(({ executionStatus$ }) => executionStatus$.value === 'PENDING'))) {
      this.activeStepIndex$.next(null);
      this.activeActionIndex$.next(null);
      this.activeAction$.next(null);
      this.executionStatus$.next('IN_PROGRESS');
      return;
    }
    this.executionStatus$.next('CREATED');
  }

  executeNext(): void {
    if (this.executionStatus$.value === 'COMPLETED') {
      return;
    }
    if (this.activeAction$.value) {
      this.activeAction$.value.executionStatus$.next('COMPLETED');
    }
    const nextStepIndex = this.steps.findIndex(({ actions }) => actions.some(({ executionStatus$ }) => executionStatus$.value === 'PENDING'));
    if (nextStepIndex !== -1) {
      const nextAction = this.steps[nextStepIndex].actions.find(({ executionStatus$ }) => executionStatus$.value === 'PENDING');
      const nextActionIndex = this.steps[nextStepIndex].actions.findIndex(({ executionStatus$ }) => executionStatus$.value === 'PENDING');
      if (nextAction !== undefined) {
        this.activeStepIndex$.next(nextStepIndex);
        this.activeActionIndex$.next(nextActionIndex);
        this.activeAction$.next(nextAction);
        this.activeAction$.value?.executionStatus$.next('IN_PROGRESS');
        return;
      }
    }
    this.activeStepIndex$.next(null);
    this.activeActionIndex$.next(null);
    this.activeAction$.next(null);
    if (this.steps.length > 0) {
      this.executionStatus$.next('COMPLETED');
    }
    return;
  }

  getActiveStepBuilder(): StepBuilder | null {
    if (this.activeStepIndex$.value === null) {
      return null;
    }
    return this.steps[this.activeStepIndex$.value];
  }
}
