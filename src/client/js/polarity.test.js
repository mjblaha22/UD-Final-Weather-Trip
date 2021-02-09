const formCheck = require('./formResponse');
let polarity = 'P'
test('changes polarity', () => {
  expect(formCheck(polarity)).toBe('POSITIVE');
});
