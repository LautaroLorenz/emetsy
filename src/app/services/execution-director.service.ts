import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { Action, ExecutionStatus, StepBuilder } from "../models";


@Injectable({
  providedIn: "root"
})
export class ExecutionDirector {
  private steps: StepBuilder[] = [];
  public activeStepIndex$ = new BehaviorSubject<number | null>(null);
  public activeActionIndex$ = new BehaviorSubject<number | null>(null);
  public activeAction$ = new BehaviorSubject<Action | null>(null);
  public executionStatus$ = new BehaviorSubject<ExecutionStatus>('CREATED');

  setSteps(steps: StepBuilder[]): void {
    this.steps = steps;
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
    this.executionStatus$.next('COMPLETED');
  }

  executeNext(): void {
    if (this.executionStatus$.value === 'COMPLETED') {
      return;
    }
    const { value: activeStepIndex } = this.activeStepIndex$;
    const { value: activeActionIndex } = this.activeActionIndex$;
    if (activeStepIndex === null || activeActionIndex === null) {
      this.activeStepIndex$.next(0);
      this.activeActionIndex$.next(0);
      this.activeAction$.next(this.steps[0].actions[0]);
      this.activeAction$.value?.executionStatus$.next('IN_PROGRESS');
      return;
    }
    this.activeAction$.value?.executionStatus$.next('COMPLETED');
    const nextAction = this.steps[activeStepIndex].actions.find((action, index) => action.executionStatus$.value === 'PENDING' && index > activeActionIndex);
    const nextActionIndex = this.steps[activeStepIndex].actions.findIndex((action, index) => action.executionStatus$.value === 'PENDING' && index > activeActionIndex);
    if (nextAction) {
      this.activeStepIndex$.next(activeStepIndex);
      this.activeActionIndex$.next(nextActionIndex);
      this.activeAction$.next(nextAction);
      this.activeAction$.value?.executionStatus$.next('IN_PROGRESS');
      return;
    }
    const nextStep = this.steps.find((step, index) => index > activeStepIndex && step.actions.some((action) => action.executionStatus$.value === 'PENDING'));
    const nextStepIndex = this.steps.findIndex((step, index) => index > activeStepIndex && step.actions.some((action) => action.executionStatus$.value === 'PENDING'));
    if (nextStep) {
      const nextAction = this.steps[nextStepIndex].actions.find((action) => action.executionStatus$.value === 'PENDING');
      const nextActionIndex = this.steps[nextStepIndex].actions.findIndex((action) => action.executionStatus$.value === 'PENDING');
      if (nextAction) {
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
    this.executionStatus$.next('COMPLETED');
    return;
  }
}