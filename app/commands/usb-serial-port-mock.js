const { ipcMain } = require('electron');
const { MockBinding } = require('@serialport/binding-mock')
const { SerialPortStream } = require('@serialport/stream')
const { DelimiterParser } = require('serialport');
const { getRandomInt } = require('../resources/mock/random');
const { getContrastResult } = require('../resources/mock/essay/essay-contrast-mock');

let serialPort;
const parser = new DelimiterParser({ delimiter: '\n', includeDelimiter: false });
let readCommandQueue = [];
const MAX_QUEUE_SIZE = 10;

function isUsbSerialPortConnected(serialPort) {
  return serialPort && serialPort.isOpen;
}

/**
 * @return true if usb is connected
 */
ipcMain.handle('is-usb-serial-port-connected', async () => {
  return isUsbSerialPortConnected(serialPort);
});

/**
 * @return true if can open usb serial port
 */
ipcMain.handle('open-usb-serial-port', async (_, { productId, vendorId }) => {
  // Create a port and enable the echo and recording.
  MockBinding.createPort('/dev/ROBOT', { echo: true, record: true })
  serialPort = new SerialPortStream({ binding: MockBinding, path: '/dev/ROBOT', baudRate: 14400 })
  readCommandQueue = [];
  parser.removeAllListeners();
  initParser(parser);
  serialPort.pipe(parser);
  return true;
});

/**
 * @return true if can close usb serial port
 */
ipcMain.handle('close-usb-serial-port', async () => {
  console.log('close puerto USB');
  if (!isUsbSerialPortConnected(serialPort)) {
    return true;
  }
  const isClosed = await new Promise((resolve) => {
    serialPort.close((err) => {
      if (err !== null && err !== undefined) {
        console.error('No se pudo cerrar el puerto', err);
      }
      resolve(err === null || err === undefined);
    });
  });
  readCommandQueue = [];
  parser.removeAllListeners();
  serialPort = undefined;
  return isClosed;
});

/*
* --------------------------------------------------------------------------------
*                             BELOW QUEUE HANDLERS
* --------------------------------------------------------------------------------
*/

function addCommandToQueue(command, queue, MAX_QUEUE_SIZE) {
  if (queue.length === MAX_QUEUE_SIZE) {
    queue.pop(); // discard older command
  }
  logFromSimulatorToSoftware(command, queue);
  queue.unshift(command);
}

/**
 * when a command incomming from serial port, add it to queue.
 */
function initParser(parser) {
  parser.on('data', (data) => {
    addCommandToQueue(data.toString("ascii"), readCommandQueue, MAX_QUEUE_SIZE);
  });
}

/**
 * when renderer process request older command.
 */
ipcMain.handle('get-command', async () => {
  if (readCommandQueue.length === 0) {
    return false;
  }
  return readCommandQueue.pop();
});

ipcMain.handle('post-command', async (_, { command }) => {
  logFromSoftwareToSimulator(command);

  // emitir un dato mock según el comando que se recibe
  serialPort.port.emitData(getMockResponse(command));

  return true;
});


/*
* --------------------------------------------------------------------------------
*                             LOGS
* --------------------------------------------------------------------------------
*/

function logFromSoftwareToSimulator(command) {
  console.log('write', `[${command}]`);
}

function logFromSimulatorToSoftware(command, queue) {
  console.log('read', `[${command}]`, `total: ${queue.length}`);
}

/*
* --------------------------------------------------------------------------------
*                             MOCK RESPONSES
* --------------------------------------------------------------------------------
*/

const ESSAY_TYPES = {
  CONTRAST: 'CONTRAST',
  VACUUM: 'VACUUM',
};
let essayType = '';

function getMockResponse(command) {
  const parts = command.split('| ');
  const to = parts[2];
  const type = parts[3];
  let response = '';

  if (to === 'GDR') {
    if (type === 'MAR00000') {
      response = 'B| GDR| PCS| ACK0 000| Z| ';
    }
    if (type === 'STD00000') {
      response = 'B| GDR| PCS| ACK0 000| Z| ';
    }
    if (type === 'STP00000') {
      response = 'B| GDR| PCS| ACK0 000| Z| ';
    }
  }

  if (to === 'PAT') {
    if (type === 'MAR00000') {
      response = 'B| PAT| PCS| ACK00000| Z| 2';
    }
    if (type === 'STD00000') {
      response = `B| PAT| PCS| 1234567891| 0000${getRandomInt(2111, 2219)}| 0000${getRandomInt(2111, 2219)}| 0000${getRandomInt(2111, 2219)}| 000000${getRandomInt(41, 59)}| 000000${getRandomInt(41, 59)}| 000000${getRandomInt(41, 59)}| 0000+00${getRandomInt(1, 9)}| 0000+00${getRandomInt(1, 9)}| 0000+00${getRandomInt(1, 9)}| Z| %`;
    }
    if (type === 'STP00000') {
      response = 'B| PAT| PCS| ACK00000| Z| 2';
    }
  }

  if (to === 'CAL') {
    switch (type) {
      case 'TS1xxxxx':
        essayType = ESSAY_TYPES.CONTRAST;
        response = 'B| CAL| PCS| ACK00000| Z| ';
        break;
      case 'TS2xxxxx':
        essayType = ESSAY_TYPES.VACUUM;
        // TODO: reset/prepare counters
        response = 'B| CAL| PCS| ACK00000| Z| ';
        break;
      case 'STD00000':
        switch (essayType) {
          case ESSAY_TYPES.CONTRAST:
            response = getContrastResult();
            break;
          case ESSAY_TYPES.VACUUM:
            // TODO: response = getContrastResult();
            break;
        }
        break;
      case 'STP00000':
        response = 'B| CAL| PCS| ACK00000| Z| ';
        break;
    }
  }

  return response + '\n';
}