import '@testing-library/jest-dom'

// The Firebase rules test SDK uses Node's scheduling API, while Create React
// App's jsdom environment does not expose it.
global.setImmediate =
  global.setImmediate || ((callback, ...args) => setTimeout(callback, 0, ...args))
global.clearImmediate = global.clearImmediate || clearTimeout
