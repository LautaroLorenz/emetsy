export enum ResultEnum {
  APPROVED = 'APPROVED',
  DISAPPROVED = 'DISAPPROVED',
}

export type Result = ResultEnum;

export interface StandResult {
  stand: number;
  value: number;
  calculatedError: number;
  result: Result;
}
