const utils = require('./utils');
const COMPATIBLE_RUNTIME = [
  'nodejs12',
  'nodejs10',
  'nodejs8',
  'nodejs6',
  'python3',
  'python2.7',
];
module.exports = {
  ...utils,
  COMPATIBLE_RUNTIME,
};
