export enum ResponseStatusEnum {
  ERROR = 'ERROR',
  ACK = 'ACK',
  TIMEOUT = 'TIMEOUT',
  UNKNOW = 'UNKNOW',
};
export type ResponseStatus = ResponseStatusEnum;

export const PROTOCOL = {
  TIME: {
    LOOP: {
      CHECK_IS_CONNECTED: 2000,
      GET_COMMAND: 250,
      POST_COMMAND: 500,
      CHECK_DEVICE_STATUS: 2000,
    },
    WAITING_RESPONSE_TIMEOUT: 5000,
    WAIT_STABILIZATION: 2000,
  },
  COMMAND: {
    DIVIDER: '| ',
    START: 'B',
    END: 'Z',
  },
  DEVICE: {
    SOFTWARE: {
      NAME: 'PCS',
    },
    GENERATOR: {
      NAME: 'GDR',
      COMMAND: {
        STATUS: 'STD00000',
        STOP: 'STP00000',
        START: 'MAR00000',
      }
    },
    STANDARD: {
      NAME: 'PTR',

    }
  }
};
