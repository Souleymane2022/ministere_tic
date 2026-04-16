const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

function stamp() {
  return new Date().toISOString();
}

module.exports = {
  info: (...args) => console.log(colors.cyan + '[INFO]' + colors.reset, stamp(), ...args),
  success: (...args) => console.log(colors.green + '[OK]' + colors.reset, stamp(), ...args),
  warn: (...args) => console.warn(colors.yellow + '[WARN]' + colors.reset, stamp(), ...args),
  error: (...args) => console.error(colors.red + '[ERROR]' + colors.reset, stamp(), ...args),
};
