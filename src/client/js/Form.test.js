const trueCheck = require('./formResponse');
let cityReal = 'chicago'
test('check if city input is only letters', () => {
  expect(trueCheck(cityReal)).toBe(true);
});
const falseCheck = require('./formResponse');
let cityFalse = 'chicago1'
test('check if city input is only letters', () => {
  expect(falseCheck(cityFalse)).toBe(false);
});