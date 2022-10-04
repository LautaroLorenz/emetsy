export enum ResultEnum {
  APPROVED = 'APPROVED',
  DISAPPROVED = 'DISAPPROVED',
}

export type Result = ResultEnum;

export interface StandResult {
  stand: number;
  calculatorValue: number;
  result: Result;
}
