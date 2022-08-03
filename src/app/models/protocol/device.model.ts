import { BehaviorSubject, Subject } from "rxjs";

export enum DeviceStatusEnum {
  UNKNOWN = 'UNKNOWN',
  TURN_ON = 'TURN_ON',
  TURN_OFF = 'TURN_OFF',
  FAIL = 'FAIL',
}

export type DeviceStatus = DeviceStatusEnum;

export type ErrorCode = number | null;

export interface Device {
  sendStoper$: Subject<void>;
  errorMessage$: BehaviorSubject<string | null>;
  deviceStatus$: BehaviorSubject<DeviceStatus>;
}
