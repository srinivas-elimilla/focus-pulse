const { app, BrowserWindow, screen } = require("electron");
const path = require("path"); // keep if you need it elsewhere
const {
  startScheduler,
  stopScheduler,
  restartScheduler,
} = require("./scheduler");
const createTray = require("./tray");
const store = require("./store");

let overlayWindow = null;

function safeClose(win) {
  if (win && !win.isDestroyed()) {
    win.close();
  }
}

function createOverlay() {
  safeClose(overlayWindow);

  // Pick a size suitable for the toast
  const winWidth = 300;
  const winHeight = 80;
  const margin = 5; // ~1rem

  const display = screen.getPrimaryDisplay();
  const { x: waX, y: waY, width: waW, height: waH } = display.workArea; // excludes taskbar

  const x = Math.floor(waX + waW - winWidth - margin);
  const y = Math.floor(waY + waH - winHeight - margin);

  const win = new BrowserWindow({
    width: winWidth,
    height: winHeight,
    x,
    y,
    frame: false,
    transparent: true,
    alwaysOnTop: true,
    skipTaskbar: true,
    resizable: false,
    focusable: true, // allow click
    show: true,
  });

  overlayWindow = win;

  win.on("closed", () => {
    if (overlayWindow === win) overlayWindow = null;
  });

  win.setAlwaysOnTop(true, "screen-saver");

  const isDev = !app.isPackaged;

  if (isDev) {
    win.loadURL("http://localhost:5173");
  } else {
    win.loadFile(path.join(__dirname, "../renderer/dist/index.html"));
  }

  // Optional: if you still want auto-close as a backup (renderer will animate then close)
  const duration = store.get("animationDuration");
  setTimeout(() => safeClose(win), duration + 8000);
}

app
  .whenReady()
  .then(() => {
    startScheduler(createOverlay);
    createTray(createOverlay, restartScheduler);

    app.setLoginItemSettings({ openAtLogin: true });
  })
  .catch(console.error);

// Prevent app from quitting when overlay closes
app.on("window-all-closed", (e) => e.preventDefault());

// Clean up interval on quit (optional but good)
app.on("before-quit", () => {
  stopScheduler();
  safeClose(overlayWindow);
});
