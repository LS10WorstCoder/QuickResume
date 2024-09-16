chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    
    if (request.text) {
      
      console.log('Scraped text:', request.text);
    }
  });
  