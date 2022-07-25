const { ipcMain } = require('electron');
const { SerialPort, DelimiterParser } = require('serialport');

let serialPort;
const parser = new DelimiterParser({ delimiter: 'Z| ', includeDelimiter: true })

async function listSerialPorts() {
  return await SerialPort.list();
}

ipcMain.handle('connect-with-hardware', async (_, { productId: argProductId, vendorId: argVendorId }) => {
  if (serialPort && serialPort.isOpen) {
    return true;
  }
  const ports = await listSerialPorts();
  const port = ports.find(({ productId, vendorId }) => productId === argProductId && vendorId === argVendorId);
  if (!port) {
    throw new Error('Hardware no encontrado en los USB disponibles'); // TODO: agregar al log
  }
  serialPort = new SerialPort({ path: port.path, baudRate: 9600 }, (err) => {
    console.error(err); // TODO: agregar al log
  });
  serialPort.pipe(parser);
  return true;
});


ipcMain.handle('send-command', async (_, { command }) => {
  console.log('send-command', `[${command}]`); // TODO: agregar al log
  return await new Promise((resolve, reject) => {
    serialPort.write(command, (err) => {
      if (err !== undefined) {
        reject('No se pudo enviar el comando'); // TODO: agregar al log
        return;
      }
    });
    serialPort.drain((err) => {
      if (err !== null) {
        reject('No se pudo esperar a que se envie el comando'); // TODO: agregar al log
        return;
      }
      resolve();
    });
  });
});

parser.on('data', (data) => {
  console.log('on-data', `[${data.toString()}]`); // TODO: agregar al log
  serialPort.flush((err) => { console.log('flush', err) });
});
