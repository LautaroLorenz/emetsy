export const PROTOCOL = {
  TIME: {
    LOOP: {
      CHECK_IS_CONNECTED: 2000,
      GET_COMMAND: 250,
      POST_COMMAND: 500,
      CHECK_DEVICE_STATUS: 2000,
    },
    WAITING_RESPONSE_TIMEOUT: 3000,
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
    }
  }
};
