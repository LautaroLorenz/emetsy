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
      GET_COMMAND: 150,
      POST_COMMAND: 300,
      STATUS_REPORTING: 850, // debe ser mayor a WAITING_RESPONSE_TIMEOUT o genera un nuevo llamado antes de romper por timeout.
    },
    WAITING_RESPONSE_TIMEOUT: 750,
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
