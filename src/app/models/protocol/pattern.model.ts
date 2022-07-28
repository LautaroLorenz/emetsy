export enum PatternStatusEnum {
  UNKNOW = 'UNKNOW',
  REQUEST_IN_PROGRESS = 'REQUEST_IN_PROGRESS',
  REPORTING = 'REPORTING',
  TIMEOUT = 'TIMEOUT',
  ERROR = 'ERROR',
  TURN_OFF = 'TURN_OFF',
}
export type PatternStatus = PatternStatusEnum;