const { ipcMain } = require('electron');
const { SerialPort, DelimiterParser } = require('serialport');

let serialPort;
const parser = new DelimiterParser({ delimiter: '\n', includeDelimiter: false });
let readCommandQueue = [];
const MAX_QUEUE_SIZE = 10;
const EXCLUDED_CODES = {
  BAR_N: 10,
  CHAR_B: 66,
  CHAR_Z: 90,
};
const CHECKSUM_EXCLUDED_CODES = [EXCLUDED_CODES.BAR_N, EXCLUDED_CODES.CHAR_B, EXCLUDED_CODES.CHAR_Z];

function isCommandValid(buffer) {
  let cheksum = 0;
  for (const [index, byteHex] of buffer.entries()) {
    if (index === buffer.length - 1) {
      break;
    }
    cheksum += byteHex;
  }
  let checksumByte = cheksum % 256;
  if (CHECKSUM_EXCLUDED_CODES.includes(checksumByte)) {
    checksumByte++;
  }
  return checksumByte === buffer[buffer.length - 1];
}

function decimalChecksumToBuffer(checksum) {
  return Buffer.from(checksum.toString(16), 'hex')
}

function getChecksumByte(buffer) {
  let cheksum = 0;
  for (const byte of buffer) {
    cheksum += byte;
  }
  let checksumByte = cheksum % 256;
  if (CHECKSUM_EXCLUDED_CODES.includes(checksumByte)) {
    checksumByte++;
  }
  return checksumByte;
}

function isUsbSerialPortConnected(serialPort) {
  return serialPort && serialPort.isOpen;
}

async function findUsbPort(argProductId, argVendorId) {
  const ports = await SerialPort.list();
  return ports.find(({ productId, vendorId }) => productId === argProductId && vendorId === argVendorId);
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
  if (isUsbSerialPortConnected(serialPort)) {
    return true;
  }
  const port = await findUsbPort(productId, vendorId);
  if (!port) {
    console.error('Puerto no encontrado');
    return false;
  }
  const isOpen = await new Promise((resolve) => {
    serialPort = new SerialPort({ path: port.path, baudRate: 9600 }, (err) => {
      if (err !== null && err !== undefined) {
        console.error('No se pudo abrir el puerto', err);
      }
      resolve(err === null || err === undefined);
    });
  });
  if (!isOpen) {
    return false;
  }
  readCommandQueue = [];
  parser.removeAllListeners();
  initParser(parser);
  if (!serialPort) {
    console.error('No se pudo crear el puerto');
    return false;
  }
  serialPort.pipe(parser);
  return true;
});

/**
 * @return true if can close usb serial port
 */
ipcMain.handle('close-usb-serial-port', async () => {
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
  console.log('read', `[${command}]`, `total: ${queue.length}`);
  queue.unshift(command);
}

/**
 * when a command incomming from serial port, add it to queue.
 */
function initParser(parser) {
  parser.on('data', (data) => {
    if (isCommandValid(data) === false) {
      console.error("checksum invalid", data.toString("ascii"));
      return;
    }
    addCommandToQueue(data.toString("ascii"), readCommandQueue, MAX_QUEUE_SIZE);
    serialPort.flush((err) => {
      if (err !== null && err !== undefined) {
        console.error('No se pudo limpiar el buffer de entrada', err);
      }
    });
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

  const buffer = Buffer.from(command, 'ascii');
  const checksum = getChecksumByte(buffer);
  const checksumBuffer = decimalChecksumToBuffer(checksum);
  const commandBuffer = Buffer.concat([buffer, checksumBuffer]);

  console.log('write', `[${commandBuffer}]`);
  // console.log('checksum', checksum);
  // console.log('length', commandBuffer.length);
  // console.log('write', commandBuffer.toString('hex').match(/../g).join(' '));

  const coludBeSent = await new Promise((resolve) => {
    serialPort.write(commandBuffer, (err) => {
      if (err !== null && err !== undefined) {
        console.error('No se pudo enviar el comando', err);
        resolve(false);
      }
    });
    serialPort.drain((err) => {
      if (err !== null && err !== undefined) {
        console.error('No se pudo esperar a que se envie el comando', err);
      }
      resolve(err === null || err === undefined);
    });
  });
  return coludBeSent;
});
