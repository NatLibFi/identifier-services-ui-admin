// Local copies of utils originally from melinda-backend-commons v3.0.6 (package has been deprecated since)

// Original package source: https://github.com/NatLibFi/melinda-backend-commons-js
// Original package copyright: Copyright (c) 2018-2026 University Of Helsinki (The National Library Of Finland)
// Original package license: MIT License (https://github.com/NatLibFi/melinda-backend-commons-js/blob/24410f1fe9de75322f255c36c0b7adc1f3552d9f/LICENSE.txt)

export function readEnvironmentVariable(name, {defaultValue = undefined, hideDefault = false, format = v => v} = {}) {
  if (process.env[name] === undefined) {
    if (defaultValue === undefined) {
      throw new Error(`Mandatory environment variable missing: ${name}`);
    }

    if (typeof defaultValue === 'boolean') {
      return Boolean(defaultValue);
    }

    const defaultValuePrintable = typeof defaultValue === 'object' ? JSON.stringify(defaultValue) : defaultValue;

    console.error(`No environment variable set for ${name}, using default value: ${hideDefault ? '[hidden]' : defaultValuePrintable}`);
    return defaultValue;
  }

  return format(process.env[name]);
}

export function handleInterrupt(arg) {
  if (arg instanceof Error) {
    console.error(`Uncaught Exception: ${arg.stack}`);
    process.exit(1);
  }

  console.log(`Received ${arg}`);
  process.exit(1);
}
