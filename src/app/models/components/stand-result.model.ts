export enum ResultEnum {
  APPROVED = 'APPROVED',
  DISAPPROVED = 'DISAPPROVED',
}

export type Result = ResultEnum;

export interface StandResult {
  stand: number;
  calculatorErrorValue: number;
  result: Result;
}
