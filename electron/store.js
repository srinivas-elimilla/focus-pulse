const Store = require("electron-store");

const store = new Store({
  name: "settings",
  defaults: {
    interval: 60000, // 1 minute - default value
    soundEnabled: true,
    animationDuration: 350,
    autoStart: true,
  },
});

module.exports = store;
