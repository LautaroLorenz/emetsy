export enum ResultEnum {
  APPROVED = 'APPROVED',
  DISAPPROVED = 'DISAPPROVED',
  PARTIAL = 'PARTIAL',
}

export type Result = ResultEnum;

export interface StandResult {
  stand: number;
  calculatorValue: number;
  result: Result;
}
