export enum WorkingParamsStatusEnum {
  UNKNOW = 'UNKNOW',
  REQUEST_IN_PROGRESS = 'REQUEST_IN_PROGRESS',
  PARAMETERS_SET_CORRECTLY = 'PARAMETERS_SET_CORRECTLY',
  PARAMETERS_SET_ERROR = 'PARAMETERS_SET_ERROR',
  PARAMETERS_TURN_OFF = 'PARAMETERS_TURN_OFF',
}
export type WorkingParametersStatus = WorkingParamsStatusEnum;

export enum GeneratorStatusEnum {
  UNKNOW = 'UNKNOW',
  REQUEST_IN_PROGRESS = 'REQUEST_IN_PROGRESS',
  WORKING = 'WORKING',
  TIMEOUT = 'TIMEOUT',
  ERROR = 'ERROR',
  TURN_OFF = 'TURN_OFF',
}
export type GeneratorStatus = GeneratorStatusEnum;