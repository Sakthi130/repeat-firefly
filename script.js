// URL of the published Google Sheet as CSV
const sheetUrl = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vTloUnFAMvMNbNwA8AyO6ylMAGPKIQXJZjKP5jhGwt9kl51QmTXLFIJtSI1iQgCu9IYXXMwdFJYUvJW/pub?output=csv';

// Fetch and parse the sheet data
Papa.parse(sheetUrl, {
  download: true,
  header: true,
  complete: function(results) {
    const data = results.data.filter(row => row['Goals Name']); // filter out any empty rows
    const container = document.getElementById('cards-container');
    data.forEach(row => {
      // Create card element
      const card = document.createElement('div');
      card.className = 'relative bg-white rounded-xl shadow-md p-4 flex flex-col h-40 mb-6';

      // Title (Goals Name)
      const title = document.createElement("h2");
      title.className = "text-md font-semibold text-gray-700";
      title.textContent = row['Goals Name'] || '';
      card.appendChild(title);

      // Current Status (large center)
      const current = document.createElement('div');
      current.className = 'flex-grow flex items-center justify-center';
      const curText = document.createElement('div');
      curText.className = 'text-4xl font-bold text-gray-800';
      curText.textContent = row['Current Status'] || '';
      current.appendChild(curText);
      card.appendChild(current);

      // Yesterday Status (bottom center)
      const yesterday = document.createElement('div');
      yesterday.className = 'mt-auto text-xs text-gray-500 text-center';
      yesterday.textContent = `Yesterday: ${row['Yesterday Status'] || ''}`;
      card.appendChild(yesterday);

      // Determine progression arrow
      let arrow = '';
      const curVal = parseFloat(row['Current Status']);
      const prevVal = parseFloat(row['Yesterday Status']);
      if (!isNaN(curVal) && !isNaN(prevVal)) {
        if (curVal > prevVal) arrow = '🚀';
        else if (curVal < prevVal) arrow = '🔻';
        else arrow = '-';
      }
      // Arrow element (right middle)
      if (arrow) {
        const arrowEl = document.createElement('div');
        arrowEl.className = 'absolute right-4 top-1/2 transform -translate-y-1/2 text-2xl text-gray-700';
        arrowEl.textContent = arrow;
        card.appendChild(arrowEl);
      }

      container.appendChild(card);
    });
  }
});

// Function to schedule an alarm at a given hour and minute
function scheduleAlarm(hour, minute) {
  const now = new Date();
  let alarmTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hour, minute, 0);
  if (alarmTime <= now) {
    alarmTime.setDate(alarmTime.getDate() + 1); // Move alarm to the next day if the time has passed
  }
  const msUntil = alarmTime - now;

  setTimeout(() => {
    const audio = document.getElementById('alarmAudio');
    audio.play();

    // Stop after 5 seconds
    setTimeout(() => {
      audio.pause();
      audio.currentTime = 0;
    }, 10000);

    // Schedule for next day
    scheduleAlarm(hour, minute);
  }, msUntil);
}

document.addEventListener('click', () => {
  const audio = document.getElementById('alarmAudio');
  audio.play().then(() => {
    audio.pause(); // Immediately pause
    audio.currentTime = 0;
  }).catch(() => {});
});

// Schedule alarms for 11am, 3pm, and 6pm
scheduleAlarm(11, 0);
scheduleAlarm(15, 0);
scheduleAlarm(18, 0);

setInterval(() => {
  const event = new MouseEvent('click', {
    view: window,
    bubbles: true,
    cancelable: true
  });
  document.body.dispatchEvent(event);
}, 5 * 60 * 1000);
