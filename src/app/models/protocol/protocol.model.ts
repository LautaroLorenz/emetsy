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
      STATUS_REPORTING: 15000, // TODO:
    },
    WAITING_RESPONSE_TIMEOUT: 3000,
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
    PATTERN: {
      NAME: 'PAT',
      COMMAND: {
        STATUS: 'STD00000',
        STOP: 'STP00000',
        START: 'MAR00000',
      }
    }
  }
};
