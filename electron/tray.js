const { Tray, Menu, app } = require("electron");
const path = require("path");
const store = require("./store");

let tray = null;

function createTray(createOverlay, restartScheduler) {
  tray = new Tray(path.join(__dirname, "timer.png"));

  const contextMenu = Menu.buildFromTemplate([
    {
      label: "15 Minutes",
      click: () => updateInterval(900000),
    },
    {
      label: "30 Minutes",
      click: () => updateInterval(1800000),
    },
    {
      label: "1 Hour",
      click: () => updateInterval(3600000),
    },
    { type: "separator" },
    {
      label: "Toggle Sound",
      type: "checkbox",
      checked: store.get("soundEnabled"),
      click: (menuItem) => {
        store.set("soundEnabled", menuItem.checked);
      },
    },
    {
      label: "Auto Start on Boot",
      type: "checkbox",
      checked: store.get("autoStart"),
      click: (menuItem) => {
        store.set("autoStart", menuItem.checked);
        app.setLoginItemSettings({
          openAtLogin: menuItem.checked,
        });
      },
    },
    { type: "separator" },
    {
      label: "Quit",
      click: () => app.quit(),
    },
  ]);

  tray.setContextMenu(contextMenu);

  function updateInterval(ms) {
    store.set("interval", ms);
    restartScheduler(createOverlay);
  }
}

module.exports = createTray;
