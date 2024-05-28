chrome.runtime.onInstalled.addListener(() => {
  console.log("Time Utils extension installed.");
});

chrome.storage.onChanged.addListener((changes, area) => {
  if (area === "local" && changes.timerEndTime) {
    const endTime = changes.timerEndTime.newValue;
    if (endTime) {
      startBackgroundTimer(endTime);
    }
  }
});

function startBackgroundTimer(endTime) {
  const timeRemaining = Math.max(0, endTime - Date.now());
  if (timeRemaining <= 0) {
    chrome.storage.local.remove("timerEndTime");
    chrome.notifications.create("session-notification", {
      type: "basic",
      iconUrl: "assets/clock_icon.png",
      title: "Session Complete!",
      message: "Your timer session is complete!",
    });
  } else {
    setTimeout(() => startBackgroundTimer(endTime), timeRemaining);
  }
}

chrome.storage.local.get("timerEndTime", (data) => {
  const endTime = data.timerEndTime;
  if (endTime) {
    startBackgroundTimer(endTime);
  }
});
