const { getRandomInt } = require('../random');

exports.getContrastResult = () => {
  let response = `B| CAL| PCS|`;
  for (let i = 0; i < 20; i++) {
    const index = String(i + 1).padStart(2, '0');
    const simbol = getRandomInt(1, 3) % 2 === 0 ? '+' : '-';
    const result = String(getRandomInt(0, 200)).padStart(3, '0');
    response += ` P${index}${simbol}0${result}|`;
  }
  response += ' Z';
  return response;
}

