document.addEventListener("DOMContentLoaded", function () {
  const analogClock = document.getElementById("analog-clock");
  const digitalClock = document.getElementById("digital-clock");
  const timeZoneElem = document.getElementById("time-zone");
  const currentDateElem = document.getElementById("current-date");
  const timerInput = document.getElementById("timer-input");
  const startTimerButton = document.getElementById("start-timer");
  const timerCountdown = document.getElementById("timer-countdown");
  const partyPopper = document.getElementById("party-popper");

  function updateClocks() {
    const now = new Date();

    // Update analog clock
    drawAnalogClock(analogClock, now);

    // Update digital clock
    const hours = now.getHours() % 12 || 12;
    const minutes = String(now.getMinutes()).padStart(2, "0");
    const seconds = String(now.getSeconds()).padStart(2, "0");
    const ampm = now.getHours() >= 12 ? "PM" : "AM";
    digitalClock.textContent = `${hours}:${minutes}:${seconds} ${ampm}`;

    // Update timezone
    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    timeZoneElem.textContent = `Timezone: ${timeZone}`;

    // Update date
    const day = now.toLocaleString("default", { weekday: "long" });
    const date = now.toLocaleString("default", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
    currentDateElem.textContent = `${day}, ${date}`;
  }

  function startTimer() {
    const minutes = parseInt(timerInput.value);
    if (isNaN(minutes) || minutes <= 0) {
      alert("Please enter a valid number of minutes.");
      return;
    }

    const endTime = Date.now() + minutes * 60000;
    chrome.storage.local.set({ timerEndTime: endTime });
    updateTimer();
  }

  function updateTimer() {
    chrome.storage.local.get("timerEndTime", (data) => {
      const endTime = data.timerEndTime;
      if (!endTime) return;

      const timeRemaining = Math.max(0, endTime - Date.now());
      timerCountdown.textContent = formatTime(Math.floor(timeRemaining / 1000));

      if (timeRemaining <= 0) {
        chrome.storage.local.remove("timerEndTime");
        chrome.notifications.create("session-notification", {
          type: "basic",
          iconUrl: "assets/clock_icon.png",
          title: "Session Complete!",
          message: "Your timer session is complete!",
        });
        partyPopper.style.display = "block";
        setTimeout(() => {
          partyPopper.style.display = "none";
        }, 5000);
      } else {
        setTimeout(updateTimer, 1000);
      }
    });
  }

  function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  }

  startTimerButton.addEventListener("click", startTimer);

  setInterval(updateClocks, 1000);
  updateClocks();
  updateTimer();
});
