const { getRandomInt } = require('../random');

let pulses = 0;
let counter = 0;
const relation = 3;

exports.prepareCounters = () => {
  pulses = 0;
  counter = 0;
}

exports.incrementCounter = () => {
  counter++;
  pulses = Math.floor(counter / relation);
}

exports.getVacuumResult = () => {
  let response = `B| CAL| PCS|`;
  for (let i = 0; i < 20; i++) {
    const index = String(i + 1).padStart(2, '0');
    const simbol = '+';
    const result = String(pulses).padStart(3, '0');
    response += ` P${index}${simbol}0${result}|`;
  }
  response += ' Z';
  return response;
}