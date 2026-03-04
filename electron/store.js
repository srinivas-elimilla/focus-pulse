const Store = require("electron-store");

const store = new Store({
  name: "settings",
  defaults: {
    interval: 10000, // 1 hour in ms
    soundEnabled: true,
    animationDuration: 350,
    autoStart: true,
  },
});

module.exports = store;
