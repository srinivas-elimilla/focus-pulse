const store = require("./store");

let timer = null;

function startScheduler(createOverlay) {
  const interval = store.get("interval");
  console.log("Scheduler started:", interval);

  if (timer) clearInterval(timer);

  timer = setInterval(() => {
    console.log("Trigger overlay");
    createOverlay();
  }, interval);
}

function stopScheduler() {
  if (timer) clearInterval(timer);
  timer = null;
}

function restartScheduler(createOverlay) {
  stopScheduler();
  startScheduler(createOverlay);
}

module.exports = { startScheduler, stopScheduler, restartScheduler };
