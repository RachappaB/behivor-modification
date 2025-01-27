

let tabTimeTracker = {}; // Object to track time spent on each tab
let lastSentTime = Date.now(); // Track the last time data was sent

chrome.runtime.onInstalled.addListener(() => {
  console.log("Smart Discipliner Data Collector installed");
});

// Listen for tab updates and track time
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === "complete" && tab.url) {
    const currentTime = Date.now();

    if (tabTimeTracker[tabId]) {
      tabTimeTracker[tabId].endTime = currentTime;
      const timeSpent = (tabTimeTracker[tabId].endTime - tabTimeTracker[tabId].startTime) / 1000;
      console.log(`Time spent on ${tabTimeTracker[tabId].url}: ${timeSpent} seconds`);
    }

    tabTimeTracker[tabId] = {
      url: tab.url,
      startTime: currentTime,
      endTime: null
    };
  }
});
















// Send data every minute
setInterval(() => {
    const currentTime = Date.now();
  
    Object.keys(tabTimeTracker).forEach(tabId => {
      const tracker = tabTimeTracker[tabId];
      if (tracker && tracker.startTime) {
        const timeSpent = (currentTime - tracker.startTime) / 1000;
        console.log(`Sending data: ${tracker.url} - ${timeSpent} seconds`);
  
        // Send the data to the backend
        fetch("http://127.0.0.1:5000/collect-data", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            url: tracker.url,
            timeSpent: timeSpent,
            timestamp: new Date().toISOString()
          })
        }).then(response => {
          console.log("Data sent successfully", response);
        }).catch(error => {
          console.error("Error sending data", error);
        });
      }
    });
  
    lastSentTime = currentTime;
  }, 60000);











  


// Clean up when tabs are removed
chrome.tabs.onRemoved.addListener((tabId) => {
    if (tabTimeTracker[tabId]) {
      const currentTime = Date.now();
      const timeSpent = (currentTime - tabTimeTracker[tabId].startTime) / 1000;
      console.log(`Tab closed. Time spent on ${tabTimeTracker[tabId].url}: ${timeSpent} seconds`);
  
      // Send the data to the backend
      fetch("http://127.0.0.1:5000/collect-data", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          url: tabTimeTracker[tabId].url,
          website_visiting:tabTimeTracker[tabId].url,
          timeSpent: timeSpent,
          timestamp: new Date().toISOString()
        })
      }).then(response => {
        console.log("Data sent successfully", response);
      }).catch(error => {
        console.error("Error sending data", error);
      });
  
      delete tabTimeTracker[tabId];
    }
  });
  
